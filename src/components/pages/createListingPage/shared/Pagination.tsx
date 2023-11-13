import { useDispatch } from "react-redux";
import { ReactComponent as ArrowLeftSVG } from "../../../../assets/svg/arrow-left-solid.svg";
import { ReactComponent as ArrowRightSVG } from "../../../../assets/svg/arrow-right-solid.svg";
import styles from "../styles.module.scss";
import { setCurrentPageNumber } from "../createListingPageSlice";
import { useAppSelector } from "../../../../redux/hooks";
import { useNavigate } from "react-router";

export default function Pagination(): JSX.Element {
  const dispatch = useDispatch();
  const state = useAppSelector((s) => s.createListingPage);
  const navigate = useNavigate();

  function nextPage() {
    // dispatch(setCurrentPageNumber(state.currentPageNumber + 1));
    navigate(`/create-listing/${state.currentPageNumber + 1}`);
  }

  function prevPage() {
    // dispatch(setCurrentPageNumber(state.currentPageNumber - 1));
    navigate(`/create-listing/${state.currentPageNumber - 1}`);
  }

  function toPageNumber(num: number) {
    // dispatch(setCurrentPageNumber(num));
    navigate(`/create-listing/${num}`);
  }

  return (
    <div className={styles.pagination}>
      {state.currentPageNumber === 1 ? null : (
        <button
          className={`btn ${styles.btn} ${styles.page_btn}`}
          type="button"
          onClick={prevPage}
        >
          <ArrowLeftSVG />
        </button>
      )}

      {state.pageNumbers.map((pg, index) => (
        <button
          key={index}
          className={`btn ${styles.btn} ${styles.page_btn} ${
            state.currentPageNumber === pg ? "active" : ""
          }`}
          type="button"
          onClick={() => toPageNumber(pg)}
        >
          {pg}
        </button>
      ))}

      {state.currentPageNumber === 7 ? null : (
        <button
          className={`btn ${styles.btn} ${styles.page_btn}`}
          type="button"
          onClick={nextPage}
        >
          <ArrowRightSVG />
        </button>
      )}
    </div>
  );
}
