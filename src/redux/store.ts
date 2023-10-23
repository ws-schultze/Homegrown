import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import commonReducer, { initialCommonState } from "../common/commonSlice";

import exploreListingsReducer, {
  initialExploreListingsState,
} from "../components/pages/exploreListingsPage/exploreListingsPageSlice";

import forSaleOrRentReducer, {
  initialState as initialForSaleOrRentFilterState,
} from "../components/shared/listingFilters/forSaleOrRentFilter/slice";

import priceFilterReducer, {
  initialState as initialPriceFilterState,
} from "../components/shared/listingFilters/priceFilter/slice";

import listingTypeFilterReducer, {
  initialState as initialListingTypeFilterState,
} from "../components/shared/listingFilters/listingTypeFilter/slice";

import placeFilterReducer, {
  initialPlaceFilterState,
} from "../components/shared/listingFilters/absoluteDropdowns/placeFilter/placeFilterSlice";

import bedAndBathFilterReducer, {
  initialState as initialBedAndBathFilterState,
} from "../components/shared/listingFilters/bedAndBathFilter/slice";

import mapTypeMenuReducer, {
  initialMapTypeMenuState,
} from "../components/shared/mapTypeMenu/mapTypeMenuSlice";

import genericDropdownReducer, {
  initialState as initialGenericDropdownState,
} from "../components/shared/genericDropdown/slice";

import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    exploreListings: exploreListingsReducer,
    placeFilter: placeFilterReducer,
    forSaleOrRentFilter: forSaleOrRentReducer,
    priceFilter: priceFilterReducer,
    listingTypeFilter: listingTypeFilterReducer,
    bedAndBathFilter: bedAndBathFilterReducer,
    mapTypeMenu: mapTypeMenuReducer,
    genericDropdown: genericDropdownReducer,
  },
  // hydrate the state on page load
  preloadedState: loadFromLocalStorage(),
});

// listen for store changes and use saveToLocalStorage to
// save them to localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;

export const initialRootState: RootState = {
  common: initialCommonState,
  exploreListings: initialExploreListingsState,
  placeFilter: initialPlaceFilterState,
  forSaleOrRentFilter: initialForSaleOrRentFilterState,
  priceFilter: initialPriceFilterState,
  listingTypeFilter: initialListingTypeFilterState,
  bedAndBathFilter: initialBedAndBathFilterState,
  mapTypeMenu: initialMapTypeMenuState,
  genericDropdown: initialGenericDropdownState,
};

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// https://github.com/reduxjs/redux-templates/blob/master/packages/cra-template-redux-typescript/template/src/app/store.ts
