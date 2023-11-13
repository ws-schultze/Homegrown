// For more examples of drag and drop events, check out this post:
// https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/

import React, { useState, useEffect, useRef } from "react";
import Spinner from "../../../../shared/loaders/Spinner";
import { toast } from "react-toastify";
import PageBtns from "../../shared/PageBtns-old";
import {
  AddressValidationApi_Response,
  Image,
  ListingData,
  Uploads,
  VerifyActionName,
} from "../../../../../types/index";
import { initUploads } from "../../../../../initialValues";
import SaveSection from "../../shared/SaveSection";
import { ReactComponent as PlusIcon } from "../../assets/svg/plusIcon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/svg/deleteIcon.svg";
import VerifySection from "../../shared/VerifySection";
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

interface Props {
  parent: ListingData;
  listingId: string;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
}

export default function UploadsEditForm({
  parent,
  listingId,
  prevPage,
  nextPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props): JSX.Element {
  const [state, setState] = useState<Uploads>(parent.uploads);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false); // used for conditional styling
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Keeps inputs showing values from parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    setState(parent.uploads);
  }, [parent]);

  /**
   * Given a selection if images, discard any that have a name that matches
   * an existing upload's name, then upload the remaining unique images to firestore
   * and update the listing in firestore.
   * @param files selected images to be uploaded
   */
  async function handleUploads(files: File[]) {
    console.log("handling uploads...");

    // Create an array of images that are to be uploaded

    if (files.length > 0) {
      let images: Image[] = [];
      let toBig: string[] = [];

      files.forEach((file) => {
        if (file.size <= 2000000) {
          // File is 2MB or less --> add it for uploading
          const url = URL.createObjectURL(file);
          images.push({
            file: file,
            name: makeFileNameForUpload(parent.userRef.uid, file.name),
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

      setLoading(true);
      await Promise.all(
        images.map((img) =>
          storeImageInFirestore({
            file: img.file!,
            userUID: parent.userRef.uid!,
          })
        )
      )
        .then((uploaded) => {
          // Upload success
          const s: ListingData = {
            ...parent,
            uploads: {
              ...parent.uploads,
              images: {
                ...state.images,
                value: [...state.images.value, ...uploaded],
                valid: true,
                errorMsg: "",
              },
            },
            timestamp: serverTimestamp(),
          };
          setLoading(false);
          emit(s);
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
      const formDataCopy: DocumentData = { ...parent };
      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, formDataCopy);
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
    setLoading(true);

    if (dragActive === false) {
      handleUploads([...(e.target.files || [])]);
    }

    setLoading(false);
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

      setLoading(true);

      const s: ListingData = {
        ...parent,
        uploads: {
          ...parent.uploads,
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
      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, formDataCopy);

      // Update parent to reflect changes without having to reload page
      emit(s);

      // Delete images from firestore
      await deleteImageFromFirestore(image);

      setLoading(false);
    }
  }

  /**
   * Handle when the user clicks "Yes" everything looks correct.
   * Update uploads and emit to parent.
   */
  function handleVerify(
    actionName: VerifyActionName,
    obj: typeof state,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        uploads: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        uploads: obj,
        currentPage: 7,
        savedPages: [1, 2, 3, 4, 5, 6, 7],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        uploads: obj,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
    } else {
      throw new Error("Whoops");
    }
  }

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection parent={state} emit={handleVerify} />
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

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initUploads}
          emit={handleVerify}
          deleteListing={deleteListing}
        />
      ) : null}

      {state.beingVerified === true ? (
        <VerifySection<typeof state>
          parentName="Image"
          parent={state}
          emit={handleVerify}
        />
      ) : null}

      {state.saved === true ? (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      ) : (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      )}
    </form>
  );
}
