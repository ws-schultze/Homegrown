import { createSlice } from "@reduxjs/toolkit";

export type MapType =
  | "roadmap"
  | "satellite"
  | "hybrid"
  | "terrain"
  | "stylish";

export interface MapTypeMenuState {
  showMenu: boolean;
  menuItems: MapType[];
  selectedItem: MapType;
}

export const initialMapTypeMenuState: MapTypeMenuState = {
  showMenu: false,
  menuItems: ["roadmap", "hybrid", "terrain"],
  selectedItem: "roadmap",
};

export const mapTypeMenuSlice = createSlice({
  name: "mapTypeMenuSlice",
  initialState: initialMapTypeMenuState,
  reducers: {
    setShowMapTypeMenu: (
      state
      //   action: { payload: boolean; type: string }
    ) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setMapType: (state, action: { payload: MapType; type: string }) => ({
      ...state,
      selectedItem: action.payload,
    }),
  },
});

export const { setShowMapTypeMenu, setMapType } = mapTypeMenuSlice.actions;

export default mapTypeMenuSlice.reducer;
