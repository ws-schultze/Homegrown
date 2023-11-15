import { createSlice } from "@reduxjs/toolkit";
import { initListingData } from "../../../initialValues";
import { ListingData } from "../../../types";

export interface CreateListingPageState {
  userAcknowledged: boolean;
  listing: ListingData;
  loading: boolean;
  pageNumbers: number[];
  currentPageNumber: number;
  savedPages: number[];
  unsavedPages: number[];
  editListing: boolean;
  newListingInProgress: boolean;
}

export const initialCreateListingPageState: CreateListingPageState = {
  userAcknowledged: false,
  listing: initListingData,
  loading: false,
  pageNumbers: [1, 2, 3, 4, 5, 6, 7],
  currentPageNumber: 1,
  savedPages: [],
  /**
   * The first and last page of the form are not "savable".
   * The first page is for setting the user acknowledgment to true
   * The last page is for submitting the data to firestore
   */
  unsavedPages: [2, 3, 4, 5, 6],
  editListing: false,
  newListingInProgress: false,
};

export const createListingPageSlice = createSlice({
  name: "createListingPage",
  initialState: initialCreateListingPageState,
  reducers: {
    reset: () => initialCreateListingPageState,
    setUserAcknowledged: (
      state,
      action: { payload: boolean; type: string }
    ) => ({
      ...state,
      userAcknowledged: action.payload,
    }),
    setListing: (state, action: { payload: ListingData; type: string }) => ({
      ...state,
      listing: action.payload,
    }),
    setLoading: (state, action: { payload: boolean; type: string }) => ({
      ...state,
      loading: action.payload,
    }),
    setPageNumbers: (state, action: { payload: number[]; type: string }) => ({
      ...state,
      pageNumbers: action.payload,
    }),
    setCurrentPageNumber: (
      state,
      action: { payload: number; type: string }
    ) => ({
      ...state,
      currentPageNumber: action.payload,
    }),
    // setCurrentPageName: (state, action: { payload: string; type: string }) => ({
    //   ...state,
    //   currentPageName: action.payload,
    // }),
    setSavedPages: (state, action: { payload: number[]; type: string }) => ({
      ...state,
      savedPages: action.payload,
    }),
    setUnsavedPages: (state, action: { payload: number[]; type: string }) => ({
      ...state,
      unsavedPages: action.payload,
    }),
    setEditListing: (state, action: { payload: boolean; type: string }) => ({
      ...state,
      editListing: action.payload,
    }),
    setNewListingInProgress: (
      state,
      action: { payload: boolean; type: string }
    ) => ({
      ...state,
      newListingInProgress: action.payload,
    }),
  },
});

export const {
  reset,
  setUserAcknowledged,
  setListing,
  setLoading,
  setPageNumbers,
  setCurrentPageNumber,
  // setCurrentPageName,
  setSavedPages,
  setUnsavedPages,
  setEditListing,
  setNewListingInProgress,
} = createListingPageSlice.actions;

export default createListingPageSlice.reducer;
