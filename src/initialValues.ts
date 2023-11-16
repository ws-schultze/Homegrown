import * as T from "./types/index";
// import {
//   BasicInfo,
//   ForSaleOrRentValue,
//   Images,
//   ListingData,
//   ListingFilters,
//   MultiFamilyHomeUnit,
//   TypePlacesApi_Response_AddressComponent,
//   Uploads,
//   UserRef,
//   Verify,
// } from ".";
// import {
//   WaterOption,
//   PowerOption,
//   Power,
//   TypeBool,
//   ForSaleOrRent,
//   ForSaleBy,
//   ForRentBy,
// } from "./index";
// import {
//   MultiFamilyHome,
//   Condo,
//   Townhouse,
//   ManufacturedHome,
//   Water,
//   TimeStamp,
// } from "./index";
// import {
//   Address,
//   Agent,
//   SingleFamilyHome,
//   ListingKindValue,
// } from "./index";
// import {
//   ApartmentBuilding,
//   Image,
//   Land,
//   Heating,
//   Cooling,
//   ListingKind,
//   CoolingOption,
//   HeatingOption,
// } from "./index";
// import {
//   Owner,
//   Company,
//   PrivateOwner,
//   Name,
//   Str,
//   TypeGeolocation,
// } from "./index";

export const allForSaleOrRentValues: T.ForSaleOrRentValue[] = [
  { id: "for-sale", label: "For Sale" },
  { id: "for-rent", label: "For Rent" },
  { id: "for-sale-or-rent", label: "For Sale or Rent" },
  null,
];

export const listingKindValuesForSale: T.ListingKindValue[] = [
  { id: "single-family-home", name: "singleFamilyHome", label: "House" },
  {
    id: "multi-family-home",
    name: "multiFamilyHome",
    label: "Multi-Family Home",
  },
  {
    id: "apartment-building",
    name: "apartmentBuilding",
    label: "Apartment Building",
  },
  { id: "condo", name: "condo", label: "Condo" },
  { id: "townhouse", name: "townhouse", label: "Townhouse" },
  // { id: "manufactured-home", name: "manufacturedHome", label: "Manufactured Home" },
  { id: "land", name: "land", label: "Land" },
];

export const listingKindValuesForRent: T.ListingKindValue[] = [
  { id: "single-family-home", name: "singleFamilyHome", label: "House" },
  {
    id: "multi-family-home-unit",
    name: "multiFamilyHomeUnit",
    label: "Multi-Family Home Unit",
  },
  { id: "apartment", name: "apartment", label: "Apartment" },
  { id: "condo", name: "condo", label: "Condo" },
  { id: "townhouse", name: "townhouse", label: "Townhouse" },
  // { id: "manufactured-home", name: "manufacturedHome", label: "Manufactured Home" },
  { id: "land", name: "land", label: "Land" },
];

