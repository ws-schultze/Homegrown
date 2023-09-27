import React, { useEffect } from "react";
import { CommonStateStatus } from "../../../../common/commonSlice";
import { TypeFetchedListing } from "../../../..";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { getCurrentListings, getMarkerSize } from "../map/mapHelpers";
import {
  setCurrentFilteredListings,
  setCurrentListings,
  setMapCenter,
  setMapMarkerSize,
  setMapZoom,
} from "../exploreListingsSlice";

/**
 * Handle the map's idle event by setting the some state props in redux:
 * 1) mapZoom
 * 2) mapCenter
 * 3) mapMarkerSize
 * 4) currentListings
 * 5) currentFilteredListings
 */
function useMapIdle(
  map: google.maps.Map | undefined,
  mapId: string,
  status: CommonStateStatus,
  listings: TypeFetchedListing[],
  filteredListings: TypeFetchedListing[],
  minZoomForLargeMarkers: number,
  dispatch: Dispatch<AnyAction>
) {
  useEffect(() => {
    if (status === "idle" && map && listings.length > 0) {
      const idleHandler = map.addListener("idle", () => {
        const mapMarkerSize = getMarkerSize(map!, minZoomForLargeMarkers);

        const currentListings = getCurrentListings(map!, listings);

        const currentFilteredListings = getCurrentListings(
          map!,
          filteredListings
        );

        const mapCenter = {
          lat: map.getCenter()?.lat()!,
          lng: map.getCenter()?.lng()!,
        };

        dispatch(setMapZoom(map.getZoom()!));
        dispatch(setMapCenter(mapCenter));
        dispatch(setMapMarkerSize(mapMarkerSize));
        dispatch(setCurrentListings(currentListings));
        dispatch(setCurrentFilteredListings(currentFilteredListings));
      });

      /**
       * ========== VERY IMPORTANT ==============
       *
       * If idleHandler does not get removed, it will fire multiple times,
       * using old state, and cause current filtered markers to flash instead
       * of not being hidden then shown
       *
       * Do not wrap idleHandler in another function
       */
      return () => google.maps.event.removeListener(idleHandler);
    }
  }, [
    map,
    mapId,
    status,
    listings,
    filteredListings,
    minZoomForLargeMarkers,
    dispatch,
  ]);
}

export default useMapIdle;
