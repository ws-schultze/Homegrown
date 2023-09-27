import { TypeFormField } from "../../../../../../index";

/**
 * Check if a field is invalid and has no error msg
 * @param field a prop of a listing form state
 * @returns true/false
 */
export default function invalidRequiredFieldWithoutErrorMsg(
  field: TypeFormField
): boolean {
  if (
    field.required === true &&
    field.valid === false &&
    field.errorMsg === ""
  ) {
    return true;
  } else {
    return false;
  }
}
