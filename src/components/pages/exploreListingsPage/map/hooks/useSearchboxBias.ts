import React, { useEffect } from "react";

/**
 * Bias the searchBox to map's current bounds
 */
export default function useSearchboxBias(
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  searchBoxRef: React.MutableRefObject<google.maps.places.SearchBox | undefined>
) {
  useEffect(
    () => {
      if (mapRef.current) {
        // Make searchbox biased to current map bounds
        const searchBoxBias = mapRef.current.addListener("tilesloaded", () => {
          if (searchBoxRef.current) {
            searchBoxRef.current!.setBounds(
              mapRef.current!.getBounds() as google.maps.LatLngBounds
            );
          }
        });
        return () => google.maps.event.removeListener(searchBoxBias);
      }
    },
    /**
     * searchBoxRef.current and mapRef.current are needed deps to
     * ensure that boundaries are drawn on the current map with
     * the current searchbox results
     */
    // eslint-disable-next-line
    [searchBoxRef.current, mapRef.current]
  );
}
