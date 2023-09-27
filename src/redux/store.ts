import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import commonReducer, { initialCommonState } from "../common/commonSlice";
import exploreListingsReducer, {
  initialExploreListingsState,
} from "../components/pages/exploreListings/exploreListingsSlice";
import forSaleOrRentReducer from "../components/pages/exploreListings/filters/forSaleOrRentFilter/forSaleOrRentSlice";
import priceFilterReducer, {
  initialPriceFilterState,
} from "../components/pages/exploreListings/filters/priceFilter/priceFilterSlice";
import listingTypeFilterReducer from "../components/pages/exploreListings/filters/listingTypeFilter/listingTypeFilterSlice";
import bedAndBathFilterReducer from "../components/pages/exploreListings/filters/bedAndBathFilter/bedAndBathFilterSlice";
import placeFilterReducer, {
  initialPlaceFilterState,
} from "../components/pages/exploreListings/filters/placeFilter/placeFilterSlice";
import { initialForSaleOrRentFilterState } from "../components/pages/exploreListings/filters/forSaleOrRentFilter/forSaleOrRentSlice";
import { initialListingTypeFilterState } from "../components/pages/exploreListings/filters/listingTypeFilter/listingTypeFilterSlice";
import { initialBedAndBathFilterState } from "../components/pages/exploreListings/filters/bedAndBathFilter/bedAndBathFilterSlice";
import mapTypeMenuReducer, {
  initialMapTypeMenuState,
} from "../components/common/mapTypeMenu/mapTypeMenuSlice";

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
};

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// https://github.com/reduxjs/redux-templates/blob/master/packages/cra-template-redux-typescript/template/src/app/store.ts
