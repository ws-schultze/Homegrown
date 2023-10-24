/**
 * 
This slice is to be copied and expanded to fit the needs of whatever menu is being created
 *  
*/

import { createSlice } from "@reduxjs/toolkit";
import { ListingKindValue } from "../../../../types";
import { allListingTypeValues } from "../../../../initialValues";

export interface State {
  showMenu: boolean;
  label: string;
  types: ListingKindValue[];
  selectedTypes: ListingKindValue[];
}

export const initialState: State = {
  showMenu: false,
  label: "Dropdown",
  types: allListingTypeValues,
  selectedTypes: [],
};

export const slice = createSlice({
  name: "listingTypeFilter",
  initialState: initialState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setSelectedTypes: (
      state,
      action: { payload: ListingKindValue[]; type: string }
    ) => ({
      ...state,
      selectedTypes: action.payload,
    }),
  },
});

export const { setShowMenu, setSelectedTypes } = slice.actions;

export default slice.reducer;
