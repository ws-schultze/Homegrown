import React from "react";

/**
 * Check if string of numbers has 8 digits
 * @param value string of only numeric characters
 * @returns  (valid: boolean; errorMsg: string)
 */
export default function validateRealEstateLicenseIdNumber(value: string): { valid: boolean; errorMsg: string } {
  let valid: boolean = false,
    errorMsg: string = "";

  if (value.length === 8) {
    valid = true;
    errorMsg = "";
  } else if (value.length !== 8) {
    valid = false;
    errorMsg = "8 digits required";
  } else {
    throw new Error(`Something went wrong.`);
  }
  return { valid, errorMsg };
}
