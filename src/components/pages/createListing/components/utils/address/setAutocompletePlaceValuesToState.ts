import {
  TypeGeocoderApi_Response_AddressTypes,
  TypeAddress,
  TypeAddressOptional,
} from "../../../../../../index";

interface Props<T> {
  state: T;
  autocomplete: google.maps.places.Autocomplete | null;
}

/**
 * Handle when a user clicks on a Google Places API item from the autocomplete dropdown menu
 * that appears below street address input field.
 */
export default function setAutocompletePlaceValuesToState<
  T extends TypeAddress | TypeAddressOptional
>({ state, autocomplete }: Props<T>) {
  if (autocomplete) {
    const place = autocomplete.getPlace();
    // console.log("response from getPlace(): ", place);
    let _streetAddress = "",
      _zipCode = "",
      _city = "",
      _adminAreaLevel1 = "",
      _adminAreaLevel2 = "",
      _country = "",
      _formattedAddress = "",
      _geolocation = { lat: 0, lng: 0 };

    // console.log("place.formatted_address: ", place.formatted_address);
    // console.log("place_id: ", place.place_id);

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
      for (const type of component.types as TypeGeocoderApi_Response_AddressTypes) {
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

    console.log("_adminAreaLevel1 WTF: ", _adminAreaLevel1);

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
        formatted: _geolocation,
        valid: true,
      },
      address_components: place.address_components,
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
