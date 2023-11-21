import React, { useEffect } from "react";
import styles from "../exploreListingsMap.module.scss";

/**
 * Fade in the map after all tiles have loaded
 */
export default function useFadeInMapOnLoad(
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  mapDivRef: React.MutableRefObject<HTMLDivElement | null>
) {
  useEffect(
    () => {
      if (mapRef.current) {
        const listener = mapRef.current.addListener("tilesloaded", () => {
          if (mapDivRef.current) {
            mapDivRef.current.classList.add(styles.fade);
          }
        });
        return () => google.maps.event.removeListener(listener);
      }
    },
    /**
     * mapRef.current must exist otherwise the mapDivRef will fade
     * in and show nothing.
     */
    //eslint-disable-next-line
    [mapRef.current]
  );
}
