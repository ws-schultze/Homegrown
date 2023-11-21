import React, { useEffect } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { defineBoundaries, setupBoundaryForPlace } from "../mapHelpers";
import { useDispatch } from "react-redux";
import { Boundaries, FetchedListing } from "../../../../../types";

export default function useInitializeMap(
  mapDivRef: React.MutableRefObject<HTMLDivElement | null>,
  currentMapId: string,
  roadmapBoundaryStyle: google.maps.FeatureStyleOptions,
  smallMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >,
  largeMarkersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerView[]
  >,
  mapRef: React.MutableRefObject<google.maps.Map | undefined>,
  searchBoxRef: React.MutableRefObject<
    google.maps.places.SearchBox | undefined
  >,
  setupHideBoundaryBtn: any,
  boundariesRef: React.MutableRefObject<Boundaries>,
  makeMarkers: ({
    map,
    listings,
    markerSize,
  }: {
    map: google.maps.Map;
    listings: FetchedListing[];
    markerSize: "large" | "small";
  }) => google.maps.marker.AdvancedMarkerView[]
) {
  const commonState = useAppSelector((s) => s.common);
  const pageState = useAppSelector((s) => s.exploreListings);
  const placeFilter = useAppSelector((s) => s.placeFilter);
  if (placeFilter.place) {
    var place: google.maps.places.PlaceResult | undefined = JSON.parse(
      placeFilter.place
    );
  }
  const dispatch = useDispatch();
  /**
   * Initialize the map
   */
  useEffect(
    () => {
      /**
       * Initialize the map
       * @returns map google.maps.Map | undefined
       */
      function initializeMap() {
        if (
          mapDivRef.current &&
          commonState.listings &&
          commonState.listings !== null &&
          commonState.listings.length >= 1
        ) {
          const mapCenter = pageState.mapCenter
            ? pageState.mapCenter
            : commonState.listings[0].data.address.geolocation.value;

          const mapZoom = pageState.mapZoom ? pageState.mapZoom : 10;

          const mapOptions = {
            mapId: currentMapId,
            center: mapCenter,
            zoom: mapZoom,
            disableDefaultUI: true,
            streetViewControl: true,
            clickableIcons: false,
            streetViewControlOptions: {
              position: google.maps.ControlPosition.RIGHT_TOP,
            },
          };

          const map = new window.google.maps.Map(mapDivRef.current, mapOptions);

          // map.mapTypes.set("dark", darkStyleMap);
          // map.mapTypes.set("desert", desertStyleMap);

          // placeFilter.place already is defined
          if (place) {
            if (place.place_id) {
              const boundaries = defineBoundaries(map);

              setupHideBoundaryBtn(map, boundaries);

              setupBoundaryForPlace(
                map,
                place,
                boundaries,
                roadmapBoundaryStyle,
                boundariesRef
              );
            }
          }

          // Make small markers
          const smallMarkers = makeMarkers({
            map: map,
            listings: commonState.listings,
            markerSize: "small",
          });

          // Make large markers
          const largeMarkers = makeMarkers({
            map: map,
            listings: commonState.listings,
            markerSize: "large",
          });

          const input = document.getElementById(
            "place-filter-searchbox"
          ) as HTMLInputElement;

          const searchBox = new google.maps.places.SearchBox(input);

          mapRef.current = map;
          searchBoxRef.current = searchBox;
          smallMarkersRef.current = smallMarkers;
          largeMarkersRef.current = largeMarkers;

          // Throw errors if needed
        } else if (mapDivRef === undefined) {
          throw new Error("mapDivRef is undefined");
        } else if (!commonState.listings) {
          throw new Error("listings is undefined");
        } else if (commonState.listings.length < 1) {
          throw new Error("listings.length < 1");
        } else {
          throw new Error("Escaped");
        }
      }

      if (commonState.status === "idle") {
        initializeMap();
      }
    },
    /**
     *  By adding the deps:
     * 'place' and 'pageState.mapCenter', this effect will run more than once.
     */
    // eslint-disable-next-line
    [
      currentMapId,
      commonState.status,
      commonState.listings,
      setupHideBoundaryBtn,
      dispatch,
      makeMarkers,
    ]
  );
}
