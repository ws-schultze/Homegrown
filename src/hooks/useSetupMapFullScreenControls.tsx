import React, { useEffect } from "react";
import {
  exitFullscreen,
  makeElement,
  requestFullscreen,
} from "../components/pages/exploreListingsPage/map/mapHelpers";
import {
  MapFullScreenBtnContainer,
  MapFullScreenBtn,
} from "../components/pages/exploreListingsPage/map/styledComponents";
import { useDispatch } from "react-redux";
import { setMapIsFullScreen } from "../components/pages/exploreListingsPage/exploreListingsPageSlice";

import { ReactComponent as ExpandSVG } from "../assets/svg/expand-solid.svg";
import { ReactComponent as CompressSVG } from "../assets/svg/compress-solid.svg";

import { isFullscreen } from "../components/pages/exploreListingsPage/map/mapHelpers";

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
            <MapFullScreenBtnContainer>
              <MapFullScreenBtn
                type="button"
                onClick={() => {
                  dispatch(setMapIsFullScreen());
                }}
              >
                <ExpandSVG />
              </MapFullScreenBtn>
            </MapFullScreenBtnContainer>
          ),
          id: "map-expand-btn",
        }) as HTMLElement;

        const exitFullScreenBtn = makeElement({
          component: (
            <MapFullScreenBtnContainer>
              <MapFullScreenBtn
                type="button"
                onClick={() => {
                  dispatch(setMapIsFullScreen());
                }}
              >
                <CompressSVG />
              </MapFullScreenBtn>
            </MapFullScreenBtnContainer>
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
