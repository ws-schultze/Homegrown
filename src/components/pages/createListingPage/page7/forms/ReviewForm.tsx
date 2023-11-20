import {
  FetchedListing,
  Image,
  ListingData,
  TypeLatLng,
  Uploads,
} from "../../../../../types/index";
import { db } from "../../../../../firebase.config";
import { ReactComponent as BellSVG } from "../../assets/bell-regular.svg";
import { ReactComponent as WarningSVG } from "../../assets/warningSign.svg";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import { toast } from "react-toastify";
import useDeleteNotYetSubmittedListing from "../../hooks/useDeleteNotYetSubmittedListing";
import useDeleteListingFromFirestore from "../../hooks/useDeleteListingFromFirestore";
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
     * Store an image in firestore
     * @param file File
     * @returns {file: undefined, url: string} of Image
     */
    async function storeImage(file: File): Promise<Image> {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = makeFileNameForUpload(
          pageState.listing.userRef.uid,
          file.name
        );
        const storageRef = ref(storage, "images/" + fileName);
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
            setLoading(false);
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

    const _images = await Promise.all(
      props.uploads.images.value.map((image) => storeImage(image.file!))
    ).catch(() => {
      setLoading(false);
      toast.warn("All images must be 2MB or less.");
      console.warn("All images must be 2MB or less, image upload failed.");
      return;
    });

    let formDataCopy: ListingData = { ...pageState.listing };

    if (_images && _images.length > 0) {
      formDataCopy = {
        ...pageState.listing,
        uploads: {
          ...props.uploads,
          images: {
            ...props.uploads.images,
            value: _images,
          },
        },
        timestamp: serverTimestamp(),
      };

      /**
       * Upload formDataCopy to Firestore
       */
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);

      /**
       * Listing form data submitted successfully
       */

      dispatch(setLoading(false));
      // localStorage.removeItem("unfinished-listing");
      dispatch(reset());
      const listingToOverlay: FetchedListing = {
        id: docRef.id,
        data: formDataCopy,
      };
      dispatch(setHoveredListing(listingToOverlay));
      dispatch(setListingToOverlay(listingToOverlay));
      const mapCenter: TypeLatLng = {
        lat: formDataCopy.address.geolocation.value.lat,
        lng: formDataCopy.address.geolocation.value.lng,
      };
      dispatch(setMapCenter(mapCenter));
      navigate(
        `/explore-listings/details/${formDataCopy.address.formattedAddress.value}/${docRef.id}`
      );
      toast.success(
        "Listing created successfully. Refresh the page to see it on the map."
      );
    } else {
      toast.warn("Uploading at least one image is required!");
      setLoading(false);
      throw new Error("Uploading at least one image is required!");
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
