import { createSlice } from "@reduxjs/toolkit";
import { initListingData } from "../../../initialValues";
import { ListingData } from "../../../types";
import { CreateListingPageState } from "../createListingPage/createListingPageSlice";

export interface EditListingPageState extends CreateListingPageState {}

export const initialEditListingPageState: EditListingPageState = {
  userAcknowledged: true,
  listing: initListingData,
  loading: false,
  pageNumbers: [1, 2, 3, 4, 5, 6, 7],
  currentPageNumber: 7,
  savedPages: [2, 3, 4, 5, 6],
  unsavedPages: [],
  editingListing: true,
  newListingInProgress: false,
};

export const editListingPageSlice = createSlice({
  name: "editListingPage",
  initialState: initialEditListingPageState,
  reducers: {
    reset: () => initialEditListingPageState,
    setUserAcknowledged: (
      state,
      action: { payload: boolean; type: string }
    ) => ({
      ...state,
      userAcknowledged: action.payload,
    }),
    // setListingId: (state, action: { payload: string; type: string }) => ({
    //   ...state,
    //   listingId: action.payload,
    // }),
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
      editingListing: action.payload,
    }),
  },
});

export const {
  reset,
  setUserAcknowledged,
  setListing,
  // setListingId,
  setLoading,
  setPageNumbers,
  setCurrentPageNumber,
  setSavedPages,
  setUnsavedPages,
  setEditListing,
} = editListingPageSlice.actions;

export default editListingPageSlice.reducer;
