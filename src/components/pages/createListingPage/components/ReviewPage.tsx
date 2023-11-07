import React from "react";
import { ListingData } from "../../../../types/index";
import PageBtns from "./PageBtns";

import { ReactComponent as BellSVG } from "../../../../assets/svg/bell-regular.svg";
import { Notice } from "./styledComponents";

import styles from "../styles.module.scss";
import { useNavigate } from "react-router";

interface Props {
  parent: ListingData;
  editListing: boolean;
  prevPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
  submit: () => void;
}

export default function ReviewPage({
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
  const navigate = useNavigate();

  function goToPage(pageNumber: number) {
    const s: ListingData = {
      ...parent,
      page: pageNumber,
    };

    emit(s);
  }

  return (
    <>
      <section>
        <div className={styles.notice}>
          <BellSVG />
          Review any parts of this listing before submission, if you want to.
        </div>

        {/* Page 1 -- User Acknowledgment */}
        <div className={styles.review_row}>
          Notice
          <button className="btn" type="button" onClick={() => goToPage(1)}>
            Review
          </button>
        </div>

        {/* Page 2 -- Basic Info */}
        <div className={styles.review_row}>
          Basics
          <button className="btn" type="button" onClick={() => goToPage(2)}>
            Review
          </button>
        </div>

        {/* Page 3 -- Listing Address */}
        <div className={styles.review_row}>
          Address
          <button className={"btn"} type="button" onClick={() => goToPage(3)}>
            Review
          </button>
        </div>

        {/* Page 4 -- Lister */}
        <div className={styles.review_row}>
          {parent.basicInfo.forSaleBy?.value?.label ||
            parent.basicInfo.forRentBy?.value?.label}
          <button className="btn" type="button" onClick={() => goToPage(4)}>
            Review
          </button>
        </div>

        {/* Page 5 -- Listing Kind */}
        <div className={styles.review_row}>
          {parent.basicInfo.listingKind.value?.label}
          <button className="btn" type="button" onClick={() => goToPage(5)}>
            Review
          </button>
        </div>

        {/* Page 6 -- Images */}
        <div className={styles.review_row}>
          Images
          <button className="btn" type="button" onClick={() => goToPage(6)}>
            Review
          </button>
        </div>
      </section>

      <div className={styles.section}>
        {editListing === true ? (
          <div className={styles.two_btn_row}>
            <button type="button" className={styles.btn} onClick={submit}>
              Submit Update
            </button>
            <button className={styles.btn} onClick={() => navigate("/profile")}>
              Cancel Update
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={deleteListing}
            >
              Delete Listing
            </button>
          </div>
        ) : (
          <div className={styles.two_btn_row}>
            <button type="button" className={styles.btn} onClick={submit}>
              Submit Listing
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={deleteListing}
            >
              Delete Listing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
