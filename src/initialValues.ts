import {
  TypeApartment,
  TypeBasicInfo,
  TypeForSaleOrRentValue,
  TypeImages,
  TypeListingData,
  TypeListingFilters,
  TypeMultiFamilyHomeUnit,
  TypePlacesApi_Response_AddressComponent,
  TypeUploads,
  TypeUserRef,
  TypeVerify,
} from ".";
import {
  TypeWaterOption,
  TypePowerOption,
  TypePower,
  TypeBool,
  TypeForSaleOrRent,
  TypeForSaleBy,
  TypeForRentBy,
} from "./index";
import {
  TypeMultiFamilyHome,
  TypeCondo,
  TypeTownhouse,
  TypeManufacturedHome,
  TypeWater,
  TypeTimeStamp,
} from "./index";
import {
  TypeAddress,
  TypeAgent,
  TypeSingleFamilyHome,
  ListingTypeValue,
} from "./index";
import {
  TypeApartmentBuilding,
  TypeImage,
  TypeLand,
  TypeHeating,
  TypeCooling,
  TypeListingKind,
  TypeCoolingOption,
  TypeHeatingOption,
} from "./index";
import {
  TypeOwner,
  TypeCompany,
  TypePrivateOwner,
  TypeName,
  TypeStr,
  TypeGeolocation,
} from "./index";

export const allForSaleOrRentValues: TypeForSaleOrRentValue[] = [
  { id: "for-sale", label: "For Sale" },
  { id: "for-rent", label: "For Rent" },
  { id: "for-sale-or-rent", label: "For Sale or Rent" },
  null,
];

export const listingKindValuesForSale: ListingTypeValue[] = [
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
  // { id: "condo", name: "condo", label: "Condo" },
  // { id: "townhouse", name: "townhouse", label: "Townhouse" },
  // { id: "manufactured-home", name: "manufacturedHome", label: "Manufactured Home" },
  // { id: "land", name: "land", label: "Land" },
];

export const listingKindValuesForRent: ListingTypeValue[] = [
  { id: "single-family-home", name: "singleFamilyHome", label: "House" },
  {
    id: "multi-family-home-unit",
    name: "multiFamilyHomeUnit",
    label: "Multi-Family Home Unit",
  },
  { id: "apartment", name: "apartment", label: "Apartment" },

  // { id: "condo", name: "condo", label: "Condo" },
  // { id: "townhouse", name: "townhouse", label: "Townhouse" },
  // { id: "apartment", name: "apartment", label: "Apartment" },
  // { id: "manufactured-home", name: "manufacturedHome", label: "Manufactured Home" },
  // { id: "land", name: "land", label: "Land" },
];

