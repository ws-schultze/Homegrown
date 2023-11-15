import styles from "../../styles.module.scss";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import {
  setNewListingInProgress,
  setSavedPages,
  setUnsavedPages,
  setUserAcknowledged,
} from "../../createListingPageSlice";
import { useNavigate } from "react-router";

export default function UserAcknowledgementForm({
  thisPageNum,
}: {
  /**
   * Used by handleVerify to add this page number to the array of
   * saved pages in the createListingPage state
   */
  thisPageNum: number;
}): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useAppSelector((s) => s.createListingPage);

  function handleClick() {
    dispatch(setNewListingInProgress(true));
    dispatch(setUserAcknowledged(true));

    // // Don't add page one to saved pages if it is already saved
    // if (pageState.savedPages.indexOf(1) >= 0) {
    // }

    // dispatch(setSavedPages(pageState.savedPages.concat(thisPageNum)));

    // const idx = pageState.unsavedPages.indexOf(1);
    // const unsavedPagesCopy = [...pageState.unsavedPages];
    // unsavedPagesCopy.splice(idx, 1);
    // console.log(unsavedPagesCopy);
    // dispatch(setUnsavedPages(unsavedPagesCopy));

    navigate(`/create-listing/${thisPageNum + 1}`);
  }

  return (
    <form>
      <section>
        <header>Notice</header>
        <p>All fields are required unless their label ends with *</p>
        <p>Any unsaved progress will be lost if you refresh the browser.</p>
        <p>Saved progress will be kept until the browser is closed.</p>
        <p>
          Saved progress may be accessed from your profile in the event that you
          navigate away from this form.
        </p>
        <button
          type="button"
          className={`btn ${styles.btn} ${
            pageState.userAcknowledged === true ? "active" : ""
          }`}
          onClick={handleClick}
        >
          I understand
        </button>
      </section>
    </form>
  );
}
