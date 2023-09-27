/**
 * Limit the number of numeric characters in the given string
 * @param value string representation of an integer
 * @param max number of characters in value
 * @returns formatted year string with up to max number of digits
 */
export default function formatYear(value: string, max: number) {
  let fmt = "";
  const len = value.length;

  console.log("len:", len);

  if (value === "") {
    fmt = "";
  } else if (len > 0 && len <= max) {
    fmt = value.slice(0, 4);
  } else if (len > max) {
    throw new Error("Year cannot have more than 4 digits");
  }

  return fmt;
}
