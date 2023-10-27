import { useEffect } from "react";
import { makeElement } from "../mapHelpers";
import styles from "../exploreListingsMap.module.scss";
import { ReactComponent as PlusSVG } from "../assets/plus-solid.svg";
import { ReactComponent as MinusSVG } from "../assets/minus-solid.svg";

export default function useSetupMapZoomControls(
  map: google.maps.Map | undefined
) {
  useEffect(() => {
    function setup() {
      if (map) {
        const zoomControls = makeElement({
          component: (
            <div className={styles["map-zoom-controls"]}>
              <button
                className={styles["map-zoom-btn"]}
                type="button"
                onClick={() => map!.setZoom(map!.getZoom()! + 1)}
              >
                <PlusSVG />
              </button>
              <button
                className={styles["map-zoom-btn"]}
                type="button"
                onClick={() => map!.setZoom(map!.getZoom()! - 1)}
              >
                <MinusSVG />
              </button>
            </div>
          ),
          id: "map-zoom-controls",
        }) as HTMLElement;

        map!.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
          zoomControls
        );
      }
    }
    setup();
  }, [map]);
}
