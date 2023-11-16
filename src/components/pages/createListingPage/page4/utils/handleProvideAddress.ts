import { initStrOpt, initStrReq } from "../../../../../initialValues";
import { Owner, PrivateOwner, TypeBool } from "../../../../../types";

export function handleProvideAddress(
  state: Owner | PrivateOwner,
  obj: TypeBool,
  dispatcher: (s: Owner | PrivateOwner) => void
) {
  const value = obj.value;

  const {
    streetAddress,
    unitNumber,
    city,
    adminAreaLevel1,
    country,
    zipCode,
    ...rest
  } = state;

  // Provide address --> add address props to state
  if (value === true) {
    const s: typeof state = {
      ...state,
      provideAddress: obj,
      streetAddress: initStrReq,
      unitNumber: initStrOpt,
      city: initStrReq,
      adminAreaLevel1: initStrReq,
      country: initStrReq,
      zipCode: initStrReq,
    };

    dispatcher(s);
    return;
  }

  // Do not provide address --> remove address props from state
  if (value === false) {
    const s = { ...rest, provideAddress: obj };
    dispatcher(s);
    return;
  }
}
