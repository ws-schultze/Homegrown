import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { FetchedListing, ListingKind, ListingKindValue } from "../types/index";
import fetchListings from "./commonAPI";
import UserAcknowledgementForm from "../components/pages/createListingPage/page1/forms/UserAcknowledgementForm";
import { all } from "axios";
import { allListingKinds } from "../initialValues";

export type CommonStateStatus = "idle" | "loading" | "succeeded" | "failed";

export interface CommonState {
  status: CommonStateStatus;
  error: string | null;
  listings: FetchedListing[];
  userAcknowledgedSiteIsDemo: boolean;
  allListingKinds: ListingKindValue[];
}

export const initialCommonState: CommonState = {
  status: "loading",
  error: null,
  listings: [],
  userAcknowledgedSiteIsDemo: false,
  allListingKinds: allListingKinds,
};

/**
 * https://github.com/reduxjs/redux-templates/blob/master/packages/cra-template-redux-typescript/template/src/features/counter/counterSlice.ts
 */
export const fetchListingsAsync = createAsyncThunk(
  "exploreListings/fetchListings",
  async () => {
    const listings = await fetchListings();
    return listings;
  }
);

export const commonSlice = createSlice({
  name: "commonState",
  initialState: initialCommonState,
  reducers: {
    setCommonListings: (
      state,
      action: { payload: FetchedListing[]; type: string }
    ) => ({
      ...state,
      listings: action.payload,
    }),
    setUserAcknowledgedSiteIsDemo: (
      state,
      action: { payload: boolean; type: string }
    ) => ({
      ...state,
      userAcknowledgedSiteIsDemo: action.payload,
    }),
  },

  //https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer
  extraReducers: (builder: ActionReducerMapBuilder<CommonState>) => {
    builder
      .addCase(fetchListingsAsync.pending, (state) => {
        return {
          ...state,
          status: "loading",
        };
      })
      .addCase(fetchListingsAsync.fulfilled, (state, action) => {
        return {
          ...state,
          status: "idle",
          listings: action.payload,
        };
      })
      .addCase(fetchListingsAsync.rejected, (state) => {
        return {
          ...state,
          status: "failed",
        };
      });
  },
});

export const { setCommonListings, setUserAcknowledgedSiteIsDemo } =
  commonSlice.actions;
export default commonSlice.reducer;
