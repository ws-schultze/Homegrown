import { createSlice } from "@reduxjs/toolkit";
import { Str } from "../../../../../types/index";
import { initStrOpt } from "../../../../../initialValues";

export interface PriceFilterState {
  showMenu: boolean;
  lowPrice: Str;
  highPrice: Str;
}

export const initialPriceFilterState: PriceFilterState = {
  showMenu: false,
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export const priceFilterSlice = createSlice({
  name: "priceFilter",
  initialState: initialPriceFilterState,
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

export const { setShowMenu, setLowPrice, setHighPrice, setPriceRange } =
  priceFilterSlice.actions;

export default priceFilterSlice.reducer;
