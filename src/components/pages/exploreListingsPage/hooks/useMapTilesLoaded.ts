import { useEffect } from "react";
import css from "../map/styles.module.css";

/**
 * Slowing fade-in the map once all tiles have loaded
 * @param map google.maps.Map | undefined
 * @param mapContainer  HTMLDivElement | undefined
 */
function useMapTilesLoaded(
  map: google.maps.Map | undefined,
  mapContainer: HTMLDivElement | null,
  searchBox: google.maps.places.SearchBox | undefined
) {
  useEffect(() => {
    function handler() {
      if (map) {
        const listener = map.addListener("tilesloaded", () => {
          // Fade in the map
          if (mapContainer) {
            mapContainer.classList.add(css["fade"]);
          }

          // Set searchbox bias to current map bounds
          if (searchBox) {
            searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
          }
        });
        return () => google.maps.event.removeListener(listener);
      }
    }
    handler();
  }, [map, mapContainer, searchBox]);
}

export default useMapTilesLoaded;
