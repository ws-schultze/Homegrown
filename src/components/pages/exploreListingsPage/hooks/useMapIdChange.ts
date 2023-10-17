import { useEffect } from "react";
import css from "../map/styles.module.css";

/**
 * Apply fade animation on the mapDivRef when the theme changes the mapId
 */
function useMapIdChange(mapId: string, mapContainer: HTMLDivElement | null) {
  useEffect(() => {
    function handler() {
      if (mapContainer) {
        mapContainer.style.opacity = "0";
        mapContainer.classList.remove(css.fade);
      }
    }
    handler();
  }, [mapId, mapContainer]);
}

export default useMapIdChange;
