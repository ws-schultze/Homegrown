import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface PlaceFilterState {
  /**
   * If place is defined, is is a stringified version
   * of google.maps.places.PlaceResult
   */
  place: string | undefined;
}

export const initialPlaceFilterState: PlaceFilterState = {
  place: undefined,
};

// const fetchPlace = createAsyncThunk("placeFilter/fetchPlace", async () => {});

const placeFilterSlice = createSlice({
  name: "placeFilter",
  initialState: initialPlaceFilterState,
  reducers: {
    setPlace: (state, action) => ({
      ...state,
      place: action.payload,
    }),
  },
});

export const { setPlace } = placeFilterSlice.actions;

export default placeFilterSlice.reducer;
