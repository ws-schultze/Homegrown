import { ReactComponent as ArrowLeftSVG } from "../../../../assets/svg/arrow-left-solid.svg";
import { ReactComponent as ArrowRightSVG } from "../../../../assets/svg/arrow-right-solid.svg";
import styles from "../styles.module.scss";
import { useAppSelector } from "../../../../redux/hooks";
import { useNavigate } from "react-router";

export default function Pagination(): JSX.Element {
  const state = useAppSelector((s) => s.createListingPage);
  const navigate = useNavigate();

  function nextPage() {
    navigate(`/create-listing/${state.currentPageNumber + 1}`);
  }

  function prevPage() {
    navigate(`/create-listing/${state.currentPageNumber - 1}`);
  }

  function toPageNumber(num: number) {
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
