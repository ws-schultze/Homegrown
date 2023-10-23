import { createSlice } from "@reduxjs/toolkit";
import { ForSaleOrRentValue } from "../../../../types";
import { allForSaleOrRentValues } from "../../../../initialValues";

export interface State {
  inUse: boolean;
  showMenu: boolean;
  label: string;
  menuItems: ForSaleOrRentValue[];
  selectedItem: ForSaleOrRentValue;
}

export const initialState: State = {
  inUse: false,
  showMenu: false,
  label: "Dropdown",
  menuItems: allForSaleOrRentValues,
  selectedItem: null,
};

export const slice = createSlice({
  name: "forSaleOrRent",
  initialState: initialState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setForSaleOrRent: (
      state,
      action: { payload: ForSaleOrRentValue; type: string }
    ) => ({
      ...state,
      selectedItem: action.payload,
    }),
  },
});

export const { setShowMenu, setForSaleOrRent } = slice.actions;

export default slice.reducer;