export const initTypeBoolReqNull: T.TypeBool = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTypeBoolReqTrue: T.TypeBool = {
  value: true,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTypeBoolReqFalse: T.TypeBool = {
  value: false,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTypeBoolOptNull: T.TypeBool = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTypeBoolOptTrue: T.TypeBool = {
  value: true,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTypeBoolOptFalse: T.TypeBool = {
  value: false,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initStrReq: T.Str = {
  value: "",
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initStrOpt: T.Str = {
  value: "",
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initGeolocationOpt: T.TypeGeolocation = {
  value: { lat: 0, lng: 0 },
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initAddressComponent: T.TypePlacesApi_Response_AddressComponent = {
  long_name: "",
  short_name: "",
  types: [],
};

export const initAddress: T.Address = {
  streetAddress: initStrReq,
  unitNumber: initStrOpt,
  city: initStrReq,
  adminAreaLevel1: initStrReq,
  zipCode: initStrReq,
  adminAreaLevel2: initStrOpt,
  country: initStrReq,
  formattedAddress: initStrOpt,
  geolocation: initGeolocationOpt,
  addressComponents: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: true,
};

export const initName: T.Name = {
  firstName: initStrReq,
  middleName: initStrOpt,
  lastName: initStrReq,
};

export const initAgent: T.Agent = {
  firstName: initStrReq,
  middleName: initStrOpt,
  lastName: initStrReq,
  licenseId: initStrReq,
  companyName: initStrReq,
  phoneNumber: initStrReq,
  email: initStrReq,
  streetAddress: initStrReq,
  unitNumber: initStrOpt,
  city: initStrReq,
  adminAreaLevel1: initStrReq,
  zipCode: initStrReq,
  adminAreaLevel2: initStrOpt,
  country: initStrReq,
  // addressValidationApiResponse: null,
  formattedAddress: initStrOpt,
  geolocation: initGeolocationOpt,
  addressComponents: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initOwner: T.Owner = {
  firstName: initStrReq,
  middleName: initStrOpt,
  lastName: initStrReq,
  phoneNumber: initStrReq,
  email: initStrReq,
  provideAddress: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initCompany: T.Company = {
  name: initStrReq,
  phoneNumber: initStrReq,
  email: initStrReq,
  streetAddress: initStrReq,
  unitNumber: initStrOpt,
  city: initStrReq,
  adminAreaLevel1: initStrReq,
  zipCode: initStrReq,
  adminAreaLevel2: initStrOpt,
  country: initStrReq,
  // addressValidationApiResponse: null,
  formattedAddress: initStrOpt,
  geolocation: initGeolocationOpt,
  addressComponents: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initPrivateOwner: T.PrivateOwner = {
  firstName: initStrReq,
  middleName: initStrOpt,
  lastName: initStrReq,
  phoneNumber: initStrReq,
  email: initStrReq,
  provideAddress: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initPriceFeatures: T.Str = {
  value: "",
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initDiscountFeatures: T.Str = {
  value: "",
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: false,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const heatingOptions: T.HeatingOption[] = [
  { id: "firePlace", label: "Fire Place" },
  { id: "propaneWallHeater", label: "Propane Wall Heater" },
  { id: "propaneFurnace", label: "Propane Furnace" },
  { id: "other", label: "Other" },
  null,
];

export const coolingOptions: T.CoolingOption[] = [
  { id: "centralAirConditioning", label: "Central AC" },
  { id: "windMaker500", label: "Wind Maker 500" },
  { id: "other", label: "Other" },
  null,
];

export const waterOptions: T.WaterOption[] = [
  { id: "cityWater", label: "City Water" },
  { id: "well", label: "Well" },
  { id: "catchment", label: "Catchment" },
  { id: "spring", label: "Spring" },
  { id: "other", label: "Other" },
  null,
];

export const powerOptions: T.PowerOption[] = [
  { id: "onGrid", label: "On-Grid" },
  { id: "offGrid", label: "Off-Grid" },
  { id: "gridTie", label: "Grid-Tie" },
  { id: "solar", label: "Solar" },
  { id: "wind", label: "Wind" },
  { id: "hydro", label: "Hydro" },
  { id: "backupGenerator", label: "Backup Generator" },
  { id: "other", label: "Other" },
  null,
];

export const initHeatingReq: T.Heating = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initCoolingReq: T.Cooling = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initWaterReq: T.Water = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initPowerReq: T.Power = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initSingleFamilyHome: T.SingleFamilyHome = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  stories: initStrReq,
  acres: initStrReq,
  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,
  garage: initTypeBoolReqNull,
  furnished: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initMultiFamilyHomeUnit: T.MultiFamilyHomeUnit = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  stories: initStrReq,
  unitsInBuilding: initStrReq,
  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,
  garage: initTypeBoolReqNull,
  furnished: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,
  parkingSpaces: initStrReq,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initMultiFamilyHome: T.MultiFamilyHome = {
  totalUnits: initStrReq,
  yearBuilt: initStrReq,
  stories: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,
  unitsWithGarageSpace: initStrReq,
  fencedYard: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initApartmentBuilding: T.ApartmentBuilding = {
  totalUnits: initStrReq,
  yearBuilt: initStrReq,
  stories: initStrReq,
  squareFeet: initStrReq,
  acres: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initApartment: T.Apartment = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  floorNumber: initStrReq,

  stairAccess: initTypeBoolReqNull,
  elevatorAccess: initTypeBoolReqNull,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  assignedParking: initTypeBoolReqNull,
  numAssignedSpaces: initStrReq,
  numAssignedSpacesWithCover: initStrReq,

  unassignedParkingAvailable: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,

  furnished: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,

  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initCondo: T.Condo = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  floorNumber: initStrReq,

  stairAccess: initTypeBoolReqNull,
  elevatorAccess: initTypeBoolReqNull,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  assignedParking: initTypeBoolReqNull,
  numAssignedSpaces: initStrReq,
  numAssignedSpacesWithCover: initStrReq,

  unassignedParkingAvailable: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,

  furnished: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,

  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initTownhouse: T.Townhouse = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,
  stories: initStrReq,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  garage: initTypeBoolReqNull,

  streetParking: initTypeBoolReqNull,

  furnished: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,

  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initManufacturedHome: T.ManufacturedHome = {
  yearBuilt: initStrReq,
  squareFeet: initStrReq,
  bedrooms: initStrReq,
  fullBathrooms: initStrReq,
  halfBathrooms: initStrReq,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  streetParking: initTypeBoolReqNull,

  furnished: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,

  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initLand: T.Land = {
  acres: initStrReq,
  elevation: initStrReq,
  cityWater: initTypeBoolReqNull,
  citySewer: initTypeBoolReqNull,
  cityPower: initTypeBoolReqNull,
  developedRoads: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initListingKind: T.ListingKind = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  beingVerified: false,
  saved: false,
  readOnly: false,
  required: true,
};

export const allListingTypeValues: T.ListingKindValue[] = [
  { id: "single-family-home", name: "singleFamilyHome", label: "House" },
  {
    id: "multi-family-home",
    name: "multiFamilyHome",
    label: "Multi-Family Home",
  },
  {
    id: "multi-family-home-unit",
    name: "multiFamilyHomeUnit",
    label: "Multi-Family Home Unit",
  },
  {
    id: "apartment-building",
    name: "apartmentBuilding",
    label: "Apartment Building",
  },
  { id: "apartment", name: "apartment", label: "Apartment" },
  { id: "condo", name: "condo", label: "Condo" },
  { id: "townhouse", name: "townhouse", label: "Townhouse" },
  // {
  //   id: "manufactured-home",
  //   name: "manufacturedHome",
  //   label: "Manufactured Home",
  // },
  { id: "land", name: "land", label: "Land" },
  null,
];

export const initForSaleOrRent: T.ForSaleOrRent = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initForSaleBy: T.ForSaleBy = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initForRentBy: T.ForRentBy = {
  value: null,
  numberStr: "",
  number: 0,
  formatted: "",
  shortFormatted: "",
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initTimeStamp: T.TimeStamp = null;

export const initUserRef: T.UserRef = {
  uid: "",
};

export const initBasicInfo: T.BasicInfo = {
  listingKind: initListingKind,
  description: initStrReq,
  forSaleOrRent: initForSaleOrRent,
  price: initStrReq,
  priceChange: initStrOpt,
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initReview: T.Verify = {
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initImage: T.Image = {
  file: undefined,
  name: "",
  url: "",
};

export const initImages: T.Images = {
  value: [],
  valueFromEdit: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initUploads: T.Uploads = {
  images: initImages,
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

/**
 * Listing form before a user has entered or saved any info.
 * Contains only the required props.
 */
export const initListingData: T.ListingData = {
  address: initAddress,
  basicInfo: initBasicInfo,
  uploads: initUploads,
  review: initReview,
  timestamp: initTimeStamp,
  userRef: initUserRef,
};

export const initListingFilters: T.ListingFilters = {
  place: undefined,
  forSaleOrRent: null,
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
  listingKinds: [],
  listedBy: [],
  beds: null,
  baths: null,
};
