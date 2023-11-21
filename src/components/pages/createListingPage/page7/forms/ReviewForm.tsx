import {
  FetchedListing,
  Image,
  TypeLatLng,
  Uploads,
} from "../../../../../types/index";
import { db } from "../../../../../firebase.config";
import { ReactComponent as BellSVG } from "../../assets/bell-regular.svg";
import { ReactComponent as WarningSVG } from "../../assets/warningSign.svg";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import { toast } from "react-toastify";
import useDeleteNotYetSubmittedListing from "../../hooks/useDeleteNotYetSubmittedListing";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { reset, setLoading } from "../../createListingPageSlice";
import {
  setHoveredListing,
  setListingToOverlay,
  setMapCenter,
} from "../../../exploreListingsPage/exploreListingsPageSlice";

interface Props extends FormProps {
  /**
   * <uploads> are stored in CreateListingPage state because they contain files
   * which are non serializable.
   */
  uploads: Uploads;
}

export default function ReviewForm(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);

  const { deleteNotYetSubmittedListing } = useDeleteNotYetSubmittedListing();

  function goToPage(num: number) {
    navigate(`/create-listing/${num}`);
  }

  /**
   * Handle the forms submission
   * @param e FormEvent - submit state
   */
  async function handleSubmit() {
    // Make sure that all pages are saved and validated
    if (pageState.unsavedPages.length > 0) {
      toast.error(
        "Finish any pages with a review button that is highlighted in red"
      );
      return;
    }

    dispatch(setLoading(true));

    /** 
     First we need to upload the listing data to firestore, without the images, so that we can get the docRef.id, after listing creation, and then update the newly created listing, to include images, which will be located in </images/docRef.id/imageName>.
     */

    /**
     * On the initial doc creation, exclude images
     */
    // const { images, ...rest } = props.uploads;

    const uploadsWithoutImages = {
      ...pageState.listing,
      /**
       * Adding uploads 👇 here was causing the "Insufficient permissions" error
       * when trying to upload to storage
       */
      // uploads: {
      //   ...rest,
      // },
      timestamp: serverTimestamp(),
    };

    /**
     * Upload dataToSubmit to Firestore
     */
    const docRef = await addDoc(
      collection(db, "listings"),
      uploadsWithoutImages
    ).catch((error) => {
      dispatch(setLoading(false));
      toast.error(error.message);
      console.error(error);
      return;
    });

    /**
     * If the docRef exists, then we can upload the images to storage
     * using the docRef.id as the folder name
     */
    if (docRef) {
      /**
       * Now that we have the docRef.id, we can upload the images to storage,
       * in a folder named after the docRef.id (/images/docRef.id/image.name)
       */
      const uploadedImages = await Promise.all(
        props.uploads.images.value.map((image) => storeImage(image.file!))
      ).catch((error) => {
        dispatch(setLoading(false));
        toast.error(error.message);
        console.error(error.message);
        return;
      });

      /**
       * Store an image in firestore at /images/docRef.id/image.name
       * @param file File
       * @returns Promise<Image>
       */
      async function storeImage(file: File): Promise<Image> {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = makeFileNameForUpload(
            pageState.listing.userRef.uid,
            file.name
          );
          if (!docRef) {
            throw new Error("Bad docRef.");
          }
          const storageRef = ref(storage, `images/${docRef.id}/` + fileName);
          // const storageRef = ref(storage, `images/test/` + fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);

          if (!pageState.listing.userRef.uid) {
            throw new Error("Bad userRef.uid");
          } else if (!file.name) {
            throw new Error("Bad file.name");
          } else if (!fileName) {
            throw new Error("Bad fileName.");
          } else if (!storageRef) {
            throw new Error("Bad storageRef.");
          } else if (!uploadTask) {
            throw new Error("Bad uploadTask.");
          }

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              reject(error);
              dispatch(setLoading(false));
              toast.error(error.message);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve({ name: fileName, url: downloadURL });
              });
            }
          );
        });
      }

      if (uploadedImages && uploadedImages.length > 0) {
        const dataWithUploads = {
          ...pageState.listing,
          uploads: {
            ...props.uploads,
            images: {
              ...props.uploads.images,
              value: uploadedImages,
            },
          },
          timestamp: serverTimestamp(),
        };

        if (docRef) {
          await updateDoc(docRef, dataWithUploads);

          /**
           * Listing form data submitted successfully
           */
          dispatch(setLoading(false));
          dispatch(reset());
          const listingToOverlay: FetchedListing = {
            id: docRef.id,
            data: dataWithUploads,
          };
          dispatch(setHoveredListing(listingToOverlay));
          dispatch(setListingToOverlay(listingToOverlay));
          const mapCenter: TypeLatLng = {
            lat: dataWithUploads.address.geolocation.value.lat,
            lng: dataWithUploads.address.geolocation.value.lng,
          };
          dispatch(setMapCenter(mapCenter));
          navigate(
            `/explore-listings/details/${dataWithUploads.address.formattedAddress.value}/${docRef.id}`
          );
          toast.success(
            "Listing created successfully. Refresh the page to see it on the map."
          );
        } else {
          toast.warn("Uploading at least one image is required!");
          setLoading(false);
          throw new Error("Uploading at least one image is required!");
        }

        dispatch(setLoading(false));
      }
    }
  }

  const disableBtns =
    pageState.unsavedPages.length > 0 || props.uploads.images.value.length === 0
      ? true
      : false;

  const noImagesFound = props.uploads.images.value.length === 0 ? true : false;

  return (
    <form>
      <section>
        {disableBtns || noImagesFound ? (
          <div className={styles.review_warning}>
            <WarningSVG />
            Pages with a red review button have not been finished yet. Please go
            complete them before submitting your listing.
          </div>
        ) : (
          <div className={styles.notice}>
            <BellSVG />
            Review any parts of this listing before submission, if you want to.
          </div>
        )}

        {/* Page 1 -- User Acknowledgment */}
        <div className={styles.review_row}>
          1. Notice
          <button
            className={`${styles.btn} ${
              pageState.userAcknowledged ? "" : styles.incomplete
            }`}
            type="button"
            onClick={() => goToPage(1)}
          >
            Review
          </button>
        </div>

        {/* Page 2 -- Basic Info */}
        <div className={styles.review_row}>
          2. Basics
          <button
            className={`${styles.btn} ${
              pageState.unsavedPages.indexOf(2) >= 0 ? styles.incomplete : ""
            }`}
            type="button"
            onClick={() => goToPage(2)}
          >
            Review
          </button>
        </div>

        {/* Page 3 -- Listing Address */}
        <div className={styles.review_row}>
          3. Address
          <button
            className={`${styles.btn} ${
              pageState.unsavedPages.indexOf(3) >= 0 ? styles.incomplete : ""
            }`}
            type="button"
            onClick={() => goToPage(3)}
          >
            Review
          </button>
        </div>

        {/* Page 4 -- Lister */}
        <div className={styles.review_row}>
          4. Listed by
          <button
            className={`${styles.btn} ${
              pageState.unsavedPages.indexOf(4) >= 0 ? styles.incomplete : ""
            }`}
            type="button"
            onClick={() => goToPage(4)}
          >
            Review
          </button>
        </div>

        {/* Page 5 -- Listing Kind */}
        <div className={styles.review_row}>
          5. Features
          <button
            className={`${styles.btn} ${
              pageState.unsavedPages.indexOf(5) >= 0 ? styles.incomplete : ""
            }`}
            type="button"
            onClick={() => goToPage(5)}
          >
            Review
          </button>
        </div>

        {/* Page 6 -- Images */}
        <div className={styles.review_row}>
          6. Images
          <button
            className={`${styles.btn} ${
              pageState.unsavedPages.indexOf(6) >= 0 || noImagesFound
                ? styles.incomplete
                : ""
            }`}
            type="button"
            onClick={() => goToPage(6)}
          >
            Review
          </button>
        </div>
      </section>

      <div className={styles.review_bottom_btns}>
        <button
          type="button"
          className={`${styles.submit_btn} ${
            disableBtns ? styles.disabled : ""
          }`}
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          type="button"
          className={`${styles.delete_btn}`}
          onClick={deleteNotYetSubmittedListing}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
