import { createSlice } from "@reduxjs/toolkit";

export interface BedAndBathFilterState {
  showMenu: boolean;
  beds: number | null;
  baths: number | null;
}

export const initialBedAndBathFilterState: BedAndBathFilterState = {
  showMenu: false,
  beds: null,
  baths: null,
};

export const bedAndBathFilterSlice = createSlice({
  name: "bedAndBathFilter",
  initialState: initialBedAndBathFilterState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setBeds: (state, action) => ({
      ...state,
      beds: action.payload,
    }),
    setBaths: (state, action) => ({
      ...state,
      baths: action.payload,
    }),
  },
});

export const { setShowMenu, setBeds, setBaths } = bedAndBathFilterSlice.actions;

export default bedAndBathFilterSlice.reducer;
