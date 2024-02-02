import { createSlice } from "@reduxjs/toolkit";
import type { FetchedListing, TypeLatLng } from "../../../types/index";

export type MapMarkerSize = "small" | "large";

export interface ExploreListingsState {
  allFilteredListings: FetchedListing[];
  currentListings: FetchedListing[];
  currentFilteredListings: FetchedListing[];
  listingToOverlay: FetchedListing | undefined;
  showFullListingOverlay: boolean;
  hoveredListing: FetchedListing | undefined;
  mapIsLoading: boolean;
  mapZoom: number;
  mapIsFullScreen: boolean;
  mapMarkerSize: MapMarkerSize;
  mapMinZoomForLargeMarkers: number;
  mapCenter?: TypeLatLng;
  showListView: boolean;
}

export const initialExploreListingsState: ExploreListingsState = {
  allFilteredListings: [],
  currentListings: [],
  currentFilteredListings: [],
  listingToOverlay: undefined,
  showFullListingOverlay: false,
  hoveredListing: undefined,
  mapIsLoading: false,
  mapZoom: 8,
  mapIsFullScreen: false,
  mapMarkerSize: "small",
  mapMinZoomForLargeMarkers: 11,
  mapCenter: { lat: 38.5808, lng: -122.525 },
  showListView: false,
};

export const exploreListingsPageSlice = createSlice({
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
    setListingToOverlay: (
      state,
      action: { payload: FetchedListing | undefined; type: string }
    ) => ({
      ...state,
      listingToOverlay: action.payload,
    }),
    setShowFullOverlay: (state, action) => ({
      ...state,
      showFullListingOverlay: action.payload,
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
    setShowListView: (state, action: { payload: boolean; type: string }) => ({
      ...state,
      showListView: action.payload,
    }),
  },
});

export const {
  setExploreListings,
  setAllFilteredListings,
  setCurrentListings,
  setCurrentFilteredListings,
  setListingToOverlay,
  setShowFullOverlay,
  setHoveredListing,
  setMapIsLoading,
  setMapIsFullScreen,
  setMapMarkerSize,
  setMapCenter,
  setMapZoom,
  setShowListView,
} = exploreListingsPageSlice.actions;

export default exploreListingsPageSlice.reducer;
