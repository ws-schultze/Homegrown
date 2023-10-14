import { createSlice } from "@reduxjs/toolkit";
import type { FetchedListing, TypeLatLng } from "../../../types/index";

export type MapMarkerSize = "small" | "large";

export interface ExploreListingsState {
  allFilteredListings: FetchedListing[];
  currentListings: FetchedListing[];
  currentFilteredListings: FetchedListing[];
  listingToOverlay: FetchedListing | undefined;
  hoveredListing: FetchedListing | undefined;
  mapIsLoading: boolean;
  mapZoom: number;
  mapIsFullScreen: boolean;
  mapMarkerSize: MapMarkerSize;
  mapMinZoomForLargeMarkers: number;
  mapCenter?: TypeLatLng;
}

export const initialExploreListingsState: ExploreListingsState = {
  allFilteredListings: [],
  currentListings: [],
  currentFilteredListings: [],
  listingToOverlay: undefined,
  hoveredListing: undefined,
  mapIsLoading: false,
  mapZoom: 10,
  mapIsFullScreen: false,
  mapMarkerSize: "small",
  mapMinZoomForLargeMarkers: 13,
  mapCenter: undefined,
};

export const exploreListingsSlice = createSlice({
  name: "exploreListings",
  initialState: initialExploreListingsState,
  reducers: {
    setExploreListings: (
      state,
      action: { payload: ExploreListingsState; type: string }
    ) => ({
      ...action.payload,
    }),
    setAllFilteredListings: (
      state,
      action: { payload: FetchedListing[]; type: string }
    ) => ({
      ...state,
      allFilteredListings: action.payload,
    }),
    setCurrentListings: (state, action) => ({
      ...state,
      currentListings: action.payload,
    }),
    setCurrentFilteredListings: (
      state,
      action: { payload: FetchedListing[]; type: string }
    ) => ({
      ...state,
      currentFilteredListings: action.payload,
    }),
    setFilteredListings: (state, action) => ({
      ...state,
      filteredListings: action.payload,
    }),
    setListingToOverlay: (state, action) => ({
      ...state,
      listingToOverlay: action.payload,
    }),
    setHoveredListing: (
      state,
      action: { payload: FetchedListing | undefined; type: string }
    ) => ({
      ...state,
      hoveredListing: action.payload,
    }),
    setMapIsLoading: (state) => ({
      ...state,
      mapIsLoading: !state.mapIsLoading,
    }),
    setMapIsFullScreen: (state) => ({
      ...state,
      mapIsFullScreen: !state.mapIsFullScreen,
    }),
    setMapMarkerSize: (state, action) => ({
      ...state,
      mapMarkerSize: action.payload,
    }),
    setMapCenter: (state, action: { payload: TypeLatLng; type: string }) => ({
      ...state,
      mapCenter: action.payload,
    }),
    setMapZoom: (state, action: { payload: number; type: string }) => ({
      ...state,
      mapZoom: action.payload,
    }),
  },
});

export const {
  setExploreListings,
  setAllFilteredListings,
  setCurrentListings,
  setCurrentFilteredListings,
  setListingToOverlay,
  setHoveredListing,
  setMapIsLoading,
  setMapIsFullScreen,
  setMapMarkerSize,
  setMapCenter,
  setMapZoom,
} = exploreListingsSlice.actions;

export default exploreListingsSlice.reducer;
