/**
 * Format a string value containing only numeric characters into currency format (e.g "123456" --> "$123,456")
 * @param value string of the form "123456"
 * @returns string of the form "$123,456"
 */
export default function formatUSDCommaSeparatedNoDecimal(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}
