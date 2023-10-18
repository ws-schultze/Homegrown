import React from "react";

/**
 *
 * @param streetAddressRef reference to the streetAddress input
 * @returns autocompleteWidget of type google.maps.places.Autocomplete
 */
export default function makeAutocompleteWidget(
  streetAddressRef: React.MutableRefObject<HTMLInputElement | null>
): google.maps.places.Autocomplete {
  if (streetAddressRef.current && streetAddressRef.current !== null) {
    const autocompleteWidget: google.maps.places.Autocomplete = new window.google.maps.places.Autocomplete(
      streetAddressRef.current,
      {
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["address"],
      }
    );
    return autocompleteWidget;
  } else {
    throw new Error("Something went wrong");
  }
}
