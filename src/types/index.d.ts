import { DocumentData, FieldValue } from "firebase/firestore";
import { AriaAttributes, DOMAttributes } from "react";

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

/**
 * This is a hack to add the fetchpriority attribute to the HTMLAttributes
 * Using this to try and reduce the LCP of the home page's top image
 */
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}

export interface DropdownStyles {
  btnWidth: string;
  btnHeight: string;
  menuMinWidth?: string;
  menuMaxWidth?: string;
  menuWidth: string;
  menuHeight: string;
}

/**
 * Used on all form sections and fields that are savable/editable
 */
export interface Verify {
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
}

export type VerifyActionName =
  | "saveAndContinue"
  | "clearForm"
  | "enableEditing"
  | "everythingLooksCorrect"
  | "everythingDoesNotLookCorrect";

export interface TypeInputBase extends Verify {
  /** String with only numeric characters */
  numberStr: string;
  number: number;
  formatted: string;
  shortFormatted: string;
}

// export interface Str extends TypeInputBase {
//   value: string;
// }

export interface Str {
  value: string;
  numberStr: string;
  number: number;
  formatted: string;
  shortFormatted: string;
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
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

export interface TypeGeolocation extends Str {
  value: TypeLatLng;
}

/**
 * All form fields must fit this type
 */
export interface FormField extends TypeInputBase {
  value: string | number | boolean | TypeDropdownOption[] | TypeLatLng | null;
}

export interface Address extends Verify {
  streetAddress: Str;
  unitNumber: Str;
  city: Str;
  zipCode: Str;
  /** A county in the USA */
  adminAreaLevel2: Str;
  /** A state in the USA */
  adminAreaLevel1: Str;
  country: Str;
  formattedAddress: Str;
  geolocation: TypeGeolocation;
  // address_components: TypePlacesApi_Response_AddressComponent[];
  addressComponents: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface AddressOptional extends Verify {
  streetAddress?: Str;
  unitNumber?: Str;
  city?: Str;
  adminAreaLevel1?: Str;
  adminAreaLevel2?: Str;
  zipCode?: Str;
  country?: Str;
  formattedAddress?: Str;
  geolocation?: TypeGeolocation;
  // address_components?: AddressValidationApi_Response_AddressComponent;
  addressComponents?: AddressComponent[];
}

export interface HasOptionalAddress extends AddressOptional {
  provideAddress: boolean;
}

export interface AddressValidationApi_Response {
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
export interface GeocoderApi_Response {
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

export interface AddressValidationApi_Response_AddressComponent {
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

// export type ForSaleOrRentFilter = ForSaleOrRentValue[];

export type ForSaleOrRentValue =
  | { id: "for-rent"; label: "For Rent" }
  | { id: "for-sale"; label: "For Sale" }
  | { id: "for-sale-or-rent"; label: "For Sale or Rent" }
  | null;

export interface ForSaleOrRent extends Str {
  value: ForSaleOrRentValue;
}

export type ForSaleByValue =
  | { id: "agent"; label: "Agent" }
  | { id: "owner"; label: "Owner" }
  | null;

export interface ForSaleBy extends Str {
  value: ForSaleByValue;
}

export type ForRentByValue =
  | { id: "company"; label: "Company" }
  | { id: "private-owner"; label: "Private Owner" }
  | null;

export interface ForRentBy extends Str {
  value: ForRentByValue;
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

export type ListingKindValue =
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
  | { id: "land"; name: "land"; label: "Land" }
  | null;

export interface ListingKind extends Str {
  value: ListingKindValue;
}

export interface Name {
  firstName: Str;
  middleName: Str;
  lastName: Str;
}

export interface ContactInfo {
  phoneNumber: Str;
  email: Str;
}

export interface Agent extends Name, ContactInfo, Address {
  licenseId: Str;
  companyName: Str;
}

export interface Owner extends Name, ContactInfo, AddressOptional {
  provideAddress: TypeBool;
}

export interface Company extends ContactInfo, Address {
  name: Str;
}

export interface PrivateOwner extends Name, ContactInfo, AddressOptional {
  provideAddress: TypeBool;
}

export type HeatingOption =
  | { id: "firePlace"; label: "Fire Place" }
  | { id: "propaneWallHeater"; label: "Propane Wall Heater" }
  | { id: "propaneFurnace"; label: "Propane Furnace" }
  | { id: "other"; label: "Other" }
  | null;

export interface Heating extends Verify {
  value: HeatingOption[];
}

export type CoolingOption =
  | { id: "centralAirConditioning"; label: "Central AC" }
  | { id: "windMaker500"; label: "Wind Maker 500" }
  | { id: "other"; label: "Other" }
  | null;

export interface Cooling extends Verify {
  value: CoolingOption[];
}

export type WaterOption =
  | { id: "cityWater"; label: "City Water" }
  | { id: "well"; label: "Well" }
  | { id: "catchment"; label: "Catchment" }
  | { id: "spring"; label: "Spring" }
  | { id: "other"; label: "Other" }
  | null;

export interface Water extends Verify {
  value: WaterOption[];
}

export type PowerOption =
  | { id: "onGrid"; label: "On-Grid" }
  | { id: "offGrid"; label: "Off-Grid" }
  | { id: "gridTie"; label: "Grid-Tie" }
  | { id: "solar"; label: "Solar" }
  | { id: "wind"; label: "Wind" }
  | { id: "hydro"; label: "Hydro" }
  | { id: "backupGenerator"; label: "Backup Generator" }
  | { id: "other"; label: "Other" }
  | null;

export interface Power extends Verify {
  value: PowerOption[];
}

export interface SingleFamilyHome extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  stories: Str;
  acres: Str;
  heating: Heating;
  cooling: Cooling;
  garage: TypeBool;
  garageSqFt?: Str;
  garageNumCars?: Str;
  garageAttached?: TypeBool;
  furnished: TypeBool;
  fencedYard: TypeBool;
  streetParking: TypeBool;
  water: Water;
  power: Power;
}

export interface MultiFamilyHomeUnit extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  stories: Str;
  unitsInBuilding: Str;

  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;

