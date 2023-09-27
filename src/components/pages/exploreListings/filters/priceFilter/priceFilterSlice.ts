import { createSlice } from "@reduxjs/toolkit";
import { TypeStr } from "../../../../..";
import { initTypeStrOpt } from "../../../../../initialValues";

export interface PriceFilterState {
  showMenu: boolean;
  lowPrice: TypeStr;
  highPrice: TypeStr;
}

export const initialPriceFilterState: PriceFilterState = {
  showMenu: false,
  lowPrice: initTypeStrOpt,
  highPrice: initTypeStrOpt,
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
        payload: { lowPrice: TypeStr; highPrice: TypeStr };
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
