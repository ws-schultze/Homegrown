import React, { memo, useEffect, useRef, useState } from "react";
import css from "./styles.module.css";
import "./index.css";
import { useThemeContext } from "../../../ThemeProvider";
import { useMapContext } from "../../../MapProvider";
import useSetupMapZoomControls from "../../../hooks/useSetupMapZoomControls";
import useSetupMapFullScreenControls from "../../../hooks/useSetupMapFullScreenControls";
import useSetupMapTypeIdControls from "../../../hooks/useSetupMapTypeIdControls";

interface Props {
  formattedAddress?: string;
  center: google.maps.LatLngLiteral;
}

const centralUSA = { lat: 39.8283, lng: -98.5795 };

const AddressMap = memo(function AddressMap({
  formattedAddress,
  center,
}: Props) {
  const mapDivRef = useRef<HTMLInputElement | null>(null);
  // const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const { currentMapId } = useMapContext();

  /**
   * Initialize map
   */
  useEffect(() => {
    function initializeMap() {
      if (mapDivRef.current) {
        // Map options
        const options: google.maps.MapOptions = {
          center,
          zoom: 17,
          mapId: currentMapId,
          disableDefaultUI: true,
        };

        // Map without marker, used before an address is input
        // Contains no center

        // let map: google.maps.Map | undefined = undefined;

        if (center.lat === 0 && center.lng === 0) {
          const map = new window.google.maps.Map(mapDivRef.current, options);
          // mapRef.current = map;
          setMap(map);

          // Map with a marker, used after an address is input
          // Contains a center
        } else {
          const map = new window.google.maps.Map(mapDivRef.current, options);
          // mapRef.current = map;
          setMap(map);

          new google.maps.Marker({
            position: center,
            map,
            title: formattedAddress ? formattedAddress : "Listing Marker",
          });
        }
      }
    }
    initializeMap();
  }, [currentMapId, center, formattedAddress]);

  useSetupMapZoomControls(map);

  return <div ref={mapDivRef} className={css.map} />;
});

export default AddressMap;
