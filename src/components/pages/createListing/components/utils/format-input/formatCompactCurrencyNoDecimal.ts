/**
 * Create a compact formatted value (e.g. $123,456,789 --> $123.4M )
 * @param value string with only numeric characters (e.g. "123546")
 * @returns string (e.g. $123.4M)
 */
export default function formatCompactCurrencyNoDecimal(value: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
    maximumSignificantDigits: 4,
  }).format(Number(value));
}
