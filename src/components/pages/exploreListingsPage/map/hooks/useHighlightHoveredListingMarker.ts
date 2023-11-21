import React, { useEffect } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { FetchedListing } from "../../../../../types";
import { MapMarkerSize } from "../../exploreListingsPageSlice";
import clearMarkerContentClassList, {
  highlightMarker,
  moveMarkerContent,
  unhighlightMarker,
} from "../mapHelpers";
import { useScreenSizeContext } from "../../../../../ScreenSizeProvider";

export default function useHighlightHoveredListingMarker(
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  smallMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >,
  largeMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >
) {
  const pageState = useAppSelector((s) => s.exploreListings);
  const hoveredListing = pageState.hoveredListing;
  const screenSize = useScreenSizeContext();

  useEffect(() => {
    /**
      Given a hovered listing (which comes from a hovered listing card), change the bg color
      of that listing's map marker. Color change will happen to either a small marker or large,
      depending on which current map markers are provided
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
          smallMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (mapRef.current) {
                if (screenSize === "desktop") {
                  moveMarkerContent(mapRef.current, marker);
                }
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          smallMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);
            if (screenSize === "desktop") {
              clearMarkerContentClassList(marker);
            }
          });
        }

        // Change large marker bg on hover
      } else if (markerSize === "large") {
        if (hoveredListing) {
          largeMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (mapRef.current) {
                if (screenSize === "desktop") {
                  moveMarkerContent(mapRef.current, marker);
                }
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          largeMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);
            if (screenSize === "desktop") {
              clearMarkerContentClassList(marker);
            }
          });
        }
      } else {
        throw new Error(
          `Invalid marker size: ${pageState.mapMarkerSize}. "Marker size must be "small" or "large".`
        );
      }
    }
    if (mapRef.current && mapRef.current.getProjection()) {
      handleHoveredListing(pageState.hoveredListing, pageState.mapMarkerSize);
    }
  }, [pageState.hoveredListing, pageState.mapMarkerSize]);
}
