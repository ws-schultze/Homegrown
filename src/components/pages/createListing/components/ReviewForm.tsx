import React from "react";
import { TypeListingData } from "../../../..";
import PageBtns from "./PageBtns";

import { ReactComponent as BellSVG } from "../../../../assets/svg/bell-regular.svg";
import { Notice } from "./styledComponents";

interface Props {
  parent: TypeListingData;
  editListing: boolean;
  prevPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: TypeListingData) => void;
  submit: () => void;
}

export default function ReviewForm({
  parent,
  editListing,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
  submit,
}: Props) {
  function goToPage(pageNumber: number) {
    const s: TypeListingData = {
      ...parent,
      page: pageNumber,
    };

    emit(s);
  }

  return (
    <>
      <div className="listing-form__section">
        <Notice>
          <BellSVG />
          Review any parts of this listing before submission, if you want to.
        </Notice>
        <div className="listing-form__flex-col">
          {/* Page 1 -- User Acknowledgment */}
          <div className="listing-form__review-row">
            Notice
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(1)}
            >
              Review
            </button>
          </div>

          {/* Page 2 -- Basic Info */}
          <div className="listing-form__review-row">
            Basics
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(2)}
            >
              Review
            </button>
          </div>

          {/* Page 3 -- Listing Address */}
          <div className="listing-form__review-row">
            Address
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(3)}
            >
              Review
            </button>
          </div>

          {/* Page 4 -- Lister */}
          <div className="listing-form__review-row">
            {parent.basicInfo.forSaleBy?.value?.label ||
              parent.basicInfo.forRentBy?.value?.label}
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(4)}
            >
              Review
            </button>
          </div>

          {/* Page 5 -- Listing Kind */}
          <div className="listing-form__review-row">
            {parent.basicInfo.listingKind.value?.label}
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(5)}
            >
              Review
            </button>
          </div>

          {/* Page 6 -- Images */}
          <div className="listing-form__review-row">
            Images
            <button
              className="listing-form__review-btn"
              type="button"
              onClick={() => goToPage(6)}
            >
              Review
            </button>
          </div>
        </div>
      </div>

      <div className="listing-form__section">
        {editListing === true ? (
          <button
            type="button"
            className="listing-form__btn wide"
            onClick={submit}
          >
            Submit Update
          </button>
        ) : (
          <button
            type="button"
            className="listing-form__btn wide"
            onClick={submit}
          >
            Submit Listing
          </button>
        )}
      </div>

      <PageBtns
        deleteListing={deleteListing}
        prevPage={prevPage}
        toPageNumber={toPageNumber}
        pageNumbers={pageNumbers}
        currentPage={currentPage}
      />
    </>
  );
}
