import { toast } from "react-toastify";
import fetchAddressValidation from "./fetchAddressValidation";
import { AddressValidationApi_Response } from "../../../../../types/index";

interface Props {
  streetAddress: string;
  unitNumber: string;
  city: string;
  state: string;
  zipCode: string;
}

export default async function getAddressValidationApiResponse({
  streetAddress,
  unitNumber,
  city,
  state,
  zipCode,
}: Props) {
  const response: AddressValidationApi_Response = await fetchAddressValidation({
    streetAddress: streetAddress,
    unitNumber: unitNumber,
    city: city,
    state: state,
    zipCode: zipCode,
  });

  if (response) {
    // request failed
    if (response.error) {
      if (response.error.message) {
        throw new Error(response.error.message);
      } else {
        throw new Error("Something went wrong");
      }
      // request success
    } else if (response.result) {
      if (response.result.address) {
        return response;
      } else {
        throw new Error("Something went wrong");
      }
    }
  } else {
    throw new Error("No response received");
  }
}
