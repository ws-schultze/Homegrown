import { useDispatch } from "react-redux";
import { ReactComponent as ArrowLeftSVG } from "../../../../assets/svg/arrow-left-solid.svg";
import { ReactComponent as ArrowRightSVG } from "../../../../assets/svg/arrow-right-solid.svg";
import styles from "../styles.module.scss";
import { setCurrentPageNumber } from "../createListingPageSlice";
import { useAppSelector } from "../../../../redux/hooks";
import { useNavigate } from "react-router";

export default function Pagination(): JSX.Element {
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);
  const navigate = useNavigate();

  function nextPage() {
    dispatch(setCurrentPageNumber(pageState.currentPageNumber + 1));
    navigate(`/create-listing/${pageState.currentPageNumber}`);
  }

  function prevPage() {
    dispatch(setCurrentPageNumber(pageState.currentPageNumber - 1));
    navigate(`/create-listing/${pageState.currentPageNumber}`);
  }

  function toPageNumber(num: number) {
    dispatch(setCurrentPageNumber(num));
    navigate(`/create-listing/${pageState.currentPageNumber}`);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={`btn ${styles.btn} ${styles.page_btn}`}
        type="button"
        onClick={prevPage}
      >
        <ArrowLeftSVG />
      </button>

      {pageState.pageNumbers.map((pg, index) => (
        <button
          key={index}
          className={`btn ${styles.btn} ${styles.page_btn} ${
            pageState.currentPageNumber === pg ? "active" : ""
          }`}
          type="button"
          onClick={() => toPageNumber(pg)}
        >
          {pg}
        </button>
      ))}

      <button
        className={`btn ${styles.btn} ${styles.page_btn}`}
        type="button"
        onClick={nextPage}
      >
        <ArrowRightSVG />
      </button>
    </div>
  );
}
