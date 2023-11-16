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
import { Uploads } from "../../../../../types/index";

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
    navigate(`/create-listing/${thisPageNum + 1}`);
  }

  return (
    <form>
      <section>
        <header>Notice</header>
        <p>All fields are required unless their label ends with *</p>
        <p>
          All progress except image uploads will be kept until the browser is
          quit.
        </p>
        <p>Image uploads will be lost if the browser is refreshed.</p>
        <p>
          In the event that you navigate away from this form, you can resume
          progress via your profile or the site's top navigation menu.
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
