import React, { useEffect, useState } from "react";
import {
  AddressValidationApi_Response,
  Address,
  VerifyActionName,
  Images,
  AddressOptional,
  Str,
  TypeBool,
} from "../../../../types/index";
import setErrorMsg from "../utils/setErrorMsg";
import setBeingVerifiedToState from "../utils/address/setBeingVerifiedToState";
import { toast } from "react-toastify";
import getAddressValidationApiResponse from "../utils/address/getAddressValidationApiResponse";

import Spinner from "../../../shared/loaders/Spinner";
import styles from "../styles.module.scss";
import useDeleteNotYetSubmittedListing from "../hooks/useDeleteNotYetSubmittedListing";
import useDeleteListingFromFirestore from "../hooks/useDeleteListingFromFirestore";
import { useAppSelector } from "../../../../redux/hooks";
import { useParams } from "react-router";

interface Props<T> {
  parentInitialState: T;
  parent: T;
  /** True if google address validation api is used */
  needsAddressValidation: boolean;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  handleFormVerification: (
    actionName: VerifyActionName,
    obj: T,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) => void;
}

export default function SaveSection<T extends Address | AddressOptional>({
  parentInitialState,
  parent,
  needsAddressValidation,
  children,
  handleFormVerification,
}: Props<T>): JSX.Element {
  const [loading, setLoading] = useState(false);
  let addressValidationApiResponse: AddressValidationApi_Response | undefined;

  const pageState = useAppSelector((s) => s.createListingPage);
  const params = useParams();

  const { deleteNotYetSubmittedListing } = useDeleteNotYetSubmittedListing();
  const { deleteListingFromFirestore } = useDeleteListingFromFirestore(
    pageState.listing.uploads.images,
    params
  );

  function handleClear() {
    handleFormVerification("saveAndContinue", parentInitialState);
  }

  async function handleSave() {
    let requiredFields: (keyof T)[] = [];
    let parentKeys: (keyof T)[] = [];
    let parentKey: keyof T;
    let s: T = parent;

    for (parentKey in parent) {
      parentKeys.push(parentKey);
    }

    /**
     * Show error messages on invalid required fields
     */
    parentKeys.forEach((k) => {
      const field = parent[k] as Str | TypeBool | Images;

      if (field && field.required === true && field.valid === false) {
        // Only provide an error message if it doesn't already exist

        if (field.errorMsg === "") {
          // Set error message

          const _field = setErrorMsg<T>(parent, k, "Required");

          s = {
            ...s,
            [k]: _field,
          };
        }

        requiredFields.push(k);
      }
    });

    if (requiredFields.length === 0) {
      // No empty required fields found --> trigger verification prompt

      if (needsAddressValidation === true) {
        // Get address validation api response
        setLoading(true);
        if (
          parent.streetAddress &&
          parent.unitNumber &&
          parent.city &&
          parent.adminAreaLevel1 &&
          parent.zipCode
        ) {
          addressValidationApiResponse = await getAddressValidationApiResponse({
            streetAddress: parent.streetAddress.value,
            unitNumber: parent.unitNumber.value,
            city: parent.city.value,
            state: parent.adminAreaLevel1.value,
            zipCode: parent.zipCode.value,
          });
        } else {
          throw new Error(
            "There is one or more empty address field required to make the api request"
          );
        }
        setLoading(false);

        if (addressValidationApiResponse) {
          s = setBeingVerifiedToState<T>({ state: s, beingVerified: true });

          const t: T = {
            ...s,
            beingVerified: true,
            readOnly: true,
          };

          handleFormVerification(
            "saveAndContinue",
            t,
            addressValidationApiResponse
          );
        }
      } else {
        // No address validation needed

        s = setBeingVerifiedToState<T>({ state: s, beingVerified: true });
        handleFormVerification("saveAndContinue", s);
      }
    } else if (requiredFields.length > 0) {
      // Empty required fields found
      handleFormVerification("saveAndContinue", s);
      toast.warn(
        `Please finish filling out the required fields (${requiredFields})`
      );
    } else {
      throw new Error("Something went wrong..");
    }
  }

  return (
    <>
      <section>
        {children ? (
          <header>
            <>{children}</>
          </header>
        ) : null}

        <div className={styles.save_section_btns}>
          {loading ? (
            <div className={styles.btn}>
              <Spinner size="small" />
            </div>
          ) : (
            <button
              type="button"
              className={styles.save_btn}
              onClick={handleSave}
            >
              Save and continue
            </button>
          )}
          <div className={styles.bottom_btns}>
            <button type="button" className={styles.btn} onClick={handleClear}>
              Clear form
            </button>

            <button
              type="button"
              className={styles.btn}
              onClick={
                pageState.editingListing === true
                  ? deleteListingFromFirestore
                  : deleteNotYetSubmittedListing
              }
            >
              Delete Listing
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
