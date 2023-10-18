import {
  Address,
  AddressOptional,
  AddressValidationApi_Response,
  AddressValidationApi_Response_AddressComponent,
} from "../../../../../../types/index";

interface Props<T> {
  state: T;
  response: AddressValidationApi_Response | null;
}

/**
 * Given a state object and an address validation api response, set the address validation response's
 * formatted values to values in the state object. This will correct spelling and provide
 * proper formatting.
 */
export default function setAddressValidationApiResponseToState<
  T extends Address | AddressOptional
>({ state, response }: Props<T>): T {
  if (!response || !response.result) {
    throw new Error("result must be defined and non-null");
  }

  const _formattedAddress = response.result.address.formattedAddress;
  const _geolocation = {
    lat: response.result.geocode.location.latitude,
    lng: response.result.geocode.location.longitude,
  };

  let _streetAddress = "",
    _city = "",
    _adminAreaLevel1 = "",
    _zipCode = "",
    _country = "";

  // Get geolocation from response

  // Get streetAddress, city, state, zipCode and country from response
  for (const component of response!.result?.address
    .addressComponents as AddressValidationApi_Response_AddressComponent[]) {
    const componentType = component.componentType;

    switch (componentType) {
      case "street_number": {
        _streetAddress = `${component.componentName["text"]}`;
        break;
      }

      case "route": {
        _streetAddress += ` ${component.componentName["text"]}`;
        break;
      }

      case "postal_code": {
        _zipCode = `${component.componentName["text"]}`;
        break;
      }

      case "postal_code_suffix": {
        _zipCode = `${_zipCode}-${component.componentName["text"]}`;
        break;
      }

      case "locality":
        _city = `${component.componentName["text"]}`;
        break;

      case "administrative_area_level_1": {
        _adminAreaLevel1 = `${component.componentName["text"]}`;
        break;
      }

      case "country":
        _country = `${component.componentName["text"]}`;
        break;
    }
  }

  // Define new state object
  const s: T = {
    ...state,
    streetAddress: {
      ...state.streetAddress,
      value: _streetAddress,
    },
    unitNumber: {
      ...state.unitNumber,
    },
    city: {
      ...state.city,
      value: _city,
    },
    adminAreaLevel1: {
      ...state.adminAreaLevel1,
      value: _adminAreaLevel1,
    },
    zipCode: {
      ...state.zipCode,
      value: _zipCode,
    },
    country: {
      ...state.country,
      value: _country,
    },
    formattedAddress: {
      ...state.formattedAddress,
      value: _formattedAddress,
    },
    geolocation: {
      ...state.geolocation,
      value: _geolocation,
    },
  };

  return s;
}