export const initTypeBoolReqNull: TypeBool = {
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

export const initTypeBoolReqTrue: TypeBool = {
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

export const initTypeBoolReqFalse: TypeBool = {
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

export const initTypeBoolOptNull: TypeBool = {
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

export const initTypeBoolOptTrue: TypeBool = {
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

export const initTypeBoolOptFalse: TypeBool = {
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

export const initTypeStrReq: TypeStr = {
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

export const initTypeStrOpt: TypeStr = {
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

export const initGeolocationOpt: TypeGeolocation = {
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

export const initAddressComponent: TypePlacesApi_Response_AddressComponent = {
  long_name: "",
  short_name: "",
  types: [],
};

export const initAddress: TypeAddress = {
  streetAddress: initTypeStrReq,
  unitNumber: initTypeStrOpt,
  city: initTypeStrReq,
  adminAreaLevel1: initTypeStrReq,
  zipCode: initTypeStrReq,
  adminAreaLevel2: initTypeStrOpt,
  country: initTypeStrReq,
  formattedAddress: initTypeStrOpt,
  geolocation: initGeolocationOpt,
  address_components: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: true,
};

export const initName: TypeName = {
  firstName: initTypeStrReq,
  middleName: initTypeStrOpt,
  lastName: initTypeStrReq,
};

export const initAgent: TypeAgent = {
  firstName: initTypeStrReq,
  middleName: initTypeStrOpt,
  lastName: initTypeStrReq,
  licenseId: initTypeStrReq,
  companyName: initTypeStrReq,
  phoneNumber: initTypeStrReq,
  email: initTypeStrReq,
  streetAddress: initTypeStrReq,
  unitNumber: initTypeStrOpt,
  city: initTypeStrReq,
  adminAreaLevel1: initTypeStrReq,
  zipCode: initTypeStrReq,
  adminAreaLevel2: initTypeStrOpt,
  country: initTypeStrReq,
  // addressValidationApiResponse: null,
  formattedAddress: initTypeStrOpt,
  geolocation: initGeolocationOpt,
  address_components: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initOwner: TypeOwner = {
  firstName: initTypeStrReq,
  middleName: initTypeStrOpt,
  lastName: initTypeStrReq,
  phoneNumber: initTypeStrReq,
  email: initTypeStrReq,
  provideAddress: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initCompany: TypeCompany = {
  name: initTypeStrReq,
  phoneNumber: initTypeStrReq,
  email: initTypeStrReq,
  streetAddress: initTypeStrReq,
  unitNumber: initTypeStrOpt,
  city: initTypeStrReq,
  adminAreaLevel1: initTypeStrReq,
  zipCode: initTypeStrReq,
  adminAreaLevel2: initTypeStrOpt,
  country: initTypeStrReq,
  // addressValidationApiResponse: null,
  formattedAddress: initTypeStrOpt,
  geolocation: initGeolocationOpt,
  address_components: [],
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initPrivateOwner: TypePrivateOwner = {
  firstName: initTypeStrReq,
  middleName: initTypeStrOpt,
  lastName: initTypeStrReq,
  phoneNumber: initTypeStrReq,
  email: initTypeStrReq,
  provideAddress: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initPriceFeatures: TypeStr = {
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

export const initDiscountFeatures: TypeStr = {
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

export const heatingOptions: TypeHeatingOption[] = [
  { id: "firePlace", label: "Fire Place" },
  { id: "propaneWallHeater", label: "Propane Wall Heater" },
  { id: "propaneFurnace", label: "Propane Furnace" },
  { id: "other", label: "Other" },
  null,
];

export const coolingOptions: TypeCoolingOption[] = [
  { id: "centralAirConditioning", label: "Central AC" },
  { id: "windMaker500", label: "Wind Maker 500" },
  { id: "other", label: "Other" },
  null,
];

export const waterOptions: TypeWaterOption[] = [
  { id: "cityWater", label: "City Water" },
  { id: "well", label: "Well" },
  { id: "catchment", label: "Catchment" },
  { id: "spring", label: "Spring" },
  { id: "other", label: "Other" },
  null,
];

export const powerOptions: TypePowerOption[] = [
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

export const initHeatingReq: TypeHeating = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initCoolingReq: TypeCooling = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initWaterReq: TypeWater = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initPowerReq: TypePower = {
  value: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initSingleFamilyHome: TypeSingleFamilyHome = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,
  stories: initTypeStrReq,
  acres: initTypeStrReq,
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

export const initMultiFamilyHomeUnit: TypeMultiFamilyHomeUnit = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,
  stories: initTypeStrReq,
  unitsInBuilding: initTypeStrReq,
  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,
  garage: initTypeBoolReqNull,
  furnished: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,
  fencedYard: initTypeBoolReqNull,
  sharedYard: initTypeBoolReqNull,
  parkingSpaces: initTypeStrReq,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initMultiFamilyHome: TypeMultiFamilyHome = {
  totalUnits: initTypeStrReq,
  yearBuilt: initTypeStrReq,
  stories: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,
  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,
  unitsWithGarageSpace: initTypeStrReq,
  fencedYard: initTypeBoolReqNull,
  streetParking: initTypeBoolReqNull,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initApartmentBuilding: TypeApartmentBuilding = {
  totalUnits: initTypeStrReq,
  yearBuilt: initTypeStrReq,
  stories: initTypeStrReq,
  squareFeet: initTypeStrReq,
  acres: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,

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

export const initApartment: TypeApartment = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,
  floorNumber: initTypeStrReq,

  stairAccess: initTypeBoolReqNull,
  elevatorAccess: initTypeBoolReqNull,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  assignedParking: initTypeBoolReqNull,
  numAssignedSpaces: initTypeStrReq,
  numAssignedSpacesWithCover: initTypeStrReq,

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

export const initCondo: TypeCondo = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,
  floorNumber: initTypeStrReq,

  stairAccess: initTypeBoolReqNull,
  elevatorAccess: initTypeBoolReqNull,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  assignedParking: initTypeBoolReqNull,
  numAssignedSpaces: initTypeStrReq,
  numAssignedSpacesWithCover: initTypeStrReq,

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

export const initTownhouse: TypeTownhouse = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,

  heating: initHeatingReq,
  cooling: initCoolingReq,
  water: initWaterReq,
  power: initPowerReq,

  assignedParking: initTypeBoolReqNull,
  numAssignedSpaces: initTypeStrReq,
  numAssignedSpacesWithCover: initTypeStrReq,

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

export const initManufacturedHome: TypeManufacturedHome = {
  yearBuilt: initTypeStrReq,
  squareFeet: initTypeStrReq,
  bedrooms: initTypeStrReq,
  fullBathrooms: initTypeStrReq,
  halfBathrooms: initTypeStrReq,

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

export const initLand: TypeLand = {
  acres: null,
  cityWater: null,
  onGrid: null,
  roads: null,
  price: true,
  priceChangeActive: null,
  beingVerified: false,
  valid: false,
  saved: false,
  readOnly: false,
  errorMsg: "",
  required: false,
};

export const initListingKind: TypeListingKind = {
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

export const allListingTypeValues: ListingTypeValue[] = [
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
  {
    id: "manufactured-home",
    name: "manufacturedHome",
    label: "Manufactured Home",
  },
  { id: "land", name: "land", label: "Land" },
  null,
];

export const initForSaleOrRent: TypeForSaleOrRent = {
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

export const initForSaleBy: TypeForSaleBy = {
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

export const initForRentBy: TypeForRentBy = {
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

export const initTimeStamp: TypeTimeStamp = null;

export const initUserRef: TypeUserRef = {
  uid: "",
};

export const initBasicInfo: TypeBasicInfo = {
  listingKind: initListingKind,
  description: initTypeStrReq,
  forSaleOrRent: initForSaleOrRent,
  price: initTypeStrReq,
  priceChange: initTypeStrOpt,
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initReview: TypeVerify = {
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initImage: TypeImage = {
  file: undefined,
  name: "",
  url: "",
};

export const initImages: TypeImages = {
  value: [],
  valueFromEdit: [],
  valid: false,
  errorMsg: "",
  required: true,
  beingVerified: false,
  saved: false,
  readOnly: false,
};

export const initUploads: TypeUploads = {
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
export const initListingData: TypeListingData = {
  page: 1,
  savedPages: [],
  userAcknowledged: false,
  address: initAddress,
  basicInfo: initBasicInfo,
  uploads: initUploads,
  review: initReview,
  timestamp: initTimeStamp,
  userRef: initUserRef,
};

export const initListingFilters: TypeListingFilters = {
  place: undefined,
  forSaleOrRent: null,
  lowPrice: initTypeStrOpt,
  highPrice: initTypeStrOpt,
  listingKinds: [],
  listedBy: [],
  beds: null,
  baths: null,
};
