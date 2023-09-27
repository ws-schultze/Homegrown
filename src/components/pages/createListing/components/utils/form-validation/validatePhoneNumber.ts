/**
 * Given a string value containing only numeric characters, check if the length is 10.
 * @param value String with only numeric characters (e.g. "1234567890")
 * @returns true/false
 */
export default function validatePhoneNumber(value: string, length: number): { valid: boolean; errorMsg: string } {
  let valid: boolean = false,
    errorMsg: string = "";

  if (value.length === 10) {
    valid = true;
    errorMsg = "";
  } else if (value.length !== 10) {
    valid = false;
    errorMsg = "10 digits required";
  } else {
    throw new Error(`Something went wrong during phone number validation`);
  }
  return { valid, errorMsg };
}
