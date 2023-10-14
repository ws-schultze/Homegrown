import { DocumentData, FieldValue } from "firebase/firestore";

declare module "*.scss";

/**
 * Used on all form sections and fields that are savable/editable
 */
export interface TypeVerify {
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
}

export type TypeVerifyActionName = "save" | "verify" | "edit";

export interface TypeInputBase extends TypeVerify {
  /** String with only numeric characters */
  numberStr: string;
  number: number;
  formatted: string;
  shortFormatted: string;
}

export interface TypeStr extends TypeInputBase {
  value: string;
}

export type TypeBoolValue = boolean | null;

export interface TypeBool extends TypeInputBase {
  value: boolean | null;
}

export interface TypeNum extends TypeInputBase {
  value: number;
}

export interface TypeDropdownOption {
  id: string;
  label: string;
}

export interface TypeLatLng {
  lat: number;
  lng: number;
}

export interface TypeGeolocation extends TypeStr {
  value: TypeLatLng;
}

/**
 * All form fields must fit this type
 */
export interface TypeFormField extends TypeInputBase {
  value: string | number | boolean | TypeDropdownOption[] | TypeLatLng | null;
}

export interface TypeAddress extends TypeVerify {
  streetAddress: TypeStr;
  unitNumber: TypeStr;
  city: TypeStr;
  zipCode: TypeStr;
  adminAreaLevel2: TypeStr;
  adminAreaLevel1: TypeStr;
  country: TypeStr;
  formattedAddress: TypeStr;
  geolocation: TypeGeolocation;
  address_components: TypePlacesApi_Response_AddressComponent[];
}

export interface TypeAddressOptional extends TypeVerify {
  streetAddress?: TypeStr;
  unitNumber?: TypeStr;
  city?: TypeStr;
  adminAreaLevel1?: TypeStr;
  adminAreaLevel2?: TypeStr;
  zipCode?: TypeStr;
  country?: TypeStr;
  formattedAddress?: TypeStr;
  geolocation?: TypeGeolocation;
  address_components?: TypeAddressValidationApi_Response_AddressComponent;
}

