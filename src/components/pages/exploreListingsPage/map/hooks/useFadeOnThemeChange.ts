import { useEffect } from "react";
import styles from "../exploreListingsMap.module.scss";

/**
 * Apply fade animation on the mapDivRef when the theme changes
 */
export default function useFadeOnThemeChange(
  mapDivRef: React.MutableRefObject<HTMLDivElement | null>,
  currentMapId: string
) {
  useEffect(() => {
    if (mapDivRef.current) {
      mapDivRef.current.style.opacity = "0";
      mapDivRef.current.classList.remove(styles.fade);
    }
  }, [currentMapId, mapDivRef]);
}
