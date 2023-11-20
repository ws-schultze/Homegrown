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
import {
  addDoc,
  collection,
  doc,
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
import useDeleteListingFromFirestore from "../../hooks/useDeleteListingFromFirestore";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { reset, setLoading } from "../../editListingPageSlice";
import {
  setHoveredListing,
  setListingToOverlay,
  setMapCenter,
} from "../../../exploreListingsPage/exploreListingsPageSlice";

interface Props extends FormProps {}

export default function ReviewForm(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.editListingPage);
  const params = useParams();

  const { deleteListingFromFirestore } = useDeleteListingFromFirestore(
    pageState.listing.uploads.images,
    params
  );

  function goToPage(num: number) {
    navigate(`/edit-listing/${num}/${params.listingId}`);
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

    let formDataCopy: ListingData = { ...pageState.listing };
    const update = { id: params.listingId, data: formDataCopy };

    if (params.listingId) {
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, update);

      /**
       * Listing update submitted successfully
       */
      dispatch(setLoading(false));
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
        "Listing updates successfully. Refresh the page to see it on the map."
      );
    } else {
      console.error("params.listingId is undefined.");
      dispatch(setLoading(false));

      return;
    }
  }

  const disableBtns = pageState.unsavedPages.length > 0 ? true : false;

  // const noImagesFound = props.uploads.images.value.length === 0 ? true : false;

  return (
    <form>
      <section>
        {disableBtns ? (
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
              pageState.unsavedPages.indexOf(6) >= 0 ? styles.incomplete : ""
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
          } `}
          onClick={handleSubmit}
        >
          Submit Update
        </button>

        <button
          type="button"
          className={`${styles.delete_btn} ${
            disableBtns ? styles.disabled : ""
          }`}
          onClick={deleteListingFromFirestore}
        >
          Delete Listing
        </button>
        <button
          className={`${styles.btn} ${disableBtns ? styles.disabled : ""}`}
          onClick={() => navigate("/profile")}
        >
          Cancel Update
        </button>
      </div>
    </form>
  );
}
