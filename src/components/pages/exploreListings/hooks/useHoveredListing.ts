import React, { useEffect } from "react";
import { FetchedListing } from "../../../../types/index";
import { MapMarkerSize } from "../exploreListingsSlice";
import clearMarkerContentClassList, {
  highlightMarker,
  moveMarkerContent,
  unhighlightMarker,
} from "../map/mapHelpers";

function useHoveredListing(
  map: google.maps.Map | undefined,
  smallMarkers: google.maps.marker.AdvancedMarkerView[],
  largeMarkers: google.maps.marker.AdvancedMarkerView[],
  mapMarkerSize: MapMarkerSize,
  hoveredListing: FetchedListing | undefined
) {
  useEffect(() => {
    /**
     * Given a hovered listing (which comes from a hovered listing card), change the bg color
     * of that listing's map marker. Color change will happen to either a small marker or large,
     * depending on which current map markers are provided
     * @param hoveredListing FetchedListing | null
     * @param markers google.maps.marker.AdvancedMarkerView[]
     */
    function handleHoveredListing(
      hoveredListing: FetchedListing | undefined,
      markerSize: MapMarkerSize
    ) {
      // Change small marker bg on hover
      if (markerSize === "small") {
        if (hoveredListing) {
          smallMarkers.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (map) {
                moveMarkerContent(map, marker);
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          smallMarkers.forEach((marker) => {
            unhighlightMarker(marker);
            clearMarkerContentClassList(marker);
          });
        }

        // Change large marker bg on hover
      } else if (markerSize === "large") {
        if (hoveredListing) {
          largeMarkers.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (map) {
                moveMarkerContent(map, marker);
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          largeMarkers.forEach((marker) => {
            unhighlightMarker(marker);
            clearMarkerContentClassList(marker);
          });
        }
      } else {
        throw new Error(
          `Invalid marker size: ${mapMarkerSize}. "Marker size must be "small" or "large".`
        );
      }
    }
    if (map && map.getProjection()) {
      handleHoveredListing(hoveredListing, mapMarkerSize);
    }
  }, [hoveredListing, mapMarkerSize, map, largeMarkers, smallMarkers]);
}

export default useHoveredListing;
