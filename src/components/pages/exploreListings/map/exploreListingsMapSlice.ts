import { createSlice } from "@reduxjs/toolkit";
// import { TypeLatLng } from "../../../../index";

// // export type TypeMarkerSize = "large" | "small";

// // interface ExploreListingsMapState {
// //   mapIsLoading: boolean;
// //   mapZoom: number;
// //   mapIsFullScreen: boolean;
// //   mapMarkerSize: TypeMarkerSize;
// //   mapMinZoomForLargeMarkers: number;
// //   mapCenter?: TypeLatLng;
// // }

// // const initialListingsMapState: ExploreListingsMapState = {
// //   mapIsLoading: false,
// //   mapZoom: 10,
// //   mapIsFullScreen: false,
// //   mapMarkerSize: "small",
// //   mapMinZoomForLargeMarkers: 13,
// //   mapCenter: undefined,
// // };

// export const exploreListingsMapSlice = createSlice({
//   name: "listingsMap",
//   initialState: initialListingsMapState,
//   reducers: {
//     setMapIsLoading: (state) => ({
//       ...state,
//       mapIsLoading: !state.mapIsLoading,
//     }),
//     setMapIsFullScreen: (state) => ({
//       ...state,
//       mapIsFullScreen: !state.mapIsFullScreen,
//     }),
//     setMapMarkerSize: (state, action) => ({
//       ...state,
//       mapMarkerSize: action.payload,
//     }),
//     setMapCenter: (state, action: { payload: TypeLatLng; type: string }) => ({
//       ...state,
//       mapCenter: action.payload,
//     }),
//   },
// });

// export const {
//   setMapIsLoading,
//   setMapIsFullScreen,
//   setMapMarkerSize,
//   setMapCenter,
// } = exploreListingsMapSlice.actions;

// export default exploreListingsMapSlice.reducer;
