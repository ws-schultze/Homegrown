import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import {
  Image,
  ListingData,
  Uploads,
  VerifyActionName,
} from "../../../../../types/index";
import { initUploads } from "../../../../../initialValues";
import { ReactComponent as PlusIcon } from "../../assets/plusIcon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/deleteIcon.svg";
import EditFormSection from "../../shared/EditFormSection";
import ErrorMsg from "../../../../shared/errorMsg/ErrorMsg";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import {
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../../createListingPageSlice";
import styles from "../../styles.module.scss";
import FormCheck from "../../shared/FormCheck";
import { useNavigate } from "react-router";
import { handleFormVerification } from "../../utils/formUtils";
import { FormProps } from "../../types/formProps";
import Spinner from "../../../../shared/loaders/Spinner";

interface Props extends FormProps {
  /**
   * <uploads> are stored in the state of CreateListingPage because
   * it does not re-render when form pages change. <uploads> are also
   * stored in react state because files are non-serializable. If uploads were
   * stored in the local state of UploadsForm, then they would be
   * erased on page change, making the images not available for
   * submission to firestore on page 7 of CreateListingPage.
   */
  uploads: Uploads;
  /**
   * This is the set state action from CreateListingPage, where uploads
   * are temporarily stores before listing submission to firestore.
   */
  setUploads: Dispatch<SetStateAction<Uploads>>;
}

export default function UploadsForm(props: Props): JSX.Element {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.uploads;
  const stateName: keyof typeof listing = "apartmentBuilding";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("state is undefined");

  // const [uploads, setUploads] = useState<Uploads>(initUploads);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleUploads(files: File[]) {
    let images: Image[] = [];
    let tooBig: string[] = [];

    if (files.length > 0) {
      files.forEach((file) => {
        if (file.size <= 2000000) {
          // File is 2MB or less --> add it for uploading
          const url = URL.createObjectURL(file);
          images.push({
            file: file,
            name: makeFileNameForUpload(
              pageState.listing.userRef.uid,
              file.name
            ),
            url: url,
          });
        } else {
          // File is larger than 2MB
          tooBig.push(file.name);
        }
      });

      if (tooBig.length > 0) {
        toast.warn(`These files were larger than 2MB: \n ${tooBig}`);
      }

      const s: Uploads = {
        ...props.uploads,
        images: {
          ...props.uploads.images,
          value: [...props.uploads.images.value, ...images],
          valid: true,
          errorMsg: "",
        },
      };

      props.setUploads(s);
    } else {
      throw new Error("No files found");
    }
  }

  /**
   * Redirect the click event to the hidden input element
   */
  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  /**
   * Get files selected for upload
   */
  const onClickToUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleUploads([...(e.target.files || [])]);
  };

  /**
   * Handle drag event
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Add file(s) to local state when dropped
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUploads([...e.dataTransfer.files]);
  };

  /**
   * Remove the selected preview from local state
   */
  const onDelete = (e: React.MouseEvent, image: Image) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Delete this file from uploads?")) {
      const index = props.uploads.images.value
        .map((img) => img.url)
        .indexOf(image.url);

      let newValue: Image[] = [...props.uploads.images.value];
      newValue.splice(index, 1);

      // Remove deleted file from images.value
      if (newValue.length > 0) {
        const s: Uploads = {
          ...props.uploads,
          images: {
            ...props.uploads.images,
            value: newValue,
          },
        };
        props.setUploads(s);
        return;
      }

      // Last image removed, throw error message
      if (newValue.length === 0) {
        const s: Uploads = {
          ...props.uploads,
          images: {
            ...props.uploads.images,
            value: newValue,
            valid: false,
            errorMsg: "At least one image is required",
          },
        };
        props.setUploads(s);
        return;
      }
    }
  };

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<typeof state>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) => {
        /**
         * Must also lift up state to CreateListingPage
         */
        props.setUploads(obj);
        dispatch(
          setListing({
            ...pageState.listing,
            [stateName]: obj,
          })
        );
      },
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
        {props.uploads.images.value.length > 0 ? (
          <div className={styles.image_preview}>
            {props.uploads.images.value.map((image, index) => (
              <div key={index}>
                <div className={styles.card}>
                  <img src={image.url} alt="" />
                  <button disabled={state.readOnly} type="button">
                    <DeleteIcon
                      className={styles.delete}
                      onClick={(e) => onDelete(e, image)}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
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
        <ErrorMsg errorMsg={props.uploads.images.errorMsg} />
      </section>

      <FormCheck
        formState={props.uploads}
        initialFormState={initUploads}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
