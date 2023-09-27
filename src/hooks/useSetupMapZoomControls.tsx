import React, { useEffect } from "react";
import { makeElement } from "../components/pages/exploreListings/map/mapHelpers";
import {
  MapZoomControl,
  MapZoomInBtn,
  MapZoomOutBtn,
} from "../components/pages/exploreListings/map/styledComponents";
import css from "../components/common/addressMap/styles.module.css";
import { ReactComponent as PlusSVG } from "../assets/svg/plus-solid.svg";
import { ReactComponent as MinusSVG } from "../assets/svg/minus-solid.svg";

export default function useSetupMapZoomControls(
  map: google.maps.Map | undefined
) {
  useEffect(() => {
    function setup() {
      if (map) {
        const zoomBtnContainer = makeElement({
          component: (
            <div className={css.zoomControlsContainer}>
              <MapZoomInBtn
                type="button"
                onClick={() => map!.setZoom(map!.getZoom()! + 1)}
              >
                <PlusSVG />
              </MapZoomInBtn>
              <MapZoomOutBtn
                type="button"
                onClick={() => map!.setZoom(map!.getZoom()! - 1)}
              >
                <MinusSVG />
              </MapZoomOutBtn>
            </div>
          ),
          id: "zoom-btn-container",
        }) as HTMLElement;

        map!.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
          zoomBtnContainer
        );
      }
    }
    setup();
  }, [map]);
}
