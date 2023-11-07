import { ReactComponent as ArrowLeftSVG } from "../../../../assets/svg/arrow-left-solid.svg";
import { ReactComponent as ArrowRightSVG } from "../../../../assets/svg/arrow-right-solid.svg";
import styles from "../styles.module.scss";

interface Props {
  prevPage?: () => void;
  nextPage?: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  /**
   * Array of page numbers to show buttons for
   */
  pageNumbers?: number[];
  currentPage?: number;
}

export default function PageBtns({
  prevPage,
  nextPage,
  toPageNumber,
  pageNumbers,
  currentPage,
}: Props): JSX.Element {
  return (
    <div className={styles.pagination}>
      {prevPage ? (
        <button
          className={`btn ${styles.btn}`}
          type="button"
          onClick={prevPage}
        >
          <ArrowLeftSVG />
        </button>
      ) : null}
      {toPageNumber && pageNumbers
        ? pageNumbers.map((pgNum, index) => (
            <button
              key={index}
              className={`btn ${styles.btn} ${
                currentPage === pgNum ? "active" : ""
              }`}
              type="button"
              onClick={() => toPageNumber(pgNum)}
            >
              {pgNum}
            </button>
          ))
        : null}
      {nextPage ? (
        <button
          className={`btn ${styles.btn}`}
          type="button"
          onClick={nextPage}
        >
          <ArrowRightSVG />
        </button>
      ) : null}
    </div>
  );
}
