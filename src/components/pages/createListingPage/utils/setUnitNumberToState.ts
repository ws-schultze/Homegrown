import { Address, AddressOptional, Str } from "../../../../types/index";
/**
 * Set unit number to state and update formatted address to include unit number state.
 * @returns state object of type T
 */
export default function setUnitNumberToState<
  T extends Address | AddressOptional
>(state: T, unitNumberObj: Str): T {
  // Create formatted unit number
  const formattedAddress =
    unitNumberObj.value === ""
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
        unitNumberObj.value +
        ", " +
        state.city?.value +
        ", " +
        state.adminAreaLevel1?.value +
        " " +
        state.zipCode?.value +
        ", " +
        state.country?.value;

  // Create new state object with unit number and undated formatted address that includes unit number
  const newState: T = {
    ...state,
    unitNumber: unitNumberObj,
    formattedAddress: {
      ...state.formattedAddress,
      value: formattedAddress,
      formatted: formattedAddress,
    },
  };

  return newState;
}
