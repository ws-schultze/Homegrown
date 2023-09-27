import { createSlice } from "@reduxjs/toolkit";
import { ListingTypeValue } from "../../../../..";
import { allListingTypeValues } from "../../../../../initialValues";

export interface ListingTypeFilterState {
  showMenu: boolean;
  menuItems: ListingTypeValue[];
  selectedItems: ListingTypeValue[];
}

export const initialListingTypeFilterState: ListingTypeFilterState = {
  showMenu: false,
  menuItems: allListingTypeValues,
  selectedItems: [],
};

export const listingTypeFilterSlice = createSlice({
  name: "listingFilter",
  initialState: initialListingTypeFilterState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setSelectedItems: (state, action) => ({
      ...state,
      selectedItems: action.payload,
    }),
  },
});

export const { setShowMenu, setSelectedItems } = listingTypeFilterSlice.actions;

export default listingTypeFilterSlice.reducer;
