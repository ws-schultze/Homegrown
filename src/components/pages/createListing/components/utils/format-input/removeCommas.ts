/**
 * Remove commas from a string
 * @param value string
 * @returns string without commas
 */
export default function removeCommas(value: string) {
  return value.replace(/[,]/g, "");
}
