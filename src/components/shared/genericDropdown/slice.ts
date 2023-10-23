/**
 * 
This slice is to be copied and expanded to fit the needs of whatever menu is being created
 *  
*/

import { createSlice } from "@reduxjs/toolkit";

export interface State {
  inUse: boolean;
  showMenu: boolean;
  label: string;
}

export const initialState: State = {
  inUse: false,
  showMenu: false,
  label: "Dropdown",
};

export const genericDropdownSlice = createSlice({
  name: "genericDropdown",
  initialState: initialState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
    setInUse: (state, action: { payload: boolean; type: string }) => ({
      ...state,
      inUse: action.payload,
    }),
  },
});

export const { setShowMenu } = genericDropdownSlice.actions;

export default genericDropdownSlice.reducer;
