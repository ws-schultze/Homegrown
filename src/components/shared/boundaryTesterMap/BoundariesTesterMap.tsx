import { useEffect, useRef } from "react";

export default function BoundariesTesterMap() {
  const mapRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function initMap() {
      if (mapRef.current) {
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          mapId: "a93e2735a55284b2",
          center: { lat: 42.9672, lng: -103.7715 },
          zoom: 5,
          //   mapTypeId: "hybrid",
        });

        // Get boundaries to be styled
        //@ts-ignore
        let stateBoundaries = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");

        // Define styling to be applied to the boundaries
        const boundariesStyling = {
          strokeColor: "#33c1ff",
          strokeOpacity: 8.7,
          strokeWeight: 2.0,
          fillColor: "#33c1ff",
          fillOpacity: 0.1,
        };

        // Add styling to the boundaries
        stateBoundaries.style = boundariesStyling;

        map.addListener("maptypeid_changed", () => {
          //   console.log(map.getRenderingType());
          //   stateBoundaries.style = null;
          //@ts-ignore
          //   const stateBoundaries = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");
          //   stateBoundaries.style = boundariesStyling;
        });
      } else {
        throw new Error("mapRef is undefined");
      }
    }
    initMap();
  }, []);

  return <div className="map-component" ref={mapRef} id="map"></div>;
}
