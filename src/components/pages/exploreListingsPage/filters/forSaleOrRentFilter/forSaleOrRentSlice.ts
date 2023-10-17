import { createSlice } from "@reduxjs/toolkit";
import { ForSaleOrRentValue } from "../../../../../types/index";
import { allForSaleOrRentValues } from "../../../../../initialValues";

export interface ForSaleOrRentFilterState {
  showMenu: boolean;
  menuItems: ForSaleOrRentValue[];
  selectedItem: ForSaleOrRentValue;
}

export const initialForSaleOrRentFilterState: ForSaleOrRentFilterState = {
  showMenu: false,
  menuItems: allForSaleOrRentValues,
  selectedItem: null,
};

export const forSaleOrRentFilterSlice = createSlice({
  name: "forSaleOrRentFilter",
  initialState: initialForSaleOrRentFilterState,
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

export const { setShowMenu, setForSaleOrRent } =
  forSaleOrRentFilterSlice.actions;

export default forSaleOrRentFilterSlice.reducer;
