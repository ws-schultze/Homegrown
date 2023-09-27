import React from "react";

interface Props {
  value: string;
  /** Minimum number of characters that value can have */
  min: number;
  /** Minimum number of characters that value can have */
  max: number;
}

export default function validateDescription(
  value: string,
  min: number,
  max: number
): { valid: boolean; errorMsg: string } {
  const len = value.length;
  let valid = false;
  let errorMsg = "";

  if (min && max) {
    // min and max are both defined

    if (len >= min && len <= max) {
      // valid

      valid = true;
      errorMsg = "";
    } else if (len < min) {
      // invalid --> under min

      valid = false;
      errorMsg = `Too short`;
    } else if (len > max) {
      // invalid --> over max

      valid = false;
      errorMsg = `Too long`;
    }
  } else if (min && !max) {
    // Only min is defined

    if (len >= min) {
      // valid

      valid = true;
      errorMsg = "";
    } else {
      // invalid --> under min

      valid = false;
      errorMsg = `Too short`;
    }
  } else if (!min && max) {
    // Only max is defined

    if (len <= max) {
      // valid
      valid = true;
      errorMsg = "";
    } else {
      // invalid --> over max

      valid = false;
      errorMsg = `Too long`;
    }
  } else if (!min && !max) {
    // Both min and max are undefined

    valid = true;
    errorMsg = "";
  } else {
    throw new Error("Uh Oh Chief...something went wrong...");
  }
  return { valid, errorMsg };
}
