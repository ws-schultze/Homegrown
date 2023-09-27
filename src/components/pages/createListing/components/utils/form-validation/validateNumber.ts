/**
 * Check if a number is at least 1.
 * @param value number
 * @returns true/false
 */
export default function validateNumber(
  number: number,
  min?: number,
  max?: number
): { valid: boolean; errorMsg: string } {
  let valid: boolean = false,
    errorMsg: string = "";

  if (min && max) {
    // min and max are both defined

    if (number >= min && number <= max) {
      // valid

      valid = true;
      errorMsg = "";
    } else if (number < min) {
      // invalid --> under min

      valid = false;
      errorMsg = `Minimum ${min}`;
    } else if (number > max) {
      // invalid --> over max

      valid = false;
      errorMsg = `Maximum ${max}`;
    }
  } else if (min && !max) {
    // Only min is defined

    if (number >= min) {
      // valid

      valid = true;
      errorMsg = "";
    } else {
      // invalid --> under min

      valid = false;
      errorMsg = `Minimum ${min}`;
    }
  } else if (!min && max) {
    // Only max is defined

    if (number <= max) {
      // valid
      valid = true;
      errorMsg = "";
    } else {
      // invalid --> over max

      valid = false;
      errorMsg = `Maximum ${max}`;
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
