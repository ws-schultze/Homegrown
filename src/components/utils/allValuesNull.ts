/**
 * Check if all values (even within nested objects) are null
 * @param object
 * @returns
 */
export default function allValuesNull(object: object): boolean {
  return Object.values(object).every((v) => (v && typeof v === "object" ? allValuesNull(v) : v === 0 || v === null));
}
