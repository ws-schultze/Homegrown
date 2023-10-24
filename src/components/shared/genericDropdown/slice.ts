/**
 * 
This slice is to be copied and expanded to fit the needs of whatever menu is being created
 *  
*/

import { createSlice } from "@reduxjs/toolkit";

export interface State {
  showMenu: boolean;
  label: string;
}

export const initialState: State = {
  showMenu: false,
  label: "Dropdown",
};

export const slice = createSlice({
  /**
   * Be sure to change the name to match the component being made
   */
  name: "genericDropdown",
  initialState: initialState,
  reducers: {
    setShowMenu: (state) => ({
      ...state,
      showMenu: !state.showMenu,
    }),
  },
});

export const { setShowMenu } = slice.actions;

export default slice.reducer;
