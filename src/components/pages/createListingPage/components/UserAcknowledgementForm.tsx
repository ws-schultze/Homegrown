import React from "react";
import PageBtns from "./PageBtns";
import {
  AddressValidationApi_Response,
  ListingData,
} from "../../../../types/index";
import { Header } from "./styledComponents";
import styles from "../create-listing-page.module.scss";

interface Props {
  parent: ListingData;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  emit: (
    obj: ListingData,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) => void;
  pageNumbers: number[];
  currentPage: number;
}

export default function UserAcknowledgementForm({
  parent,
  nextPage,
  toPageNumber,
  deleteListing,
  emit,
  pageNumbers,
  currentPage,
}: Props): JSX.Element {
  function handleClick() {
    const s: typeof parent = {
      ...parent,
      userAcknowledged: true,
      page: 2,
      savedPages: [1, 2],
    };
    emit(s);
  }

  return (
    <>
      <div className={styles.section}>
        <Header>Notice</Header>
        <p>All fields are required unless their label ends with *</p>
        <p>Any unsaved progress will be lost if you refresh the browser.</p>
        <p>Saved progress will be kept until the browser is closed.</p>
        <p>
          Saved progress may be accessed from your profile in the event that you
          navigate away from this form.
        </p>
        <button
          type="button"
          className={`listing-form__btn wide ${
            parent.userAcknowledged === true ? "active" : ""
          }`}
          onClick={handleClick}
        >
          I understand
        </button>
      </div>

      {parent.userAcknowledged === true ? (
        <PageBtns
          deleteListing={deleteListing}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      ) : null}
    </>
  );
}
