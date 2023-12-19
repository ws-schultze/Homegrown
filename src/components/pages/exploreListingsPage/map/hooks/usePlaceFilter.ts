import React, { useEffect } from "react";
import { MapType } from "../../../../shared/mapTypeMenu/mapTypeMenuSlice";
import { Boundaries } from "../../../../../types";
import { defineBoundaries, setupBoundaryForPlace } from "../mapHelpers";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setPlace } from "../../../../shared/listingFilters/placeFilter/placeFilterSlice";

export default function usePlaceFilter(
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  searchBoxRef: React.MutableRefObject<
    google.maps.places.SearchBox | undefined
  >,
  mapTypeIdRef: React.MutableRefObject<MapType>,
  boundariesRef: React.MutableRefObject<Boundaries>,
  roadmapBoundaryStyle: google.maps.FeatureStyleOptions,
  largeMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >,
  smallMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >,
  setupHideBoundaryBtn: (map: google.maps.Map, boundaries: Boundaries) => void
) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /**
   * Handle place change
   */
  useEffect(
    () => {
      function handlePlaceChange() {
        if (searchBoxRef) {
          if (searchBoxRef.current) {
            searchBoxRef.current.addListener("places_changed", () => {
              if (searchBoxRef.current && mapRef.current) {
                const places = searchBoxRef.current.getPlaces();

                if (places && places.length > 0) {
                  if (largeMarkersRef.current && smallMarkersRef.current) {
                    // Clear out the old markers in order to have them in the correct location on render.
                    largeMarkersRef.current.forEach((marker) => {
                      marker.map = null;
                    });
                    smallMarkersRef.current.forEach((marker) => {
                      marker.map = null;
                    });
                  }

                  const boundaries = defineBoundaries(mapRef.current);

                  boundariesRef.current = boundaries;

                  setupHideBoundaryBtn(mapRef.current, boundaries);

                  setupBoundaryForPlace(
                    mapRef.current,
                    places[0],
                    boundaries,
                    roadmapBoundaryStyle,
                    boundariesRef
                  );

                  // Because lat and lng are functions in a
                  // google.maps.places.PlaceResult, and since this
                  // place filter must be stringified to be dispatched,
                  // turn lat and lng into numbers before stringify,
                  // so that after parse the values are useful

                  // Make the place result serializable
                  const p = places[0];
                  const _place: google.maps.places.PlaceResult = {
                    ...p,
                    geometry: {
                      ...p.geometry,
                      location: {
                        //@ts-ignore
                        lat: p.geometry?.location?.lat(),
                        //@ts-ignore
                        lng: p.geometry?.location?.lng(),
                      },
                    },
                  };
                  const strPlace = JSON.stringify(_place);
                  dispatch(setPlace(strPlace));
                  navigate(`${_place.formatted_address}`, { replace: true });
                }
              }
            });
          }
        }
      }
      handlePlaceChange();
    },
    /**
     * searchBoxRef.current and mapRef.current are needed deps to
     * ensure that boundaries are drawn on the current map with
     * the current searchbox results
     */
    // eslint-disable-next-line
    [
      searchBoxRef.current,
      mapRef.current,
      mapTypeIdRef,
      dispatch,
      navigate,
      setupHideBoundaryBtn,
    ]
  );
}
