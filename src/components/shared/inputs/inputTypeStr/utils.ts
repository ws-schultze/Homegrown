import React from "react";
import { TypeFormField } from "../../../..";
import isEmail from "validator/lib/isEmail";

/**
 * Format a string containing only numeric characters into comma separated form format (e.g "123456" --> "123,456")
 * @param value string of the form "123456"
 * @returns string of the form "123,456"
 */
export function formatCommaSeparatedNoDecimal(value: string): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/**
 *
 * @param value string containing only numeric digits [0-9]
 * @returns a formatted string with commas for thousands separators and one decimal and two decimal places
 */
export function formatCommaSeparatedWithDecimal(value: string): string {
  const len = value.length;
  let left = "",
    right = "",
    formatted = "";

  if (len === 0) {
    return "";
  } else if (len === 1) {
    // 0.01
    return `0.0${value}`;
  } else if (len === 2) {
    // 0.12
    return `0.${value}`;
  } else if (len === 3) {
    // 1.23
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else if (len === 4) {
    // 12.34
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    console.log("left: ", left, " ", "right: ", right);
    return formatted;
  } else if (len === 5) {
    // 123.45
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else if (len >= 6) {
    // 1,234.56 and larger
    left = value.slice(0, -2);

    // Insert commas to the group left of the decimal
    left = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Number(left));

    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else {
    return "Error";
  }

  // This regex works great but breaks on Safari because of the usage of forward lookahead ?<=\
  //   return (
  //     // "$" +
  //     value
  //       .replace(/ (?!\.)\D /g, "") // deletes all non numeric characters except .
  //       .replace(/ (?:\..*)\. /g, "") // removes all extra . except the first .
  //       .replace(/(?<=\..*)\./g, "") // deletes everything after 2 decimal places
  //       .replace(/(?<=\.\d\d).*/g, "") // deletes everything after 2 decimal places
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // inserts commas at appropriate places
  //   );
}

/**
 * Create a compact formatted value (e.g. 123,456,789 --> 123.4M )
 * @param value string with only numeric characters (e.g. "123546")
 * @returns string (e.g. 123.4M)
 */
export function formatCompactCommaSeparatedNoDecimal(value: string): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
    maximumSignificantDigits: 4,
  }).format(Number(value));
}

/**
 * Given a number return a formatted string:
 * 1) Given 12345 return 12.34K
 * 2) Given 123456 return 123.45K
 * Probably don't even need this function, just call new Intl.NumberFormat()
 * @param number
 * @returns string
 */
export function formatCompactCommaSeparatedWithDecimal(number: number) {
  console.log("value: ", number);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
    maximumSignificantDigits: 4,
  }).format(number);
}

/**
 * Create a compact formatted value (e.g. $123,456,789 --> $123.4M )
 * @param value string with only numeric characters (e.g. "123546")
 * @returns string (e.g. $123.4M)
 */
export function formatCompactCurrencyNoDecimal(value: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
    maximumSignificantDigits: 4,
  }).format(Number(value));
}

/**
 * Capitalize the first letter of each word in a given string
 * @param value string
 * @returns string with the first letter of each word capitalized
 */
export function formatName(value: string): string {
  const name = value
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return name;
}

/**
 * Format a string value containing only numeric characters into a phone number (e.g "1234567890" --> "123-456-7890")
 * @param value string of the form "1234567890"
 * @returns string of the form "123-456-7890"
 */
export function formatPhoneNumber(value: string): string {
  let formattedPhoneNumber = "";
  const len = value.length;

  if (value === "") {
    formattedPhoneNumber = "";
  } else if (len < 3 && len > 0) {
    formattedPhoneNumber = value;
  } else if (len >= 3 && len < 6) {
    formattedPhoneNumber = `(${value.slice(0, 3)})${value.slice(3)}`;
  } else if (len >= 6 && len <= 10) {
    formattedPhoneNumber = `(${value.slice(0, 3)})${value.slice(
      3,
      6
    )}-${value.slice(6, 10)}`;
  } else if (len > 10) {
    throw new Error("Phone number must be 10 digits");
  }

  return formattedPhoneNumber;
}

/**
 * A license ID must have only 8 digits
 * @param value string of the form "12345678" containing only numeric digits
 * @returns string of the form "12345678" with no more that 8 numeric digits
 */
