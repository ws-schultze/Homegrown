// For more examples of drag and drop events, check out this post:
// https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/

import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import Spinner from "../../../../shared/loaders/Spinner";
import { toast } from "react-toastify";

import {
  Image,
  ListingData,
  Uploads,
  VerifyActionName,
} from "../../../../../types/index";
import { ReactComponent as PlusIcon } from "../../assets/plusIcon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/deleteIcon.svg";
import EditFormSection from "../../shared/EditFormSection";
import ErrorMsg from "../../../../shared/errorMsg/ErrorMsg";
import deleteImageFromFirestore from "../../../utils/deleteImageFromFirestore";
import storeImageInFirestore from "../../../utils/storeImageInFirestore";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import {
  DocumentData,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../../firebase.config";
import styles from "../../styles.module.scss";
import FormCheck from "../../shared/FormCheck";
import { handleFormVerification } from "../../utils/formUtils";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { FormProps } from "../../types/formProps";
import {
  setListing,
  setLoading,
  setSavedPages,
  setUnsavedPages,
} from "../../editListingPageSlice";
import { initUploads } from "../../../../../initialValues";

interface Props extends FormProps {
  uploads: Uploads;
  setUploads: Dispatch<SetStateAction<Uploads>>;
}

export default function UploadsEditForm(props: Props): JSX.Element {
  const pageState = useAppSelector((s) => s.editListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.uploads;
  const stateName: keyof typeof listing = "uploads";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [dragActive, setDragActive] = useState(false); // used for conditional styling
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listingId = params.listingId;

  if (!listingId) throw new Error("listingId param is undefined");

  /**
   * Given a selection if images, discard any that have a name that matches
   * an existing upload's name, then upload the remaining unique images to firestore
   * and update the listing in firestore.
   * @param files selected images to be uploaded
   */
  async function handleUploads(files: File[]) {
    console.log("updating uploads...");

    if (files.length > 0) {
      let images: Image[] = [];
      let toBig: string[] = [];

      files.forEach((file) => {
        if (file.size <= 2000000) {
          // File is 2MB or less --> add it for uploading
          const url = URL.createObjectURL(file);
          images.push({
            file: file,
            name: makeFileNameForUpload(listing.userRef.uid, file.name),
            url: url,
          });
        } else {
          // File is larger than 2MB
          toBig.push(file.name);
        }
      });

      if (toBig.length > 0) {
        toast.warn(`These files were larger than 2MB: \n ${toBig}`);
      }

      dispatch(setLoading(true));
      await Promise.all(
        images.map((img) =>
          storeImageInFirestore({
            file: img.file!,
            userUID: listing.userRef.uid!,
            listingId: listingId!,
          })
        )
      )
        .then((uploaded) => {
          // const now = new Date();
          // const isoString = now.toISOString();
          // Upload success
          const s: ListingData = {
            ...listing,
            uploads: {
              ...listing.uploads,
              images: {
                ...state.images,
                value: [...state.images.value, ...uploaded],
                valid: true,
                errorMsg: "",
              },
            },
            timestamp: serverTimestamp(),
          };

          dispatch(setListing(s));
          dispatch(setLoading(false));
          console.log("Image upload successful...");
        })
        .catch(() => {
          // Upload failure
          setLoading(false);
          console.warn("Image upload failed");
          toast.error("Image upload failed... Please try again");
          return;
        });

      // Update listing in firestore
      const formDataCopy: DocumentData = { ...listing };
      if (listingId) {
        const docRef = doc(db, "listings", listingId);
        await updateDoc(docRef, formDataCopy);
      } else {
        throw new Error("param of listingId is undefined");
      }
    } else {
      console.warn("No image uploads found");
    }
  }

  /**
   * Redirect the click event to the hidden input element
   */
  function handleInputClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  /**
   * Get files selected for upload
   */
  function onClickToUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (dragActive === false) {
      handleUploads([...(e.target.files || [])]);
    }
  }

  /**
   *  Handle drag events
   */
  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  /**
   * Add file(s) to local state when dropped
   */
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleUploads([...e.dataTransfer.files]);
    }
  }

  /**
   * Remove the selected preview from local state
   */
  async function onDelete(e: React.MouseEvent, image: Image) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this file from uploads?")) {
      const index = state.images.value.map((img) => img.url).indexOf(image.url);

      let uploads: Image[] = [...state.images.value];

      // Delete image from listings
      uploads.splice(index, 1);

      dispatch(setLoading(true));

      const s: ListingData = {
        ...listing,
        uploads: {
          ...listing.uploads,
          images: {
            ...state.images,
            value: uploads,
            valid: uploads.length > 0 ? true : false,
            errorMsg:
              uploads.length > 0 ? "" : "At least one image is required",
          },
        },
        timestamp: serverTimestamp(),
      };

      // Update listing in firestore
      const formDataCopy: DocumentData = { ...s };
      if (listingId) {
        const docRef = doc(db, "listings", listingId);
        await updateDoc(docRef, formDataCopy);

        // Update parent to reflect changes without having to reload page
        // emit(s);
        dispatch(setListing(s));

        // Delete images from firestore
        await deleteImageFromFirestore(image);

        setLoading(false);
      } else {
        throw new Error("param of <listingId> is undefined");
      }
    }
  }

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<typeof state>({
      pageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      listingId: params.listingId!,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            [stateName]: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  if (pageState.loading) {
    return <Spinner size="large" />;
  }

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection
            parent={state}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Images</header>
        <p>The first image will be the listing's cover.</p>
        {state.images.value.length > 0 && (
          <div className={styles.image_preview}>
            <>
              {state.images.value.map((image, index) => (
                <div key={index}>
                  <div className={styles.card}>
                    <img src={image.url} alt="" />
                    <button type="button" disabled={state.readOnly}>
                      <DeleteIcon
                        className={styles.delete}
                        onClick={(e) => onDelete(e, image)}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </>
          </div>
        )}
        <div
          className={styles.input_file_wrap}
          draggable
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            style={{ display: "none" }}
            type="file"
            id="listing-form__input-file"
            onChange={onClickToUpload}
            accept=".jpg,.png,.jpeg"
            multiple
            disabled={state.readOnly}
          />
          <label
            htmlFor="listing-form__input-file"
            className={dragActive ? styles.drag_active : ""}
          >
            <button disabled={state.readOnly} onClick={handleInputClick}>
              Drag and drop or click to add your file(s)
              <PlusIcon className={styles.icon} />
            </button>
          </label>
        </div>
        <ErrorMsg errorMsg={state.images.errorMsg} />
      </section>

      <FormCheck
        formState={state}
        initialFormState={initUploads}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
