import { Address, AddressOptional } from "../../../../../../types/index";

/**
 * Set state for a given address field
 * @param e React.ChangeEvent<HTMLInputElement>
 * @param key keyof typeof state (TypeAgent)
 */
export default function setAddressFieldToState<
  T extends Address | AddressOptional
>(state: T, value: string, key: keyof T, required: boolean): T {
  // Because unitNumber input must update the formattedAddress, unitNumber must be treated different
  // that the other address inputs

  if (key !== "unitNumber") {
    if (required === true) {
      // Invalid input length
      if (value === "") {
        const s: T = {
          ...state,
          [key]: {
            ...state[key],
            value: value,
            valid: false,
            errorMsg: "Invalid",
          },
        };

        return s;

        // Valid input length
      } else if (value.length >= 1) {
        const s: T = {
          ...state,
          [key]: {
            ...state[key],
            value: value,
            valid: true,
            errorMsg: "",
          },
        };

        return s;
      } else {
        throw new Error("Something escaped here.");
      }
    } else {
      // Don't set an error message on non-required fields
      const s: T = {
        ...state,
        [key]: {
          ...state[key],
          value: value,
          valid: false,
          errorMsg: "",
        },
      };

      return s;
    }

    // Unit number
  } else if (key === "unitNumber") {
    // Create formatted unit number
    const formattedUnitNumber =
      value === ""
        ? state.streetAddress?.value +
          ", " +
          state.city?.value +
          ", " +
          state.adminAreaLevel1?.value +
          state.zipCode?.value +
          ", " +
          state.country?.value
        : state.streetAddress?.value +
          " " +
          value +
          ", " +
          state.city?.value +
          ", " +
          state.adminAreaLevel1?.value +
          " " +
          state.zipCode?.value +
          ", " +
          state.country?.value;

    // Create new state object to return
    const s: T = {
      ...state,
      unitNumber: {
        ...state.unitNumber,
        value: value,
      },
      formattedAddress: {
        ...state.formattedAddress,
        value: formattedUnitNumber,
      },
    };

    return s;
  } else {
    throw new Error("Something went wrong.");
  }
}