  garage: TypeBool;
  garageSqFt?: Str;
  garageNumCars?: Str;
  garageAttached?: TypeBool;

  parkingSpaces: Str;
  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
  streetParking: TypeBool;
}

export interface MultiFamilyHome extends Verify {
  totalUnits: Str;
  yearBuilt: Str;
  stories: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;

  unitsWithGarageSpace: Str;
  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;
  fencedYard: TypeBool;
  streetParking: TypeBool;
}

export interface ApartmentBuilding extends Verify {
  totalUnits: Str;
  yearBuilt: Str;
  stories: Str;
  squareFeet: Str;
  acres: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;
}

export interface Apartment extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  floorNumber: Str;

  stairAccess: TypeBool;
  elevatorAccess: TypeBool;

  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;

  assignedParking: TypeBool;
  numAssignedSpaces?: Str;
  numAssignedSpacesWithCover?: Str;

  unassignedParkingAvailable: TypeBool;
  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface Condo extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  floorNumber: Str;

  stairAccess: TypeBool;
  elevatorAccess: TypeBool;

  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;

  assignedParking: TypeBool;
  numAssignedSpaces?: Str;
  numAssignedSpacesWithCover?: Str;

  unassignedParkingAvailable: TypeBool;
  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface Townhouse extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;
  stories: Str;

  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;

  garage: TypeBool;
  garageSqFt?: Str;
  garageNumCars?: Str;
  garageAttached?: TypeBool;

  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface ManufacturedHome extends Verify {
  yearBuilt: Str;
  squareFeet: Str;
  bedrooms: Str;
  fullBathrooms: Str;
  halfBathrooms: Str;

  heating: Heating;
  cooling: Cooling;
  water: Water;
  power: Power;

  streetParking: TypeBool;

  furnished: TypeBool;
  fencedYard: TypeBool;
  sharedYard: TypeBool;
}

export interface Land extends Verify {
  acres: Str;
  elevation: Str;
  cityWater: TypeBool;
  citySewer: TypeBool;
  cityPower: TypeBool;
  developedRoads: TypeBool;
}

export type TimeStamp = FieldValue | null;

export interface UserRef {
  uid: string;
}

/** All objects extend Str */
export interface BasicInfo extends Verify {
  listingKind: ListingKind;
  description: Str;
  price: Str;
  priceChange: Str;
  forSaleOrRent: ForSaleOrRent;
  forSaleBy?: ForSaleBy;
  forRentBy?: ForRentBy;
}

export interface TypeReview extends Verify {}

export interface Image {
  file?: File;
  name: string;
  url: string;
}

export interface Images {
  value: Image[] | [];
  /** Used when a listing is updated and new images are added */
  // valueFromEdit: Image[] | [];
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface Uploads extends Verify {
  images: Images;
}

export interface ListingData {
  address: Address;
  basicInfo: BasicInfo;
  agent?: Agent;
  owner?: Owner;
  company?: Company;
  privateOwner?: PrivateOwner;
  singleFamilyHome?: SingleFamilyHome;
  multiFamilyHome?: MultiFamilyHome;
  multiFamilyHomeUnit?: MultiFamilyHomeUnit;
  apartment?: Apartment;
  apartmentBuilding?: ApartmentBuilding;
  condo?: Condo;
  townhouse?: Townhouse;
  manufacturedHome?: ManufacturedHome;
  land?: Land;
  uploads: Uploads;
  review: TypeReview;
  timestamp: TimeStamp | string | Date;
  userRef: UserRef;
}

export type TypeFetchedListingData = ListingData & DocumentData;

export type FetchedListing = {
  id: string;
  data: TypeFetchedListingData;
};

export interface ListingFilters {
  place?: google.maps.places.PlaceResult;
  forSaleOrRent: ForSaleOrRentValue;
  lowPrice: Str;
  highPrice: Str;
  listingKinds: ListingKindValue[];
  listedBy: TypeListedBy[];
  beds: number | null;
  baths: number | null;

  // price: Str;
  // priceChange: Str;
  // forSaleBy?: ForSaleBy;
  // forRentBy?: ForRentBy;
  // listedBy:
  // agent?: Agent;
  // owner?: Owner;
  // company?: Company;
  // privateOwner?: PrivateOwner;
  // singleFamilyHome?: SingleFamilyHome;
  // multiFamilyHome?: MultiFamilyHome;
  // multiFamilyHomeUnit?: MultiFamilyHomeUnit;
  // apartment?: Apartment;
  // apartmentBuilding?: ApartmentBuilding;
  // condo?: Condo;
  // townhouse?: TypeTownHouse;
  // manufacturedHome?: ManufacturedHome;
  // land?: Land;
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

export type Boundaries = {
  cityBoundaries: google.maps.FeatureLayer;
  postalCodeBoundaries: google.maps.FeatureLayer;
  countyBoundaries: google.maps.FeatureLayer;
  stateBoundaries: google.maps.FeatureLayer;
  countryBoundaries: google.maps.FeatureLayer;
} | null;
