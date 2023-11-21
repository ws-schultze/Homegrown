import { useEffect } from "react";
import { FetchedListing } from "../../../../types/index";
import {
  getCurrentFilteredMarkers,
  getCurrentMarkers,
  getMarkerSize,
  getNonCurrentFilteredMarkers,
  hideMarkers,
  showMarkers,
} from "../map/mapHelpers";

export default function useUpdateMarkers(
  map: google.maps.Map | undefined,
  smallMarkers: google.maps.marker.AdvancedMarkerView[],
  largeMarkers: google.maps.marker.AdvancedMarkerView[],
  minZoomForLargeMarkers: number,
  currentFilteredListings: FetchedListing[]
) {
  useEffect(() => {
    function handler() {
      if (map && smallMarkers && largeMarkers) {
        const markerSize = getMarkerSize(map, minZoomForLargeMarkers);
        const currentLargeMarkers = getCurrentMarkers(map, largeMarkers);
        const currentSmallMarkers = getCurrentMarkers(map, smallMarkers);

        // Markers to show
        const currentFilteredSmallMarkers = getCurrentFilteredMarkers(
          currentSmallMarkers,
          currentFilteredListings
        );
        const currentFilteredLargeMarkers = getCurrentFilteredMarkers(
          currentLargeMarkers,
          currentFilteredListings
        );

        // Markers to hide
        const nonCurrentFilteredSmallMarkers = getNonCurrentFilteredMarkers(
          smallMarkers,
          currentFilteredListings
        );
        const nonCurrentFilteredLargeMarkers = getNonCurrentFilteredMarkers(
          largeMarkers,
          currentFilteredListings
        );

        // Hide/Show markers
        if (markerSize === "small") {
          hideMarkers(nonCurrentFilteredSmallMarkers);
          hideMarkers(largeMarkers);
          showMarkers(currentFilteredSmallMarkers, map);
        } else if (markerSize === "large") {
          hideMarkers(nonCurrentFilteredLargeMarkers);
          hideMarkers(smallMarkers);
          showMarkers(currentFilteredLargeMarkers, map);
        }
      } else {
        console.warn("Escaped");
      }
    }
    handler();
  }, [
    map,
    smallMarkers,
    largeMarkers,
    minZoomForLargeMarkers,
    currentFilteredListings,
  ]);
}
