import { TypeStr, TypeBool, TypeVerify } from "../../../../../index";
/**
 * Set a field's error message and valid=false.
 */
export default function setErrorMsg<T>(
  state: T,
  key: keyof T,
  message: string
): T[keyof T] {
  const field: T[keyof T] = {
    ...state[key],
    valid: false,
    errorMsg: message,
  };

  return field;
}