export interface TypeAddressValidationApi_Response {
  result?: {
    verdict: object;
    address: TypeAddressValidationApi_Response_Address;
    geocode: TypeAddressValidationApiGeocode;
    metadata: object;
    uspsData: object;
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * This list of possible component type was founds at
 * https://developers.google.com/maps/documentation/places/web-service/supported_types#table2
 */
export type AddressValidationApiComponentType =
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "administrative_area_level_3"
  | "administrative_area_level_4"
  | "administrative_area_level_5"
  | "administrative_area_level_6"
  | "administrative_area_level_7"
  | "archipelago"
  | "colloquial_area"
  | "continent"
  | "country"
  | "establishment"
  | "finance"
  | "floor"
  | "food"
  | "general_contractor"
  | "geocode"
  | "health"
  | "intersection"
  | "landmark"
  | "locality"
  | "natural_feature"
  | "neighborhood"
  | "place_of_worship"
  | "plus_code"
  | "point_of_interest"
  | "political"
  | "post_box"
  | "postal_code"
  | "postal_code_prefix"
  | "postal_code_suffix"
  | "postal_town"
  | "premise"
  | "room"
  | "route"
  | "street_address"
  | "street_number"
  | "sublocality"
  | "sublocality_level_1"
  | "sublocality_level_2"
  | "sublocality_level_3"
  | "sublocality_level_4"
  | "sublocality_level_5"
  | "subpremise"
  | "town_square";

export type TypeGeocoderApi_ResponseAddressTypeOption =
  | "street_number"
  | "route"
  | "intersection"
  | "political"
  | "country"
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "administrative_area_level_3"
  | "administrative_area_level_4"
  | "administrative_area_level_5"
  | "administrative_area_level_6"
  | "administrative_area_level_7"
  | "colloquial_area"
  | "locality"
  | "sublocality"
  | "neighborhood"
  | "premise"
  | "subpremise"
  | "postal_code_suffix"
  | "postal_code"
  | "natural_feature"
  | "airport"
  | "park"
  | "point_of_interest";

/**
 * This const was created using the definitions found at
 * https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
 */
export const allGeocoderApiAddressTypes = [
  "street_number",
  "route",
  "intersection",
  "political",
  "country",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "administrative_area_level_6",
  "administrative_area_level_7",
  "colloquial_area",
  "locality",
  "sublocality",
  "neighborhood",
  "premise",
  "subpremise",
  "postal_code_suffix",
  "postal_code",
  "natural_feature",
  "airport",
  "park",
  "point_of_interest",
] as const;

/**
 * This type was created using the definitions found at
 * https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
 */
export type TypeGeocoderApi_Response_AddressTypes =
  typeof allGeocoderApiAddressTypes;

/**
 * This interface was created using the GeocoderAddress definition found at
 * https://developers.google.com/maps/documentation/javascript/reference/geocoder#GeocoderAddressComponent
 */
export interface TypeGeocoderApi_Response_AddressComponent {
  long_name: string;
  short_name: string;
  types: TypeGeocoderApi_Response_AddressTypes;
}

export interface TypePlacesApi_Response_AddressComponent {
  long_name: string;
  short_name: string;
  types: TypeGeocoderApi_Response_AddressTypes | [];
}

export interface TypeGeocoderApi_Response_Geometry {
  location: TypeLatLng;
  location_type: string;
  viewport: {
    northeast: TypeLatLng;
    southwest: TypeLatLng;
  };
}

export type TypeGeocoderApi_ResponseStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "OVER_DAILY_LIMIT"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

// https://developers.google.com/maps/documentation/geocoding/requests-geocoding#GeocodingResponses
export interface TypeGeocoderApi_Response {
  results: [
    {
      address_components: TypeGeocoderApi_Response_AddressComponent[];
      formatted_address: string;
      geometry: TypeGeocoderApi_Response_Geometry;
      place_id: string;
      plus_code: {
        compound_code: string;
        global_code: string;
      };
      types: TypeGeocoderApi_Response_AddressTypes;
    }
  ];
  status: TypeGeocoderApi_ResponseStatus;
}

export interface TypeAddressValidationApi_Response_Address {
  formattedAddress: string;
  postalAddress: {
    revision: integer;
    regionCode: string;
    languageCode: string;
    postalCode: string;
    sortingCode: string;
    administrativeArea: string;
    locality: string;
    sublocality: string;
    addressLines: string[];
    recipients: string[];
    organization: string;
  };
  addressComponents: [
    {
      componentName: {
        text: string;
        languageCode: string;
      };
      componentType: AddressValidationApiComponentType;
      confirmationLevel: string;
      inferred: boolean;
      spellCorrected: boolean;
      replaced: boolean;
      unexpected: boolean;
    }
  ];
  missingComponentTypes: [string];
  unconfirmedComponentTypes: [string];
  unresolvedTokens: [string];
}

export interface TypeAddressValidationApiGeocode {
  location: {
    latitude: number;
    longitude: number;
  };
  plusCode: {
    globalCode: string;
    compoundCode: string;
  };
  bounds: {
    low: {
      latitude: number;
      longitude: number;
    };
    high: {
      latitude: number;
      longitude: number;
    };
  };
  featureSizeMeters: number;
  placeId: string;
  placeTypes: [string];
}

export interface TypeAddressValidationApi_Response_AddressComponent {
  componentName: {
    text: string;
    languageCode: string;
  };
  componentType: AddressValidationApiComponentType;
  confirmationLevel: string;
  inferred: boolean;
  spellCorrected: boolean;
  replaced: boolean;
  unexpected: boolean;
}

export interface TypeFormattedNumber {
  value: string;
  number: number;
  formatted: string;
  shortFormatted: string;
  valid: boolean;
  errorMsg: string;
  required: boolean;
}

// export type TypeForSaleOrRentFilter = TypeForSaleOrRentValue[];

export type TypeForSaleOrRentValue =
  | { id: "for-rent"; label: "For Rent" }
  | { id: "for-sale"; label: "For Sale" }
  | { id: "for-sale-or-rent"; label: "For Sale or Rent" }
  | null;

export interface TypeForSaleOrRent extends TypeStr {
  value: TypeForSaleOrRentValue;
}

export type TypeForSaleByValue =
  | { id: "agent"; label: "Agent" }
  | { id: "owner"; label: "Owner" }
  | null;

export interface TypeForSaleBy extends TypeStr {
  value: TypeForSaleByValue;
}

export type TypeForRentByValue =
  | { id: "company"; label: "Company" }
  | { id: "private-owner"; label: "Private Owner" }
  | null;

export interface TypeForRentBy extends TypeStr {
  value: TypeForRentByValue;
}

export type TypeListedBy =
  | { id: "company"; label: "Company" }
  | { id: "private-owner"; label: "Private Owner" }
  | { id: "agent"; label: "Agent" }
  | { id: "owner"; label: "Owner" }
  | null;

export type ListingTypeValueID =
  | "single-family-home"
  | "multi-family-home"
  | "multi-family-home-unit";

export type ListingTypeValueForRent =
  | { id: "single-family-home"; name: "singleFamilyHome"; label: "House" }
  | {
      id: "multi-family-home-unit";
      name: "multiFamilyHomeUnit";
      label: "Multi-Family Home Unit";
    }
  | { id: "apartment"; name: "apartment"; label: "Apartment" }
  | { id: "condo"; name: "condo"; label: "Condo" };

export type ListingTypeValueForSale =
  | { id: "single-family-home"; name: "singleFamilyHome"; label: "House" }
  | {
      id: "multi-family-home";
      name: "multiFamilyHome";
      label: "Multi-Family Home";
    }
  | {
      id: "apartment-building";
      name: "apartmentBuilding";
      label: "Apartment Building";
    }
  | { id: "condo"; name: "condo"; label: "Condo" }
  | { id: "townhouse"; name: "townhouse"; label: "Townhouse" };

export type ListingTypeValue =
  | { id: "single-family-home"; name: "singleFamilyHome"; label: "House" }
  | {
      id: "multi-family-home";
      name: "multiFamilyHome";
      label: "Multi-Family Home";
    }
  | {
      id: "multi-family-home-unit";
      name: "multiFamilyHomeUnit";
      label: "Multi-Family Home Unit";
    }
  | {
      id: "apartment-building";
      name: "apartmentBuilding";
      label: "Apartment Building";
    }
  | { id: "apartment"; name: "apartment"; label: "Apartment" }
  | { id: "condo"; name: "condo"; label: "Condo" }
  | { id: "townhouse"; name: "townhouse"; label: "Townhouse" }
  | {
      id: "manufactured-home";
      name: "manufacturedHome";
      label: "Manufactured Home";
    }
  | { id: "land"; name: "land"; label: "Land" }
  | null;

export interface TypeListingKind extends TypeStr {
  value: ListingTypeValue;
}

export interface TypeName {
  firstName: TypeStr;
  middleName: TypeStr;
  lastName: TypeStr;
}

export interface TypeContactInfo {
  phoneNumber: TypeStr;
  email: TypeStr;
}

export interface TypeAgent extends TypeName, TypeContactInfo, TypeAddress {
  licenseId: TypeStr;
  companyName: TypeStr;
}

export interface TypeOwner
  extends TypeName,
    TypeContactInfo,
    TypeAddressOptional {
  provideAddress: TypeBool;
}

export interface TypeCompany extends TypeContactInfo, TypeAddress {
  name: TypeStr;
}

export interface TypePrivateOwner
  extends TypeName,
    TypeContactInfo,
    TypeAddressOptional {
  provideAddress: TypeBool;
}

export type TypeHeatingOption =
  | { id: "firePlace"; label: "Fire Place" }
  | { id: "propaneWallHeater"; label: "Propane Wall Heater" }
  | { id: "propaneFurnace"; label: "Propane Furnace" }
  | { id: "other"; label: "Other" }
  | null;

export interface TypeHeating extends TypeVerify {
  value: TypeHeatingOption[];
}

export type TypeCoolingOption =
  | { id: "centralAirConditioning"; label: "Central AC" }
  | { id: "windMaker500"; label: "Wind Maker 500" }
  | { id: "other"; label: "Other" }
  | null;

export interface TypeCooling extends TypeVerify {
  value: TypeCoolingOption[];
}

export type TypeWaterOption =
  | { id: "cityWater"; label: "City Water" }
  | { id: "well"; label: "Well" }
  | { id: "catchment"; label: "Catchment" }
  | { id: "spring"; label: "Spring" }
  | { id: "other"; label: "Other" }
  | null;

export interface TypeWater extends TypeVerify {
  value: TypeWaterOption[];
}

export type TypePowerOption =
  | { id: "onGrid"; label: "On-Grid" }
  | { id: "offGrid"; label: "Off-Grid" }
  | { id: "gridTie"; label: "Grid-Tie" }
  | { id: "solar"; label: "Solar" }
  | { id: "wind"; label: "Wind" }
  | { id: "hydro"; label: "Hydro" }
  | { id: "backupGenerator"; label: "Backup Generator" }
  | { id: "other"; label: "Other" }
  | null;

export interface TypePower extends TypeVerify {
  value: TypePowerOption[];
}

export interface TypeSingleFamilyHome extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;
  stories: TypeStr;
  acres: TypeStr;
  heating: TypeHeating;
  cooling: TypeCooling;
  garage: TypeBool;
  garageSqFt?: TypeStr;
  garageNumCars?: TypeStr;
  garageAttached?: TypeBool;
  furnished: TypeBool;
  fencedYard: TypeBool;
  streetParking: TypeBool;
  water: TypeWater;
  power: TypePower;
}

export interface TypeMultiFamilyHomeUnit extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;
  stories: TypeStr;
  unitsInBuilding: TypeStr;

  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;

