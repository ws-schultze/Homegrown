export default function formatCompactCommaSeparatedWithDecimal(number: number) {
  console.log("value: ", number);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
    maximumSignificantDigits: 4,
  }).format(number);
}
