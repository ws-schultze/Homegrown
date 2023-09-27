/**
 * A license ID must have only 8 digits
 * @param value string of the form "12345678" containing only numeric digits
 * @returns string of the form "12345678" with no more that 8 numeric digits
 */
export default function formatRealEstateLicenseId(value: string): string {
  let formattedLicenseId = "";
  const len = value.length;

  if (value === "") {
    formattedLicenseId = "";
  } else if (len >= 1 && len <= 8) {
    formattedLicenseId = value;
  } else if (len > 8) {
    throw new Error("License ID can only be 8 digits");
  }

  return formattedLicenseId;
}
