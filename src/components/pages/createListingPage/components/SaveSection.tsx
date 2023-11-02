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
import setErrorMsg from "./utils/setErrorMsg";
import setBeingVerifiedToState from "./utils/address/setBeingVerifiedToState";
import { toast } from "react-toastify";
import getAddressValidationApiResponse from "./utils/address/getAddressValidationApiResponse";

import Spinner from "../../../shared/loaders/Spinner";
import styles from "../create-listing-page.module.scss";

interface Props<T> {
  parentInitialState: T;
  parent: T;
  /** True if google address validation api is used */
  needsAddressValidation: boolean;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  emit: (
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
  emit,
}: Props<T>): JSX.Element {
  const [loading, setLoading] = useState(false);
  let addressValidationApiResponse: AddressValidationApi_Response | undefined;

  function handleClear() {
    emit("save", parentInitialState);
  }

  async function handleSave() {
    let requiredFields: (keyof T)[] = [];
    let parentKeys: (keyof T)[] = [];
    let parentKey: keyof T;
    let s: T = parent;

    for (parentKey in parent) {
      parentKeys.push(parentKey);
    }

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
          emit("save", s, addressValidationApiResponse);
        }
      } else {
        // No address validation needed

        s = setBeingVerifiedToState<T>({ state: s, beingVerified: true });
        emit("save", s);
      }
    } else if (requiredFields.length > 0) {
      // Empty required fields found
      emit("save", s);
      toast.warn(
        `Please finish filling out the required fields (${requiredFields})`
      );
    } else {
      throw new Error("Something went wrong..");
    }
  }

  return (
    <>
      <div className={styles.section}>
        <p>
          <>{children}</>
          Save to proceed
        </p>

        <div className={styles.two_btn_row}>
          <button type="button" className={styles.btn} onClick={handleClear}>
            Clear
          </button>

          {loading ? (
            <div className={styles.btn}>
              <Spinner size="large" />
            </div>
          ) : (
            <button type="button" className={styles.btn} onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
}
