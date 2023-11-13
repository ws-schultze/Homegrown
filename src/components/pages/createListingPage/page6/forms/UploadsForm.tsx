import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  AddressValidationApi_Response,
  Image,
  Uploads,
  VerifyActionName,
} from "../../../../../types/index";
import { initUploads } from "../../../../../initialValues";
import SaveSection from "../../shared/SaveSection";
import { ReactComponent as PlusIcon } from "../../assets/plusIcon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/deleteIcon.svg";
import VerifySection from "../../shared/VerifySection";
import EditFormSection from "../../shared/EditFormSection";
import ErrorMsg from "../../../../shared/errorMsg/ErrorMsg";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import {
  setCurrentPageNumber,
  setListing,
  setSavedPages,
} from "../../createListingPageSlice";
import styles from "../../styles.module.scss";

export default function UploadsForm(): JSX.Element {
  const [uploads, setUploads] = useState<Uploads>(initUploads);
  const pageState = useAppSelector((s) => s.createListingPage);
  const dispatch = useDispatch();

  const [dragActive, setDragActive] = useState(false); // used for conditional styling
  const inputRef = useRef<HTMLInputElement | null>(null);

  // // Re-render once the parent is updated, to make save and verify work
  // useEffect(() => {
  //   setState(parent.uploads);
  // }, [parent]);

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

      setUploads((s) => ({
        ...s,
        images: {
          ...s.images,
          value: [...uploads.images.value, ...images],
          valid: true,
          errorMsg: "",
        },
      }));

      setUploads((u) => ({
        ...u,
      }));
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

  // For more examples of drag and drop events, check out this post:
  // https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/

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
      const index = uploads.images.value
        .map((img) => img.url)
        .indexOf(image.url);

      let newValue: Image[] = [...uploads.images.value];
      newValue.splice(index, 1);

      if (newValue.length > 0) {
        setUploads((s) => ({
          ...s,
          images: {
            ...s.images,
            value: newValue,
          },
        }));
      } else {
        setUploads((s) => ({
          ...s,
          images: {
            ...s.images,
            value: newValue,
            valid: false,
            errorMsg: "At least one image is required",
          },
        }));
      }
    }
  };

  function handleVerify(
    actionName: VerifyActionName,
    obj: typeof uploads,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      dispatch(setListing({ ...pageState.listing, uploads: obj }));
    } else if (actionName === "verify" && obj.saved === true) {
      dispatch(setListing({ ...pageState.listing, uploads: obj }));
      dispatch(setSavedPages([1, 2, 3, 4, 5, 6, 7]));
      dispatch(setCurrentPageNumber(7));
    } else if (actionName === "verify" && obj.saved === false) {
      dispatch(setListing({ ...pageState.listing, uploads: obj }));
      dispatch(setSavedPages([1, 2, 3, 4, 5, 6]));
    } else {
      throw new Error("Whoops");
    }
  }

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <form>
      {pageState.listing.uploads.saved === true ? (
        <section>
          <EditFormSection
            parent={pageState.listing.uploads}
            emit={handleVerify}
          />
        </section>
      ) : null}

      <section>
        <header>Images</header>
        <p>The first image will be the listing's cover.</p>
        {pageState.listing.uploads.images.value.length > 0 && (
          <div className={styles.image_preview}>
            <>
              {pageState.listing.uploads.images.value.map((image, index) => (
                <div key={index}>
                  <div className={styles.card}>
                    <img src={image.url} alt="" />
                    <button
                      disabled={pageState.listing.uploads.readOnly}
                      type="button"
                    >
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
            disabled={pageState.listing.uploads.readOnly}
          />
          <label
            htmlFor="listing-form__input-file"
            className={dragActive ? styles.drag_active : ""}
          >
            <button
              disabled={pageState.listing.uploads.readOnly}
              onClick={handleInputClick}
            >
              Drag and drop or click to add your file(s)
              <PlusIcon className={styles.icon} />
            </button>
          </label>
        </div>
        <ErrorMsg errorMsg={pageState.listing.uploads.images.errorMsg} />
      </section>

      {pageState.listing.uploads.saved === false &&
      pageState.listing.uploads.beingVerified === false ? (
        <SaveSection<typeof pageState.listing.uploads>
          needsAddressValidation={false}
          parent={pageState.listing.uploads}
          parentInitialState={initUploads}
          emit={handleVerify}
        />
      ) : null}

      {pageState.listing.uploads.beingVerified === true ? (
        <VerifySection<typeof pageState.listing.uploads>
          parentName="Image"
          parent={pageState.listing.uploads}
          emit={handleVerify}
        />
      ) : null}
    </form>
  );
}
