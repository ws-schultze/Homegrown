import {
  TypeVerify,
  TypeBool,
  TypeStr,
  TypeAddressValidationApi_Response,
  TypeVerifyActionName,
} from "../../../../index";
import setAddressValidationApiResponseToState from "./utils/address/setAddressValidationApiResponseToState";
import { ReactComponent as AlertSVG } from "../../../../assets/svg/circle-exclamation-solid.svg";
import { Notice } from "./styledComponents";

interface Props<T> {
  /** The name that shows in the toast for a successful save (e.g. Agent, Owner, Company, House etc..) */
  parentName: string;
  parent: T;
  addressValidationApiResponse?: TypeAddressValidationApi_Response;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  emit: (actionName: TypeVerifyActionName, obj: T) => void;
}

export default function VerifySection<T extends TypeVerify>({
  parentName,
  parent,
  addressValidationApiResponse,
  children,
  emit,
}: Props<T>) {
  /**
   * Handles when the user clicks "yes" or "no" during form section validation
   */
  function handleValidate(value: boolean) {
    if (value === true) {
      // User clicked 'yes'

      let state: T = parent;
      let key: keyof T;
      let keys: (keyof T)[] = [];

      for (key in parent) {
        keys.push(key);
      }

      keys.forEach((k) => {
        // Loop through all fields of parent state and set valid=true, saved=true, and readOnly=true.

        const field = parent[k] as TypeStr | TypeBool;
        console.log("field: ", field);

        if (field && typeof field !== "string" && typeof field !== "boolean") {
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
        emit("verify", finalState);
        // toast.success(`${parentName} information saved.`);
      } else {
        // No address validation needed
        emit("verify", s);
        // toast.success(`${parentName} information saved.`);
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
      emit("verify", s);
    }
  }

  return (
    <>
      <div className="listing-form__section">
        <Notice>
          <AlertSVG />
          Does everything look correct?
        </Notice>

        {children ? (
          <div className="listing-form__info-to-verify">
            <>{children}</>
          </div>
        ) : null}

        <div className="listing-form__btns-row">
          <button
            type="button"
            className="listing-form__btn"
            onClick={() => handleValidate(false)}
            disabled={parent.readOnly}
          >
            No
          </button>

          <button
            type="button"
            className="listing-form__btn"
            onClick={() => handleValidate(true)}
            disabled={parent.readOnly}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
}
