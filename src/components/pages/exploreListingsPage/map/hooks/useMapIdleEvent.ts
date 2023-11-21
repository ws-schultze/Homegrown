import React, { useEffect } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { getCurrentListings, getMarkerSize } from "../mapHelpers";
import {
  setCurrentListings,
  setMapCenter,
  setMapMarkerSize,
  setMapZoom,
} from "../../exploreListingsPageSlice";

/**
 Set the current listings, map zoom, map center, and marker size to redux when the map is idle
 */
export default function useMapIdleEvent(
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  currentMapId: string
) {
  const commonState = useAppSelector((s) => s.common);
  const pageState = useAppSelector((s) => s.exploreListings);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (
        commonState.status === "idle" &&
        mapRef.current &&
        commonState.listings.length > 0
      ) {
        const idleHandler = mapRef.current.addListener("idle", () => {
          if (mapRef.current) {
            const mapMarkerSize = getMarkerSize(
              mapRef.current!,
              pageState.mapMinZoomForLargeMarkers
            );

            const currentListings = getCurrentListings(
              mapRef.current!,
              commonState.listings
            );

            const mapCenter = {
              lat: mapRef.current?.getCenter()?.lat()!,
              lng: mapRef.current?.getCenter()?.lng()!,
            };

            dispatch(setMapZoom(mapRef.current?.getZoom()!));
            dispatch(setMapCenter(mapCenter));
            dispatch(setMapMarkerSize(mapMarkerSize));
            dispatch(setCurrentListings(currentListings));
          } else {
            console.error("mapRef.current is undefined");
          }
        });

        /**
         * ========== VERY IMPORTANT ==============
         *
         * If idleHandler does not get removed, it will fire multiple times,
         * using old state, and cause current filtered markers to flash instead
         * of not being hidden then shown
         *
         * Do not wrap idleHandler in another function
         */
        return () => google.maps.event.removeListener(idleHandler);
      }
    },
    /**
     * removed mapRef.current as a dep. seems to not break stuff by doing so
     */
    [
      currentMapId,
      commonState.status,
      commonState.listings,
      pageState.allFilteredListings,
      pageState.mapMinZoomForLargeMarkers,
      dispatch,
      mapRef,
    ]
  );
}
