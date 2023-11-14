import { Address, AddressOptional } from "../../../../../types/index";

interface Props<T> {
  /**
   * Address state from parent
   */
  state: T;
  /**
   * Is the address being verified by a user?
   */
  beingVerified: boolean;
}

/**
 * Given a state object, set beingVerified.value to "true" or "false" and return the state object.
 */
export default function setBeingVerifiedToState<
  T extends Address | AddressOptional
>({ state, beingVerified }: Props<T>): T {
  let s: T;

  // Address is being verified by user
  if (beingVerified === true) {
    s = {
      ...state,
      beingVerified: true,
      readOnly: true,
    };

    return s;

    // Address is not being verified by user
  } else if (beingVerified === false) {
    s = {
      ...state,
      valid: false,
      beingVerified: false,
      readOnly: false,
    };
    return s;

    // Something went wrong
  } else {
    throw new Error("b must be boolean");
  }
}
