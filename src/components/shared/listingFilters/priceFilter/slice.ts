import { createSlice } from "@reduxjs/toolkit";
import { Str } from "../../../../types";
import { initStrOpt } from "../../../../initialValues";

export interface State {
  showMenu: boolean;
  label: string;
  lowPrice: Str;
  highPrice: Str;
}

export const initialState: State = {
  showMenu: false,
  label: "Price Range",
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export const slice = createSlice({
  name: "priceFilter",
  initialState: initialState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setLowPrice: (state, action) => ({
      ...state,
      lowPrice: action.payload,
    }),
    setHighPrice: (state, action) => ({
      ...state,
      highPrice: action.payload,
    }),
    setPriceRange: (
      state,
      action: {
        payload: { lowPrice: Str; highPrice: Str };
        type: string;
      }
    ) => ({
      ...state,
      lowPrice: action.payload.lowPrice,
      highPrice: action.payload.highPrice,
    }),
  },
});

export const { setShowMenu, setPriceRange } = slice.actions;

export default slice.reducer;
