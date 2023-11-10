import styles from "../styles.module.scss";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import {
  setCurrentPageNumber,
  setSavedPages,
  setUserAcknowledged,
} from "../createListingPageSlice";
import Pagination from "./Pagination";
import { useNavigate } from "react-router";

export default function UserAcknowledgementForm(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useAppSelector((s) => s.createListingPage);

  function handleClick() {
    dispatch(setUserAcknowledged(true));
    dispatch(setSavedPages([1, 2]));
    dispatch(setCurrentPageNumber(2));
    navigate("/create-listing/2");
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
