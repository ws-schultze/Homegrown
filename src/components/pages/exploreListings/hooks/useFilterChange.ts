import { Dispatch, useEffect } from "react";
import {
  ListingTypeValue,
  TypeBoundaries,
  TypeFetchedListing,
  TypeForSaleOrRentValue,
  TypeStr,
} from "../../../..";
import { AnyAction } from "@reduxjs/toolkit";
import {
  filterListings,
  getCurrentListings,
  updateMarkers,
} from "../map/mapHelpers";
import {
  setAllFilteredListings,
  setCurrentFilteredListings,
} from "../exploreListingsSlice";

interface PropTypes {
  map: google.maps.Map;
  smallMarkers: google.maps.marker.AdvancedMarkerView[];
  largeMarkers: google.maps.marker.AdvancedMarkerView[];
  place: string | undefined;
  boundaries: TypeBoundaries;
  forSaleOrRent: TypeForSaleOrRentValue;
  lowPrice: TypeStr;
  highPrice: TypeStr;
  listingTypes: ListingTypeValue[];
  baths: number | null;
  beds: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  mapMinZoomForLargeMarkers: number;
  listings: TypeFetchedListing[];
  currentMapId: string;
  dispatch: Dispatch<AnyAction>;
}
/**
 * When a filter changes, update allFilteredListings and currentFilteredListings to pageState in redux
 */
function useFilterChange(
  map: google.maps.Map | undefined,
  place: string | undefined,
  forSaleOrRent: TypeForSaleOrRentValue,
  lowPrice: TypeStr,
  highPrice: TypeStr,
  listingTypes: ListingTypeValue[],
  baths: number | null,
  beds: number | null,
  status: "idle" | "loading" | "succeeded" | "failed",
  listings: TypeFetchedListing[],
  dispatch: Dispatch<AnyAction>
) {
  useEffect(() => {
    function handler() {
      console.log("useFilterChange working...");
      if (status === "idle" && map && map.getBounds() && listings.length > 0) {
        const allFilteredListings = filterListings(listings, {
          place: place ? JSON.parse(place) : undefined,
          forSaleOrRent: forSaleOrRent,
          lowPrice: lowPrice,
          highPrice: highPrice,
          listingTypes: listingTypes,
          beds: beds,
          baths: baths,
        });

        const currentFilteredListings = getCurrentListings(
          map,
          allFilteredListings
        );

        dispatch(setAllFilteredListings(allFilteredListings));
        dispatch(setCurrentFilteredListings(currentFilteredListings));
      }
    }
    handler();
  }, [
    map,
    place,
    forSaleOrRent,
    lowPrice,
    highPrice,
    listingTypes,
    baths,
    beds,
    status,
    listings,
    dispatch,
  ]);
}

export default useFilterChange;