  garage: TypeBool;
  garageSqFt?: TypeStr;
  garageNumCars?: TypeStr;
  garageAttached?: TypeBool;

  parkingSpaces: TypeStr;
  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
  streetParking: TypeBool;
}

export interface TypeMultiFamilyHome extends TypeVerify {
  totalUnits: TypeStr;
  yearBuilt: TypeStr;
  stories: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;

  unitsWithGarageSpace: TypeStr;
  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;
  fencedYard: TypeBool;
  streetParking: TypeBool;
}

export interface TypeApartmentBuilding extends TypeVerify {
  totalUnits: TypeStr;
  yearBuilt: TypeStr;
  stories: TypeStr;
  squareFeet: TypeStr;
  acres: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;
  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;
}

export interface TypeApartment extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;
  floorNumber: TypeStr;

  stairAccess: TypeBool;
  elevatorAccess: TypeBool;

  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;

  assignedParking: TypeBool;
  numAssignedSpaces?: TypeStr;
  numAssignedSpacesWithCover?: TypeStr;

  unassignedParkingAvailable: TypeBool;
  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface TypeCondo extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;
  floorNumber: TypeStr;

  stairAccess: TypeBool;
  elevatorAccess: TypeBool;

  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;

  assignedParking: TypeBool;
  numAssignedSpaces?: TypeStr;
  numAssignedSpacesWithCover?: TypeStr;

  unassignedParkingAvailable: TypeBool;
  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface TypeTownhouse extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;

  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;

  assignedParking: TypeBool;
  numAssignedSpaces?: TypeStr;
  numAssignedSpacesWithCover?: TypeStr;

  unassignedParkingAvailable: TypeBool;
  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface TypeManufacturedHome extends TypeVerify {
  yearBuilt: TypeStr;
  squareFeet: TypeStr;
  bedrooms: TypeStr;
  fullBathrooms: TypeStr;
  halfBathrooms: TypeStr;

  heating: TypeHeating;
  cooling: TypeCooling;
  water: TypeWater;
  power: TypePower;

  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface TypeLand extends TypeVerify {
  acres: number | null;
  cityWater: boolean | null;
  onGrid: boolean | null;
  roads: boolean | null;
  price: boolean | null;
  priceChangeActive: boolean | null;
}

export type TypeTimeStamp = FieldValue | null;

export interface TypeUserRef {
  uid: string;
}

/** All objects extend TypeStr */
export interface TypeBasicInfo extends TypeVerify {
  listingKind: TypeListingKind;
  description: TypeStr;
  price: TypeStr;
  priceChange: TypeStr;
  forSaleOrRent: TypeForSaleOrRent;
  forSaleBy?: TypeForSaleBy;
  forRentBy?: TypeForRentBy;
}

export interface TypeReview extends TypeVerify {}

export interface TypeImage {
  file?: File;
  name: string;
  url: string;
}

export interface TypeImages {
  value: TypeImage[] | [];
  /** Used when a listing is updated and new images are added */
  valueFromEdit: TypeImage[] | [];
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface TypeUploads extends TypeVerify {
  images: TypeImages;
}

export interface TypeListingData {
  page: number;
  savedPages: number[];
  userAcknowledged: boolean;
  address: TypeAddress;
  basicInfo: TypeBasicInfo;
  agent?: TypeAgent;
  owner?: TypeOwner;
  company?: TypeCompany;
  privateOwner?: TypePrivateOwner;
  singleFamilyHome?: TypeSingleFamilyHome;
  multiFamilyHome?: TypeMultiFamilyHome;
  multiFamilyHomeUnit?: TypeMultiFamilyHomeUnit;
  apartment?: TypeApartment;
  apartmentBuilding?: TypeApartmentBuilding;
  condo?: TypeCondo;
  townhouse?: TypeTownhouse;
  manufacturedHome?: TypeManufacturedHome;
  land?: TypeLand;
  uploads: TypeUploads;
  review: TypeReview;
  timestamp: TypeTimeStamp;
  userRef: TypeUserRef;
}

export type TypeFetchedListingData = TypeListingData & DocumentData;

export type TypeFetchedListing = {
  id: string;
  data: TypeFetchedListingData;
};

export interface TypeListingFilters {
  place?: google.maps.places.PlaceResult;
  forSaleOrRent: TypeForSaleOrRentValue;
  lowPrice: TypeStr;
  highPrice: TypeStr;
  listingKinds: ListingTypeValue[];
  listedBy: TypeListedBy[];
  beds: number | null;
  baths: number | null;

  // price: TypeStr;
  // priceChange: TypeStr;
  // forSaleBy?: TypeForSaleBy;
  // forRentBy?: TypeForRentBy;
  // listedBy:
  // agent?: TypeAgent;
  // owner?: TypeOwner;
  // company?: TypeCompany;
  // privateOwner?: TypePrivateOwner;
  // singleFamilyHome?: TypeSingleFamilyHome;
  // multiFamilyHome?: TypeMultiFamilyHome;
  // multiFamilyHomeUnit?: TypeMultiFamilyHomeUnit;
  // apartment?: TypeApartment;
  // apartmentBuilding?: TypeApartmentBuilding;
  // condo?: TypeCondo;
  // townhouse?: TypeTownHouse;
  // manufacturedHome?: TypeManufacturedHome;
  // land?: TypeLand;
}

// https://developers.google.com/maps/documentation/places/web-service/supported_types
export type TypePlacesRegion =
  | "locality"
  | "sublocality"
  | "postal_code"
  | "country"
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | undefined;

export type TypeCoord = {
  lat: number | (() => number) | undefined;
  lng: number | (() => number) | undefined;
};

export type TypeBoundaries = {
  cityBoundaries: google.maps.FeatureLayer;
  postalCodeBoundaries: google.maps.FeatureLayer;
  countyBoundaries: google.maps.FeatureLayer;
  stateBoundaries: google.maps.FeatureLayer;
  countryBoundaries: google.maps.FeatureLayer;
} | null;
