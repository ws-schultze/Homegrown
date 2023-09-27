import React, { useEffect } from "react";
import { defineBoundaries, setupBoundaryForPlace } from "../map/mapHelpers";
import { TypeBoundaries } from "../../../..";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

function usePlaceChange(
  map: google.maps.Map,
  mapTypeId: string,
  searchBox: google.maps.places.SearchBox | undefined,
  largeMarkers: google.maps.marker.AdvancedMarkerView[],
  smallMarkers: google.maps.marker.AdvancedMarkerView[],
  boundaries: TypeBoundaries,
  boundaryStyle: google.maps.FeatureStyleOptions,
  dispatch: Dispatch<AnyAction>
) {
  /**
   * Handle place change
   */
  useEffect(
    () => {},
    /**
     * searchBoxRef.current and mapRef.current are needed deps to
     * ensure that boundaries are drawn on the current map with
     * the current searchbox results
     */
    []
  );
}

export default usePlaceChange;
