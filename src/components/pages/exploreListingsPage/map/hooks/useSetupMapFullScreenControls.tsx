import { useEffect } from "react";
import { exitFullscreen, makeElement, requestFullscreen } from "../mapHelpers";
import { useDispatch } from "react-redux";
import { setMapIsFullScreen } from "../../exploreListingsPageSlice";
import { ReactComponent as ExpandSVG } from "../assets/expand-solid.svg";
import { ReactComponent as CompressSVG } from "../assets/compress-solid.svg";
import { isFullscreen } from "../mapHelpers";
import styles from "../exploreListingsMap.module.scss";

/**
 * Create expand/compress buttons on the given map for entering/exiting
 * full screen map
 * @param map google.maps.Map | undefined
 */
function useSetupMapFullScreenControls(map: google.maps.Map | undefined) {
  const dispatch = useDispatch();

  useEffect(() => {
    function setup() {
      if (map) {
        const elementToSendFullscreen = map.getDiv().firstChild as HTMLElement;

        const enterFullScreenBtn = makeElement({
          component: (
            <div className={styles["map-fullscreen-btn-container"]}>
              <button
                className={styles["map-fullscreen-btn"]}
                type="button"
                onClick={() => {
                  dispatch(setMapIsFullScreen());
                }}
              >
                <ExpandSVG />
              </button>
            </div>
          ),
          id: "map-expand-btn",
        }) as HTMLElement;

        const exitFullScreenBtn = makeElement({
          component: (
            <div className={styles["map-full-screen-btn-container"]}>
              <button
                className={styles["map-fullscreen-btn"]}
                type="button"
                onClick={() => {
                  dispatch(setMapIsFullScreen());
                }}
              >
                <CompressSVG />
              </button>
            </div>
          ),
          id: "map-compress-btn",
        }) as HTMLElement;

        if (isFullscreen(elementToSendFullscreen)) {
          map.controls[google.maps.ControlPosition.RIGHT_TOP].pop();
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
            exitFullScreenBtn
          );
        } else {
          map.controls[google.maps.ControlPosition.RIGHT_TOP].pop();
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
            enterFullScreenBtn
          );
        }

        enterFullScreenBtn.onclick = function () {
          requestFullscreen(elementToSendFullscreen);
        };

        exitFullScreenBtn.onclick = function () {
          exitFullscreen();
        };

        document.onwebkitfullscreenchange =
          document.onmsfullscreenchange =
          document.onmozfullscreenchange =
          document.onfullscreenchange =
            function () {
              if (isFullscreen(elementToSendFullscreen)) {
                map.controls[google.maps.ControlPosition.RIGHT_TOP].pop();
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
                  exitFullScreenBtn
                );
              } else {
                map.controls[google.maps.ControlPosition.RIGHT_TOP].pop();
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
                  enterFullScreenBtn
                );
              }
            };
      }
    }
    setup();
  }, [map, dispatch]);
}

export default useSetupMapFullScreenControls;
