import { Wrapper } from "@googlemaps/react-wrapper";
import React from "react";
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import AddressAutocompleteInput from "../../../shared/inputs/addressAutocompleteInput/AddressAutocompleteInput";
import { Address, AddressOptional, Str } from "../../../../types";
import NameInput from "../../../shared/inputs/nameInput/NameInput";

export default function AddressFields<
  T extends Address | AddressOptional
>(props: {
  streetAddress: Str;
  unitNumber: Str;
  city: Str;
  adminAreaLevel1: Str;
  zipCode: Str;
  country: Str;
  handleInput: (obj: Str, key: keyof T) => void;
  handleAutocompletedAddress: (obj: Address | AddressOptional) => void;
}) {
  return (
    <Wrapper
      apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
      render={renderMap}
      version="beta"
      libraries={["places", "marker"]}
    >
      <AddressAutocompleteInput
        state={props.streetAddress}
        placeholder="Street number"
        handleInput={(obj) => props.handleInput(obj, "streetAddress")}
        handleAutocompletedAddress={props.handleAutocompletedAddress}
      />

      <NameInput
        state={props.unitNumber}
        placeholder="Unit number"
        handleInput={(obj) => props.handleInput(obj, "unitNumber")}
      />

      <NameInput
        state={props.city}
        placeholder="City"
        handleInput={(obj) => props.handleInput(obj, "city")}
      />

      <NameInput
        state={props.adminAreaLevel1}
        placeholder="State"
        handleInput={(obj) => props.handleInput(obj, "adminAreaLevel1")}
      />

      <NameInput
        state={props.zipCode}
        placeholder="Postal Code"
        handleInput={(obj) => props.handleInput(obj, "zipCode")}
      />

      <NameInput
        state={props.country}
        placeholder="Country"
        handleInput={(obj) => props.handleInput(obj, "country")}
      />
    </Wrapper>
  );
}
