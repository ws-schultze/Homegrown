import React, { useState, useEffect, useRef } from "react";
// import Spinner from "../../../loaders/Spinner";
import { toast } from "react-toastify";
import PageBtns from "./PageBtns";
import {
  TypeAddressValidationApi_Response,
  TypeImage,
  TypeListingData,
  TypeUploads,
  TypeVerifyActionName,
} from "../../../..";
import { initUploads } from "../../../../initialValues";
import SaveSection from "./SaveSection";
import { ReactComponent as PlusIcon } from "../../../../assets/svg/plusIcon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/svg/deleteIcon.svg";
import VerifySection from "./VerifySection";
import EditFormSection from "./EditFormSection";
import ErrorMsg from "./ErrorMsg";
import makeFileNameForUpload from "../../utils/makeFileNameForUpload";
import { Header } from "./styledComponents";

interface Props {
  parent: TypeListingData;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: TypeListingData) => void;
}

export default function UploadsForm({
  parent,
  prevPage,
  nextPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props): JSX.Element {
  const [state, setState] = useState<TypeUploads>(parent.uploads);
  // const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false); // used for conditional styling
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Re-render once the parent is updated, to make save and verify work
  useEffect(() => {
    setState(parent.uploads);
  }, [parent]);

  function handleUploads(files: File[]) {
    let images: TypeImage[] = [];
    let toBig: string[] = [];

    if (files.length > 0) {
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

      setState((s) => ({
        ...s,
        images: {
          ...s.images,
          value: [...state.images.value, ...images],
          valid: true,
          errorMsg: "",
        },
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
  const onDelete = (e: React.MouseEvent, image: TypeImage) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Delete this file from uploads?")) {
      const index = state.images.value.map((img) => img.url).indexOf(image.url);

      let newValue: TypeImage[] = [...state.images.value];
      newValue.splice(index, 1);

      if (newValue.length > 0) {
        setState((s) => ({
          ...s,
          images: {
            ...s.images,
            value: newValue,
          },
        }));
      } else {
        setState((s) => ({
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
    actionName: TypeVerifyActionName,
    obj: typeof state,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      console.log("saving");
      emit({
        ...parent,
        uploads: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        uploads: obj,
        page: 7,
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

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <>
      {state.saved === true ? (
        <div className="listing-form__section">
          <EditFormSection parent={state} emit={handleVerify} />
        </div>
      ) : null}

      <div className="listing-form__section">
        <Header>Images</Header>
        <p>The first image will be the listing's cover.</p>
        {state.images.value.length > 0 && (
          <div className="listing-form__image-preview">
            <>
              {state.images.value.map((image, index) => (
                <div key={index}>
                  <div className="listing-form__image-preview-card">
                    <img src={image.url} alt="" />
                    <button disabled={state.readOnly} type="button">
                      <DeleteIcon
                        className="listing-form__image-preview__delete-icon"
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
          className="listing-form__input-file-wrap"
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
            className={`listing-form__input-file-label ${
              dragActive ? "dragActive" : ""
            }`}
          >
            <div className="listing-form__input-file__btn-wrap">
              <label>Drag and drop or click to add your file(s)</label>
              <button
                disabled={state.readOnly}
                onClick={handleInputClick}
                className="listing-form__input-file__btn"
              >
                <PlusIcon className="listing-form__input-file__btn__icon" />
              </button>
            </div>
          </label>
        </div>
        <ErrorMsg errorMsg={state.images.errorMsg} />
      </div>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initUploads}
          emit={handleVerify}
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
    </>
  );
}
