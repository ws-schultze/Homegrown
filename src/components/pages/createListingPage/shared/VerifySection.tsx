import {
  Verify,
  TypeBool,
  Str,
  AddressValidationApi_Response,
  VerifyActionName,
  Images,
} from "../../../../types/index";
import setAddressValidationApiResponseToState from "../utils/address/setAddressValidationApiResponseToState";
import { ReactComponent as AlertSVG } from "../../../../assets/svg/circle-exclamation-solid.svg";
import styles from "../styles.module.scss";
import setErrorMsg from "../utils/setErrorMsg";

interface Props<T> {
  /** The name that shows in the toast for a successful save (e.g. Agent, Owner, Company, House etc..) */
  // parentName: string;
  parent: T;
  addressValidationApiResponse?: AddressValidationApi_Response;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  handleFormVerification: (actionName: VerifyActionName, obj: T) => void;
}

export default function VerifySection<T extends Verify>({
  parent,
  addressValidationApiResponse,
  children,
  handleFormVerification,
}: Props<T>) {
  /**
   * Handles when the user clicks "yes" or "no" during form section validation
   */
  function handleValidate(value: boolean) {
    if (value === true) {
      // User clicked 'yes'

      // First make sure that the user didn't make some required fields empty
      let requiredFields: (keyof T)[] = [];
      let parentKeys: (keyof T)[] = [];
      let parentKey: keyof T;
      let newObj: T = parent;

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

            newObj = {
              ...newObj,
              [k]: _field,
            };
          }

          requiredFields.push(k);
        }
      });

      if (requiredFields.length === 0) {
        // Since all required fields are valid, set them all to valid,
        // saved and readonly

        let state: T = parent;
        let key: keyof T;
        let keys: (keyof T)[] = [];

        for (key in parent) {
          keys.push(key);
        }

        keys.forEach((k) => {
          // Loop through all fields of parent state and set valid=true, saved=true, and readOnly=true.

          const field = parent[k] as Str | TypeBool;
          console.log("field: ", field);

          if (
            field &&
            typeof field !== "string" &&
            typeof field !== "boolean"
          ) {
            state = {
              ...state,
              [k]: {
                ...state[k],
                errorMsg: "",
                valid: true,
                saved: true,
                readOnly: true,
              },
            };
          }
        });

        // In parent state, set valid=true and saved=true
        const s: T = {
          ...state,
          beingVerified: false,
          valid: true,
          saved: true,
          readOnly: true,
        };

        if (addressValidationApiResponse !== undefined) {
          // Set address validation api response data to state to correct spelling errors or formatting errors
          const finalState: T = setAddressValidationApiResponseToState({
            state: s,
            response: addressValidationApiResponse,
          });
          handleFormVerification("everythingLooksCorrect", finalState);
          // toast.success(`${parentName} information saved.`);
        } else {
          // No address validation needed
          handleFormVerification("everythingLooksCorrect", s);
          // toast.success(`${parentName} information saved.`);
        }
      }
    } else if (value === false) {
      // User clicked 'no'
      const s: T = {
        ...parent,
        beingVerified: false,
        valid: false,
        saved: false,
        readOnly: false,
      };
      handleFormVerification("everythingDoesNotLookCorrect", s);
    }
  }

  return (
    <div className={styles.verify_container}>
      <div className={styles.notice}>
        <AlertSVG />
        Does everything look correct?
      </div>

      {children ? (
        <div className={styles.info_to_verify}>
          <>{children}</>
        </div>
      ) : null}

      <div className={styles.two_btn_row}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => handleValidate(false)}
        >
          No
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={() => handleValidate(true)}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
