/**
 * Given a string of "true" or "false", return a boolean of true or false respectively
 * @param value string "true" or "false"
 * @returns boolean
 */
export default function strToBool(value: string): boolean {
  let bool: boolean = false;
  if (value === "true") {
    bool = true;
  } else if (value === "false") {
    bool = false;
  } else {
    throw new Error("Value must be a string of 'true' or 'false' ");
  }
  return bool;
}
