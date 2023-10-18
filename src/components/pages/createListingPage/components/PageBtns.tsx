import { ReactComponent as ArrowLeftSVG } from "../../../../assets/svg/arrow-left-solid.svg";
import { ReactComponent as ArrowRightSVG } from "../../../../assets/svg/arrow-right-solid.svg";

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
  deleteListing,
  pageNumbers,
  currentPage,
}: Props): JSX.Element {
  return (
    <div className="listing-form__section">
      <div className="listing-form__page-number-btn-row">
        {prevPage ? (
          <button
            className="listing-form__page-number-btn"
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
                className={`listing-form__page-number-btn ${
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
            className="listing-form__page-number-btn"
            type="button"
            onClick={nextPage}
          >
            <ArrowRightSVG />
          </button>
        ) : null}
      </div>
      <div className="listing-form__delete-btn-wrap">
        <button
          type="button"
          className="listing-form__btn"
          onClick={deleteListing}
        >
          Delete Listing
        </button>
      </div>
    </div>
  );
}
