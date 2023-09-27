import { TypeBool, TypeStr } from "../../../../../index";

/**
 * Set the className for an input given the key that corresponds to that input's value.
 * If the input's value={state.firstName.value} then the key is "firstName".
 * @param key keyof T
 * @returns "listing-form__input invalid" or "listing-form__input"
 */
export default function setListingFormInputClassName(
  field: TypeStr | TypeBool
): string {
  if (field && field.errorMsg.length > 0) {
    return "listing-form__input invalid";
  } else {
    return "listing-form__input";
  }
}
