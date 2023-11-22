import {
  FetchedListing,
  TypeFetchedListingData,
  TypeLatLng,
} from "../../../../../types/index";
import { db } from "../../../../../firebase.config";
import { ReactComponent as BellSVG } from "../../assets/bell-regular.svg";
import { ReactComponent as WarningSVG } from "../../assets/warningSign.svg";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useDeleteListingFromFirestore from "../../hooks/useDeleteListingFromFirestore";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { reset, setLoading } from "../../editListingPageSlice";
import {
  setHoveredListing,
  setListingToOverlay,
  setMapCenter,
  setShowFullOverlay,
} from "../../../exploreListingsPage/exploreListingsPageSlice";
import { useScreenSizeContext } from "../../../../../ScreenSizeProvider";

interface Props extends FormProps {}

export default function ReviewForm(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.editListingPage);
  const params = useParams();
  const screenSize = useScreenSizeContext();

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

    let _listing: TypeFetchedListingData = {
      ...pageState.listing,
      timestamp: new Date(),
    };

    if (params.listingId) {
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, _listing)
        .then(() => {
          /**
           * Update listing in redux store after making the timestamp serializable
           */
          const { timestamp, ...rest } = _listing;
          const data = {
            ...rest,
            timestamp: JSON.stringify(_listing.timestamp),
          };

          /**
           * Listing update submitted successfully
           */
          dispatch(setLoading(false));
          dispatch(reset());
          const listingToOverlay: FetchedListing = {
            id: docRef.id,
            data: data,
          };
          dispatch(setHoveredListing(listingToOverlay));
          dispatch(setListingToOverlay(listingToOverlay));
          const mapCenter: TypeLatLng = {
            lat: data.address.geolocation.value.lat,
            lng: data.address.geolocation.value.lng,
          };
          dispatch(setMapCenter(mapCenter));
          if (screenSize === "desktop") {
            dispatch(setShowFullOverlay(true));
          }
          navigate(
            `/explore-listings/details/${data.address.formattedAddress.value}/${docRef.id}`
          );
          toast.success(
            "Listing updated successfully. Refresh the page to see the changes."
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong. Please try again later.");
          dispatch(setLoading(false));
        });
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