export function formatRealEstateLicenseId(value: string): string {
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

/**
 * Format a string value containing only numeric characters into currency format (e.g "123456" --> "$123,456")
 * @param value string of the form "123456"
 * @returns string of the form "$123,456"
 */
export function formatUSDCommaSeparatedNoDecimal(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Limit the number of numeric characters in the given string
 * @param value string representation of an integer
 * @param max number of characters in value
 * @returns formatted year string with up to max number of digits
 */
export function formatYear(value: string, max: number) {
  let fmt = "";
  const len = value.length;

  console.log("len:", len);

  if (value === "") {
    fmt = "";
  } else if (len > 0 && len <= max) {
    fmt = value.slice(0, 4);
  } else if (len > max) {
    throw new Error("Year cannot have more than 4 digits");
  }

  return fmt;
}

/**
 * Remove commas from a string
 * @param value string
 * @returns string without commas
 * TODO: Don't need this function since it just a silly wrapper for .replace()
 */
export function removeCommas(value: string) {
  return value.replace(/[,]/g, "");
}

/**
 * Clean all non numeric values from a string
 * @param value Input
 * @returns A string of only numbers
 */
export function removeNonNumericChars(value: string): string {
  return value.replaceAll(/[^\d]/g, "");
}

/**
 * This was inspired by: https://github.com/cchanxzy/react-currency-input-field/blob/master/src/components/utils/repositionCursor.ts
 * Based on the last key stroke and the cursor position, update the eventTargetValue and reposition the cursor to the right place
 */
export function repositionCursor({
  eventTargetValue,
  formattedValueFromState,
  selectionStart,
  lastKeyDown,
  groupSeparators,
}: {
  eventTargetValue: string;
  formattedValueFromState?: string;
  lastKeyDown: string | null;
  selectionStart?: number | null;
  groupSeparators?: string[];
}): {
  modifiedValue: string;
  modifiedCursorPosition: number | null | undefined;
} {
  let modifiedCursorPosition = selectionStart;
  let modifiedValue = eventTargetValue;

  if (formattedValueFromState && modifiedCursorPosition) {
    const splitValue = eventTargetValue.split("");

    if (groupSeparators) {
      if (groupSeparators.length > 2 || groupSeparators.length === 0) {
        throw new Error(
          "Only two group separators can be used currently, and group separators cannot be an empty list."
        );
        // One group separator is defined
      } else if (groupSeparators.length === 1) {
        // Cursor is to right of groupSeparator and backspace is pressed.
        // --> Delete the character to the left of the separator and reposition the cursor.
        if (
          lastKeyDown === "Backspace" &&
          formattedValueFromState[modifiedCursorPosition] === groupSeparators[0]
        ) {
          splitValue.splice(modifiedCursorPosition - 1, 1);
          modifiedCursorPosition -= 1;
        }

        // Cursor is to left of groupSeparator and forward delete is pressed,
        // --> Delete the character to the right of the separator and reposition the cursor.
        if (
          lastKeyDown === "Delete" &&
          formattedValueFromState[modifiedCursorPosition] === groupSeparators[0]
        ) {
          splitValue.splice(modifiedCursorPosition, 1);
          modifiedCursorPosition += 1;
        }
        // Two groups separators are defined
      } else if (groupSeparators.length === 2) {
        // Cursor is to right of groupSeparator and backspace is pressed.
        // --> Delete the character to the left of the separator and reposition the cursor.
        if (
          lastKeyDown === "Backspace" &&
          (formattedValueFromState[modifiedCursorPosition] ===
            groupSeparators[0] ||
            formattedValueFromState[modifiedCursorPosition] ===
              groupSeparators[1])
        ) {
          splitValue.splice(modifiedCursorPosition - 1, 1);
          modifiedCursorPosition -= 1;
        }

        // Cursor is to left of groupSeparator and forward delete is pressed,
        // --> Delete the character to the right of the separator and reposition the cursor.
        if (
          lastKeyDown === "Delete" &&
          (formattedValueFromState[modifiedCursorPosition] ===
            groupSeparators[0] ||
            formattedValueFromState[modifiedCursorPosition] ===
              groupSeparators[1])
        ) {
          splitValue.splice(modifiedCursorPosition, 1);
          modifiedCursorPosition += 1;
        }
      }
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, modifiedCursorPosition };
  }

  return { modifiedValue, modifiedCursorPosition: selectionStart };
}

/**
 * Return the last key pressed and prevent default on "Enter"
 * @param e React.KeyboardEvent
 */
export function getKeyDown(e: React.KeyboardEvent): string {
  if (e.key === "Enter") {
    e.preventDefault();
  }
  return e.key;
}

/**
 * Check if a field is invalid and has no error msg
 * @param field a prop of a listing form state
 * @returns true/false
 */
export function invalidRequiredFieldWithoutErrorMsg(
  field: TypeFormField
): boolean {
  if (
    field.required === true &&
    field.valid === false &&
    field.errorMsg === ""
  ) {
    return true;
  } else {
    return false;
  }
}

export function validateDescription(
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

export function validateName(
  value: string,
  required: boolean
): { valid: boolean; errorMsg: string } {
  let valid: boolean = false;
  let errorMsg: string = "";
  console.log(value);

  if (required === true) {
    if (value === "") {
      // Invalid
      console.log("invalid");

      valid = false;
      errorMsg = "Required";
    } else if (value.length >= 1) {
      // Valid

      valid = true;
      errorMsg = "";
    } else {
      throw new Error("Something went wrong");
    }
  } else {
    valid = true;
    errorMsg = "";
  }

  return { valid, errorMsg };
}

export function validateEmail(value: string): {
  valid: boolean;
  errorMsg: string;
} {
  if (isEmail(value)) {
    return { valid: true, errorMsg: "" };
  } else {
    return { valid: false, errorMsg: "Enter a valid email" };
  }
}

export function validatePassword(value: string): {
  valid: boolean;
  errorMsg: string;
} {
  const minLength = 6;
  if (value.length < minLength) {
    return {
      valid: false,
      errorMsg: `Password must contain at least ${minLength} characters`,
    };
  } else {
    return { valid: true, errorMsg: "" };
  }
}

/**
 * Check if a number is at least 1.
 * @param value number
 * @returns true/false
 */
export function validateNumber(
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

/**
 * Given a string value containing only numeric characters, check if the length is 10.
 * @param value String with only numeric characters (e.g. "1234567890")
 * @returns true/false
 */
export function validatePhoneNumber(
  value: string,
  length: number
): { valid: boolean; errorMsg: string } {
  let valid: boolean = false,
    errorMsg: string = "";

  if (value.length === 10) {
    valid = true;
    errorMsg = "";
  } else if (value.length !== 10) {
    valid = false;
    errorMsg = "10 digits required";
  } else {
    throw new Error(`Something went wrong during phone number validation`);
  }
  return { valid, errorMsg };
}

/**
 * Check if string of numbers has 8 digits
 * @param value string of only numeric characters
 * @returns  (valid: boolean; errorMsg: string)
 */
export function validateRealEstateLicenseIdNumber(value: string): {
  valid: boolean;
  errorMsg: string;
} {
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
