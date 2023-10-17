import { useEffect } from "react";
import { makeElement } from "../components/pages/exploreListingsPage/map/mapHelpers";
import MapTypeDropdown from "../components/shared/mapTypeMenu/MapTypeDropdown";

/**
 * Setup the mapTypeId menu on the map
 * @param map google.maps.Map | undefined
 */
function useSetupMapTypeIdControls(map: google.maps.Map | undefined) {
  useEffect(() => {
    function setupMapTypeControl() {
      if (map) {
        const mapTypeMenu = makeElement({
          component: (
            <MapTypeDropdown
              // menuItems={["roadmap", "hybrid", "terrain", "dark", "desert"]}
              menuItems={["roadmap", "hybrid", "terrain"]}
              defaultMapType="roadmap"
              map={map}
            />
          ),
          id: "map-type-menu",
        }) as HTMLElement;

        map.controls[google.maps.ControlPosition.LEFT_TOP].push(mapTypeMenu);
      }
    }
    setupMapTypeControl();
  }, [map]);
}

export default useSetupMapTypeIdControls;
