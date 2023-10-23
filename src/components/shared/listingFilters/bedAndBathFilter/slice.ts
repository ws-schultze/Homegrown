import { createSlice } from "@reduxjs/toolkit";

export interface State {
  inUse: boolean;
  showMenu: boolean;
  label: string;
  beds: number | null;
  baths: number | null;
}

export const initialState: State = {
  inUse: false,
  showMenu: false,
  label: "Dropdown",
  beds: null,
  baths: null,
};

export const slice = createSlice({
  /**
   * Be sure to change the name to match the component being made
   */
  name: "bedAndBathFilter",
  initialState: initialState,
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

export const { setShowMenu, setBaths, setBeds } = slice.actions;

export default slice.reducer;
