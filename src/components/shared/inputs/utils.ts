import React from "react";
import * as T from "../../../types/index";
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
  field: T.FormField
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

  if (required === true) {
    if (value === "") {
      // Invalid

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
export function validatePhoneNumber(value: string): {
  valid: boolean;
  errorMsg: string;
} {
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

/**
 * Set last key down to state.
 * Without this, the cursor will get stuck behind a group separator
 * because repositionCursor() won't work right.
 */
export function handleKeyDown(
  event: React.KeyboardEvent<Element>,
  setLastKeyDown: (lastKeydown: string) => void
) {
  const lastKeyDown: string = getKeyDown(event);
  setLastKeyDown(lastKeyDown);
}

export function formatPriceOnChange({
  e,
  priceState,
  isDiscountPrice,
  lastKeyDown,
  groupSeparators,
  minPrice,
  currency,
  prefix,
  setCursorPosition,
  handleInput,
}: {
  e: React.ChangeEvent<HTMLInputElement>;
  priceState: T.Str;
  isDiscountPrice: boolean;
  lastKeyDown: string;
  groupSeparators: string[];
  minPrice: number;
  currency: string;
  prefix: string;
  setCursorPosition: (num: number) => void;
  handleInput: (obj: T.Str) => void;
}): void {
  const {
    target: { value, selectionStart },
  } = e;

  // Prevent cursor jumping on "Backspace" and "Delete"
  const { modifiedValue, modifiedCursorPosition } = repositionCursor({
    eventTargetValue: value,
    formattedValueFromState: priceState.formatted,
    lastKeyDown: lastKeyDown,
    selectionStart: selectionStart,
    groupSeparators: groupSeparators,
  });

  // Get rid of non numeric characters
  const numStr = removeNonNumericChars(modifiedValue);

  // Get rid of leading zero because this price does not have decimal values
  const numNoLeadingZeros = Number(numStr);

  // Make a string out of the number without leading zeros
  const numStrNoLeadingZeros = numNoLeadingZeros.toString();

  // Format the number into USD comma separated with no decimal
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(Number(numNoLeadingZeros));

  // If the formatted value is zero dollars, clear the input field
  const _formatted = fmt === `${prefix}0` ? "" : fmt;
  // Create a short formatted version of the
  // number's string representation and avoid
  // formatting an empty string

  const _shortFormatted =
    // numStrNoLeadingZeros === "" ? "" : formatCompactCurrencyNoDecimal(numStr);
    numStrNoLeadingZeros === ""
      ? ""
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 0,
          maximumSignificantDigits: 4,
        }).format(Number(numNoLeadingZeros));

  let _valid = priceState.valid;
  let _errorMsg = priceState.errorMsg;

  // Validate the price and get a errorMsg, if it's not a discount price
  if (isDiscountPrice === false) {
    const { valid, errorMsg } = validateNumber(
      numNoLeadingZeros,
      minPrice,
      undefined
    );
    _valid = valid;
    _errorMsg = errorMsg;
  }

  // Hide the prefix when no amount is present
  let _value = value;
  if (value === prefix) {
    _value = "";
  }

  // Store the cursor position to state, while taking
  // into account a groupSeparator and or prefix.
  if (modifiedCursorPosition !== undefined && modifiedCursorPosition !== null) {
    let newCursor = modifiedCursorPosition + (_formatted.length - value.length);

    newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;

    setCursorPosition(newCursor);
  }

  const s: T.Str = {
    ...priceState,
    value: _value,
    formatted: _formatted,
    number: numNoLeadingZeros,
    shortFormatted: _shortFormatted,
    numberStr: numStrNoLeadingZeros,
    valid: _valid,
    errorMsg: _errorMsg,
    required: priceState.required,
    beingVerified: false,
    saved: false,
    readOnly: false,
  };

  handleInput(s);
}

/**
 *
 * @param streetAddressRef reference to the streetAddress input
 * @returns autocompleteWidget of type google.maps.places.Autocomplete
 */
export default function makeAutocompleteWidget(
  streetAddressRef: React.MutableRefObject<HTMLInputElement | null>
): google.maps.places.Autocomplete {
  if (streetAddressRef.current && streetAddressRef.current !== null) {
    const autocompleteWidget: google.maps.places.Autocomplete =
      new window.google.maps.places.Autocomplete(streetAddressRef.current, {
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["address"],
      });
    return autocompleteWidget;
  } else {
    throw new Error("Something went wrong");
  }
}

/**
 * Handle when a user clicks on a Google Places API item from the autocomplete dropdown menu
 * that appears below street address input field.
 */
export function setAutocompletePlaceValuesToState<
  T extends T.Address | T.AddressOptional
>({
  state,
  autocomplete,
}: {
  state: T;
  autocomplete: google.maps.places.Autocomplete | null;
}) {
  if (autocomplete) {
    const place = autocomplete.getPlace();
    let _streetAddress = "",
      _zipCode = "",
      _city = "",
      _adminAreaLevel1 = "",
      _adminAreaLevel2 = "",
      _country = "",
      _formattedAddress = "",
      _geolocation = { lat: 0, lng: 0 };

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr

    /* Note --> google.maps.places.PlaceResult.address_components?: google.maps.GeocoderAddressComponent[] | undefined.
     * And types in google.maps.GeocoderAddressComponent is defined as string[] which leads to an issue:
     * string[] does't let us use a switch statement to test different possible values of a type within string[].
     * To fix this issue I created TypeGeocoderApi_Response_AddressComponent[] and it's "types" are defined as TypeGeocoderApi_Response_Types,
     * and that fixes the issue with testing cases within the switch statement. This is the reason for telling ts to
     * ignore the first for loop condition below.
     */
    //@ts-ignore
    for (const component of place.address_components as TypeGeocoderApi_Response_AddressComponent[]) {
      for (const type of component.types as T.TypeGeocoderApi_Response_AddressTypes) {
        switch (type) {
          case "street_number": {
            _streetAddress = `${component.long_name}`;
            break;
          }

          case "route": {
            _streetAddress += ` ${component.short_name}`;
            break;
          }

          case "postal_code": {
            _zipCode = `${component.long_name}`;
            break;
          }

          case "postal_code_suffix": {
            _zipCode = `${_zipCode}-${component.long_name}`;
            break;
          }

          case "locality":
            _city = component.long_name;
            break;

          case "administrative_area_level_1": {
            _adminAreaLevel1 = component.short_name;
            break;
          }

          case "administrative_area_level_2": {
            _adminAreaLevel2 = component.long_name;
            break;
          }

          case "country":
            _country = component.short_name;
            break;
        }
      }
    }

    if (place.formatted_address) {
      _formattedAddress = place.formatted_address;
    } else {
      throw new Error("No formatted address found");
    }

    if (place.geometry?.location) {
      _geolocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    } else {
      throw new Error("Could not find lat/lng for this location...");
    }

    // Define new state object
    const s: T = {
      ...state,

      streetAddress: {
        ...state.streetAddress,
        value: _streetAddress,
        formatted: _streetAddress,
        valid: true,
        errorMsg: "",
      },
      city: {
        ...state.city,
        value: _city,
        formatted: _city,
        valid: true,
        errorMsg: "",
      },
      adminAreaLevel1: {
        ...state.adminAreaLevel1,
        value: _adminAreaLevel1,
        formatted: _adminAreaLevel1,
        valid: true,
        errorMsg: "",
      },
      adminAreaLevel2: {
        ...state.adminAreaLevel2,
        value: _adminAreaLevel2,
        formatted: _adminAreaLevel2,
        valid: true,
        errorMsg: "",
      },
      zipCode: {
        ...state.zipCode,
        value: _zipCode,
        formatted: _zipCode,
        valid: true,
        errorMsg: "",
      },
      country: {
        ...state.country,
        value: _country,
        formatted: _country,
        valid: true,
        errorMsg: "",
      },
      formattedAddress: {
        ...state.formattedAddress,
        value: _formattedAddress,
        formatted: _formattedAddress,
        valid: true,
      },
      geolocation: {
        ...state.geolocation,
        value: _geolocation,
        // formatted: _geolocation,
        valid: true,
      },
      addressComponents: place.address_components,
      beingVerified: false,
    };

    return s;

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    // if (unitNumberRef.current) {
    //   unitNumberRef.current.focus();
    // }
  } else {
    throw new Error("autocomplete not found...");
  }
}
