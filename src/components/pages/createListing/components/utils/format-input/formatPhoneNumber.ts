/**
 * Format a string value containing only numeric characters into a phone number (e.g "1234567890" --> "123-456-7890")
 * @param value string of the form "1234567890"
 * @returns string of the form "123-456-7890"
 */
export default function formatPhoneNumber(value: string): string {
  let formattedPhoneNumber = "";
  const len = value.length;

  if (value === "") {
    formattedPhoneNumber = "";
  } else if (len < 3 && len > 0) {
    formattedPhoneNumber = value;
  } else if (len >= 3 && len < 6) {
    formattedPhoneNumber = `(${value.slice(0, 3)})${value.slice(3)}`;
  } else if (len >= 6 && len <= 10) {
    formattedPhoneNumber = `(${value.slice(0, 3)})${value.slice(3, 6)}-${value.slice(6, 10)}`;
  } else if (len > 10) {
    throw new Error("Phone number must be 10 digits");
  }

  return formattedPhoneNumber;
}
