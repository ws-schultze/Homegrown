/**
 * Clean all non numeric values from a string
 * @param value Input
 * @returns A string of only numbers
 */
export default function removeNonNumericChars(value: string): string {
  return value.replaceAll(/[^\d]/g, "");
}
