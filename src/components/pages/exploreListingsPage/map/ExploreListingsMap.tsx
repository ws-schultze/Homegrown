import { useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { ReactComponent as ImageSVG } from "../../../../assets/svg/image-regular.svg";
import { Boundaries, FetchedListing } from "../../../../types/index";
import { useNavigate } from "react-router-dom";
import { MapBoundaryBtn } from "./styledComponents";
import clearMarkerContentClassList, {
  defineBoundaries,
  filterListings,
  getCurrentFilteredMarkers,
  getCurrentListings,
  getCurrentMarkers,
  getMarkerSize,
  getNonCurrentFilteredMarkers,
  hideMarkers,
  highlightMarker,
  makeElement,
  moveMarkerContent,
  showMarkers,
  stylePlaceBoundary,
  toggleMarkerHighlight,
  unhighlightMarker,
} from "./mapHelpers";
import { useAppSelector } from "../../../../redux/hooks";

import styles from "./exploreListingsMap.module.scss";
// import "./index.scss"; // styles that override default google styles

import {
  MapMarkerSize,
  setAllFilteredListings,
  setCurrentFilteredListings,
  setCurrentListings,
  setMapCenter,
  setMapMarkerSize,
  setMapZoom,
} from "../exploreListingsPageSlice";
import { setPlace } from "../../../shared/listingFilters/absoluteDropdowns/placeFilter/placeFilterSlice";
import { MapType } from "../../../shared/mapTypeMenu/mapTypeMenuSlice";
import { useDispatch } from "react-redux";
import { useMapContext } from "../../../../MapProvider";
import useSetupMapZoomControls from "../../../../hooks/useSetupMapZoomControls";
import useSetupMapFullScreenControls from "../../../../hooks/useSetupMapFullScreenControls";
// import useSetupMapTypeIdControls from "../../../../hooks/useSetupMapTypeIdControls";
import { roadmapBoundaryStyle } from "./mapStyles";

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    onwebkitfullscreenchange?: any;
    onmsfullscreenchange?: any;
    onmozfullscreenchange?: any;
  }

  interface HTMLElement {
    msRequestFullScreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullScreen?: () => Promise<void>;
  }
}

interface Props {
  isMobile: boolean;
}

export default function ExploreListingsMap({ isMobile }: Props): JSX.Element {
  // console.log("Map: rendering");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMapId } = useMapContext();
  const mapDivRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const searchBoxRef =
    useRef<google.maps.places.SearchBox | undefined>(undefined);
  const smallMarkersRef = useRef<google.maps.marker.AdvancedMarkerView[]>([]);
  const largeMarkersRef = useRef<google.maps.marker.AdvancedMarkerView[]>([]);
  const boundariesRef = useRef<Boundaries>(null);
  const mapTypeIdRef = useRef<MapType>("roadmap");
  const commonState = useAppSelector((state) => state.common);
  const pageState = useAppSelector((state) => state.exploreListings);
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const priceFilter = useAppSelector((state) => state.priceFilter);
  const listingTypeFilter = useAppSelector((state) => state.listingTypeFilter);
  const bedAndBathFilter = useAppSelector((state) => state.bedAndBathFilter);
  const forSaleOrRentFilter = useAppSelector(
    (state) => state.forSaleOrRentFilter
  );

  if (placeFilter.place) {
    var place: google.maps.places.PlaceResult | undefined = JSON.parse(
      placeFilter.place
    );
  }

  /**
   * Make a marker for each given listing and return an array of markers
   */
  const makeMarkers = useCallback(
    ({
      map,
      listings,
      markerSize,
    }: {
      map: google.maps.Map;
      listings: FetchedListing[];
      markerSize: "large" | "small";
    }): google.maps.marker.AdvancedMarkerView[] => {
      let markers: google.maps.marker.AdvancedMarkerView[] = [];

      listings.forEach((listing, i) => {
        /**
         * Only make info windows on large screens
         */
        let makeInfoWindow = true;
        // const w = window.innerWidth;

        // if (w < 1000) {
        //   makeInfoWindow = false;
        // } else {
        //   makeInfoWindow = true;
        // }

        function makeMapMarkerContents(): Element {
          let div = document.createElement("div");

          if (listing.data.basicInfo.forSaleOrRent.value?.id === "for-rent") {
            div.classList.add(styles["map-marker-wrap"]);
          }

          if (listing.data.basicInfo.forSaleOrRent.value?.id === "for-sale") {
            div.classList.add(styles["map-marker-wrap"]);
          }

          const component = (
            <div
              onClick={() => {
                navigate(
                  `/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`
                );
              }}
            >
              {makeInfoWindow === true ? (
                <div
                  id={`map-marker__info-window__${listing.id}`}
                  className={styles["info-window"]}
                >
                  {listing.data.uploads.images.value[0] !== undefined ? (
                    <img
                      src={listing.data.uploads.images.value[0].url}
                      alt={"listing"}
                    />
                  ) : (
                    <ImageSVG />
                  )}
                  <div className={styles["info-window__body"]}>
                    <>
                      <div className={styles["info-window__body__header"]}>
                        {/* Header */}
                        <div>
                          <b>{listing.data.basicInfo.price.shortFormatted}</b>
                          {" - "}
                          {listing.data.basicInfo.listingKind.value?.label}
                        </div>
                      </div>

                      {/* Features */}
                      {listing.data.singleFamilyHome ||
                      listing.data.multiFamilyHomeUnit ||
                      listing.data.apartment ? (
                        <div className={styles["info-window__body__features"]}>
                          {/* Bedrooms */}
                          <div>
                            <b>
                              {listing.data.singleFamilyHome?.bedrooms.number ||
                                listing.data.multiFamilyHomeUnit?.bedrooms
                                  .number ||
                                listing.data.apartment?.bedrooms.number}
                            </b>
                            bd
                          </div>
                          {/* {" - "} */}

                          {/* Bathrooms */}
                          <div>
                            <b>
                              {listing.data.singleFamilyHome?.fullBathrooms
                                .number! +
                                listing.data.singleFamilyHome?.halfBathrooms
                                  .number! *
                                  0.5 ||
                                listing.data.multiFamilyHomeUnit?.fullBathrooms
                                  .number! +
                                  listing.data.multiFamilyHomeUnit
                                    ?.halfBathrooms.number! *
                                    0.5 ||
                                listing.data.apartment?.fullBathrooms.number! +
                                  listing.data.apartment?.halfBathrooms
                                    .number! *
                                    0.5}
                            </b>
                            ba
                          </div>
                          {/* {" - "} */}

                          {/* Square feet */}
                          <div>
                            <b>
                              {listing.data.singleFamilyHome?.squareFeet
                                .formatted ||
                                listing.data.multiFamilyHomeUnit?.squareFeet
                                  .formatted ||
                                listing.data.apartment?.squareFeet.formatted}
                            </b>
                            {/* ft<sup>2</sup> */}
                            sqft
                          </div>

                          {/* <div>{basicInfo.forSaleOrRent.value?.label}</div> */}
                        </div>
                      ) : null}
                    </>

                    {/* Address */}
                    <div className={styles["info-window__body__address"]}>
                      {listing.data.address.formattedAddress.value}
                    </div>
                  </div>
                </div>
              ) : makeInfoWindow === false ? (
                <></>
              ) : null}

              {markerSize === "large" ? (
                <div
                  className={`${styles["map-marker"]} ${styles["large"]} ${
                    listing.data.basicInfo.forSaleOrRent.value?.id ===
                    "for-rent"
                      ? styles["for-rent"]
                      : listing.data.basicInfo.forSaleOrRent.value?.id ===
                        "for-sale"
                      ? styles["for-sale"]
                      : ""
                  }`}
                >
                  {listing.data.basicInfo.price.shortFormatted}
                </div>
              ) : markerSize === "small" ? (
                <div
                  className={`${styles["map-marker"]} ${styles["small"]} ${
                    listing.data.basicInfo.forSaleOrRent.value?.id ===
                    "for-rent"
                      ? styles["for-rent"]
                      : listing.data.basicInfo.forSaleOrRent.value?.id ===
                        "for-sale"
                      ? styles["for-sale"]
                      : ""
                  }`}
                >
                  {/* small markers don't show price */}
                </div>
              ) : (
                <div>ERROR...</div>
              )}
            </div>
          );

          const root = ReactDOM.createRoot(div);
          root.render(component);
          return div;
        }

        const markerContent = makeMapMarkerContents();

        // Create marker but don't add it to the map here.
        const marker = new google.maps.marker.AdvancedMarkerView({
          position: listing.data.address.geolocation.value,
          content: markerContent,
          title: listing.data.basicInfo.description.value,
        });

        // Add listeners to marker for desktop size window
        if (window.innerWidth > 1024) {
          const element = marker.content as HTMLElement;

          ["focus", "pointerenter"].forEach((event) => {
            element.addEventListener(event, () => {
              highlightMarker(marker);
              if (map) {
                moveMarkerContent(map, marker);
              }
            });
          });

          ["blur", "pointerleave"].forEach((event) => {
            element.addEventListener(event, () => {
              unhighlightMarker(marker);
              clearMarkerContentClassList(marker);
            });
          });
        } else {
          marker.addListener("click", () => {
            toggleMarkerHighlight(marker, listing);
          });
        }

        markers.push(marker);
      });

      return markers;
    },
    [navigate]
  );

  /**
   * Hide and show the appropriate filtered markers
   * @param map google.maps.Map
   * @param smallMarkers google.maps.marker.AdvancedMarkerView[]
   * @param largeMarkers google.maps.marker.AdvancedMarkerView[]
   * @param minZoomForLargeMarkers number
   * @param currentFilteredListings FetchedListing[]
   */
  function updateMarkers(
    map: google.maps.Map,
    smallMarkers: google.maps.marker.AdvancedMarkerView[],
    largeMarkers: google.maps.marker.AdvancedMarkerView[],
    minZoomForLargeMarkers: number
  ) {
    if (map && smallMarkers && largeMarkers) {
      const markerSize = getMarkerSize(map, minZoomForLargeMarkers);
      const currentLargeMarkers = getCurrentMarkers(map, largeMarkers);
      const currentSmallMarkers = getCurrentMarkers(map, smallMarkers);
      const allFilteredListings = filterListings(commonState.listings, {
        place: placeFilter.place ? JSON.parse(placeFilter.place) : undefined,
        forSaleOrRent: forSaleOrRentFilter.selectedItem,
        lowPrice: priceFilter.lowPrice,
        highPrice: priceFilter.highPrice,
        listingTypes: listingTypeFilter.selectedTypes,
        beds: bedAndBathFilter.beds,
        baths: bedAndBathFilter.baths,
      });

      const currentFilteredListings = getCurrentListings(
        map,
        allFilteredListings
      );

      // Markers to show
      const currentFilteredSmallMarkers = getCurrentFilteredMarkers(
        currentSmallMarkers,
        currentFilteredListings
      );
      const currentFilteredLargeMarkers = getCurrentFilteredMarkers(
        currentLargeMarkers,
        currentFilteredListings
      );

      // Markers to hide
      const nonCurrentFilteredSmallMarkers = getNonCurrentFilteredMarkers(
        smallMarkersRef.current,
        currentFilteredListings
      );
      const nonCurrentFilteredLargeMarkers = getNonCurrentFilteredMarkers(
        largeMarkersRef.current,
        currentFilteredListings
      );

      // Hide/Show markers
      if (markerSize === "small") {
        hideMarkers(nonCurrentFilteredSmallMarkers);
        hideMarkers(largeMarkers);
        showMarkers(currentFilteredSmallMarkers, map);
      } else if (markerSize === "large") {
        hideMarkers(nonCurrentFilteredLargeMarkers);
        hideMarkers(smallMarkers);
        showMarkers(currentFilteredLargeMarkers, map);
      }

      dispatch(setAllFilteredListings(allFilteredListings));
      dispatch(setCurrentFilteredListings(currentFilteredListings));
    } else {
      console.warn("Escaped");
    }
  }

  const setupHideBoundaryBtn = useCallback(
    (map: google.maps.Map, boundaries: Boundaries) => {
      const hideBoundaryBtn = makeElement({
        component: (
          <MapBoundaryBtn type="button">Remove Boundary</MapBoundaryBtn>
        ),
        id: "hide-boundary-btn",
      }) as HTMLElement;

      // Ensure that the btn corresponds to the current boundary
      if (
        map.controls[google.maps.ControlPosition.TOP_CENTER].getLength() === 0
      ) {
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          hideBoundaryBtn
        );
      } else {
        map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          hideBoundaryBtn
        );
      }

      hideBoundaryBtn.addEventListener("click", () => {
        if (boundaries) {
          boundaries.postalCodeBoundaries.style = null;
          boundaries.countyBoundaries.style = null;
          boundaries.stateBoundaries.style = null;
          boundaries.countryBoundaries.style = null;
          boundaries.cityBoundaries.style = null;
          boundariesRef.current = null;
        }
        map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
        dispatch(setPlace(undefined));
        navigate("", { replace: true });
      });
    },
    [dispatch, navigate]
  );

  /**
   * Given a placeId, style the boundary for it, add event listeners to the boundary buttons and fit the bounds to cover the map.
   * // https://developers.google.com/maps/documentation/javascript/examples/place-details
   * @param placeId string
   * @param map google.maps.Map
   * @param hideBoundaryBtn HTMLElement
   * @param showBoundaryBtn HTMLElement
   * @param boundaryStyling  google.maps.FeatureStyleOptions
   * @param boundaries {
      cityBoundaries: google.maps.FeatureLayer;
      postalCodeBoundaries: google.maps.FeatureLayer;
      countyBoundaries: google.maps.FeatureLayer;
      stateBoundaries: google.maps.FeatureLayer;
      countryBoundaries: google.maps.FeatureLayer;
    }
   */
  function setupBoundaryForPlace(
    map: google.maps.Map,
    place: google.maps.places.PlaceResult,
    boundaries: Boundaries,
    boundaryStyle: google.maps.FeatureStyleOptions
  ) {
    if (place && place.geometry && place.geometry.location && place.place_id) {
      const bounds = new google.maps.LatLngBounds();
      // Extend bounds to include place
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);

      boundariesRef.current = boundaries;

      stylePlaceBoundary(place.place_id, boundaries, boundaryStyle);
    } else {
      console.warn("place object is missing some information");
    }
  }

  /**
   * NOTICE: Data-driven styling for boundaries only works on roadmap
   */
  // useSetupMapTypeIdControls(mapRef.current);
  useSetupMapZoomControls(mapRef.current);
  useSetupMapFullScreenControls(mapRef.current);

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
        console.log("initializeMap: started");
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
                roadmapBoundaryStyle
              );

              updateMarkers(
                mapRef.current!,
                smallMarkersRef.current,
                largeMarkersRef.current,
                pageState.mapMinZoomForLargeMarkers
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

        console.log("initializeMap: done");
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

  /**
   * Fade in the map all tiles loaded
   */
  useEffect(
    () => {
      if (mapRef.current) {
        const listener = mapRef.current.addListener("tilesloaded", () => {
          if (mapDivRef.current) {
            mapDivRef.current.classList.add(styles.fade);
          }
        });
        return () => google.maps.event.removeListener(listener);
      }
    },
    /**
     * mapRef.current must exist otherwise the mapDivRef will fade
     * in and show nothing.
     */
    //eslint-disable-next-line
    [mapRef.current]
  );

  /**
   * Apply fade animation on the mapDivRef when the theme changes
   */
  useEffect(() => {
    if (mapDivRef.current) {
      mapDivRef.current.style.opacity = "0";
      mapDivRef.current.classList.remove(styles.fade);
    }
  }, [currentMapId]);

  /**
   * Handle filters change:
   */
  useEffect(
    () => {
      /**
       * When filters change, dispatch allFilteredListings and
       * currentFilteredListing, then update the map markers
       */
      function handleFiltersChange() {
        if (
          commonState.status === "idle" &&
          mapRef.current &&
          mapRef.current.getBounds() &&
          commonState.listings.length > 0
        ) {
          // const allFilteredListings = filterListings(commonState.listings, {
          //   place: placeFilter.place
          //     ? JSON.parse(placeFilter.place)
          //     : undefined,
          //   forSaleOrRent: forSaleOrRentFilter.selectedItem,
          //   lowPrice: priceFilter.lowPrice,
          //   highPrice: priceFilter.lowPrice,
          //   listingTypes: listingTypeFilter.selectedItems,
          //   beds: bedAndBathFilter.beds,
          //   baths: bedAndBathFilter.baths,
          // });

          // const currentFilteredListings = getCurrentListings(
          //   mapRef.current,
          //   allFilteredListings
          // );

          updateMarkers(
            mapRef.current!,
            smallMarkersRef.current,
            largeMarkersRef.current,
            pageState.mapMinZoomForLargeMarkers
          );

          // dispatch(setAllFilteredListings(allFilteredListings));
          // dispatch(setCurrentFilteredListings(currentFilteredListings));
        }
      }
      handleFiltersChange();
    },
    /**
     * Make sure to add 'theme' as a dep in order to show
     * the currentFilteredListing's markers on map reload
     */
    [
      placeFilter.place,
      forSaleOrRentFilter.selectedItem,
      priceFilter.lowPrice,
      priceFilter.highPrice,
      listingTypeFilter.selectedTypes,
      bedAndBathFilter.baths,
      bedAndBathFilter.beds,
      commonState.status,
      pageState.mapMinZoomForLargeMarkers,
      commonState.listings,
      currentMapId,
      dispatch,
    ]
  );

  /**
   * Handle map idle event
   */
  useEffect(
    () => {
      if (
        commonState.status === "idle" &&
        mapRef.current &&
        commonState.listings.length > 0
      ) {
        const idleHandler = mapRef.current.addListener("idle", () => {
          if (mapRef.current) {
            console.log("Effect: Map in idle: updating markers");

            const mapMarkerSize = getMarkerSize(
              mapRef.current!,
              pageState.mapMinZoomForLargeMarkers
            );

            const currentListings = getCurrentListings(
              mapRef.current!,
              commonState.listings
            );

            updateMarkers(
              mapRef.current!,
              smallMarkersRef.current,
              largeMarkersRef.current,
              pageState.mapMinZoomForLargeMarkers
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
    ]
  );

  /**
   * Bias the searchBox to map's current loaded tiles
   */
  useEffect(
    () => {
      if (mapRef.current) {
        // Make searchbox biased to current map bounds
        const searchBoxBias = mapRef.current.addListener("tilesloaded", () => {
          if (searchBoxRef.current) {
            searchBoxRef.current!.setBounds(
              mapRef.current!.getBounds() as google.maps.LatLngBounds
            );
          }
        });
        return () => google.maps.event.removeListener(searchBoxBias);
      }
    },
    /**
     * searchBoxRef.current and mapRef.current are needed deps to
     * ensure that boundaries are drawn on the current map with
     * the current searchbox results
     */
    // eslint-disable-next-line
    [searchBoxRef.current, mapRef.current]
  );

  /**
   * Handle hovered listing
   */
  useEffect(() => {
    /**
     * Given a hovered listing (which comes from a hovered listing card), change the bg color
     * of that listing's map marker. Color change will happen to either a small marker or large,
     * depending on which current map markers are provided
     * @param hoveredListing FetchedListing | null
     * @param markers google.maps.marker.AdvancedMarkerView[]
     */
    function handleHoveredListing(
      hoveredListing: FetchedListing | undefined,
      markerSize: MapMarkerSize
    ) {
      // Change small marker bg on hover
      if (markerSize === "small") {
        if (hoveredListing) {
          smallMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (mapRef.current) {
                moveMarkerContent(mapRef.current, marker);
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          smallMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);
            clearMarkerContentClassList(marker);
          });
        }

        // Change large marker bg on hover
      } else if (markerSize === "large") {
        if (hoveredListing) {
          largeMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);

            const lat = hoveredListing.data.address.geolocation.value.lat;
            const lng = hoveredListing.data.address.geolocation.value.lng;

            if (marker.position?.lat === lat && marker.position.lng === lng) {
              highlightMarker(marker);
              if (mapRef.current) {
                moveMarkerContent(mapRef.current, marker);
              }
            }
          });

          // Un-highlight all markers when hovered listing is undefined
        } else if (!hoveredListing) {
          largeMarkersRef.current.forEach((marker) => {
            unhighlightMarker(marker);
            clearMarkerContentClassList(marker);
          });
        }
      } else {
        throw new Error(
          `Invalid marker size: ${pageState.mapMarkerSize}. "Marker size must be "small" or "large".`
        );
      }
    }
    if (mapRef.current && mapRef.current.getProjection()) {
      handleHoveredListing(pageState.hoveredListing, pageState.mapMarkerSize);
    }
  }, [pageState.hoveredListing, pageState.mapMarkerSize]);

  /**
   * Handle place change
   */
  useEffect(
    () => {
      function handlePlaceChange() {
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

                console.log(boundaries);

                boundariesRef.current = boundaries;

                setupHideBoundaryBtn(mapRef.current, boundaries);

                setupBoundaryForPlace(
                  mapRef.current,
                  places[0],
                  boundaries,
                  roadmapBoundaryStyle
                );

                // Make the feature layer visible on other map types
                // if (currentMapTypeId !== 'roadmap') {
                //   boundaries.postalCodeBoundaries.setMap(null); // Remove from current map
                //   featureLayer.setMap(map); // Add to the new map with the changed base map type
                // }

                // if (mapTypeIdRef.current === "roadmap") {
                //   console.log("setting road map boundary styling for place");

                //   setupBoundaryForPlace(
                //     mapRef.current,
                //     places[0],
                //     boundaries,
                //     roadmapBoundaryStyle
                //   );
                // } else if (mapTypeIdRef.current === "hybrid") {
                //   console.log("setting hybrid map boundary styling for place");

                //   setupBoundaryForPlace(
                //     mapRef.current,
                //     places[0],
                //     boundaries,
                //     hybridMapBoundaryStyle
                //   );
                // } else if (mapTypeIdRef.current === "terrain") {
                //   console.log("setting terrain map boundary styling for place");

                //   setupBoundaryForPlace(
                //     mapRef.current,
                //     places[0],
                //     boundaries,
                //     terrainMapBoundaryStyle
                //   );
                // } else {
                //   console.warn("setting default boundary styling");

                //   setupBoundaryForPlace(
                //     mapRef.current,
                //     places[0],
                //     boundaries,
                //     roadmapBoundaryStyle
                //   );
                // }

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

  // ***** SAVE FOR LATER *****
  // /**
  //  * Listen for change in mapTypeId
  //  */
  // useEffect(
  //   () => {
  //     if (mapRef.current) {
  //       const mapTypeIdListener = mapRef.current.addListener(
  //         "maptypeid_changed",
  //         () => {
  //           if (mapRef.current) {
  //             const currentMapTypeId = mapRef.current.getMapTypeId();
  //             // console.log("currentMapTypeId: ", currentMapTypeId);

  //             // Make the feature layer visible on other map types
  //             if (currentMapTypeId !== "roadmap") {
  //               console.log("Updating featureLayer styling...");
  //               if (boundariesRef.current) {
  //                 //
  //                 if (placeFilter.place) {
  //                   //
  //                 } else {
  //                   console.log("placeFilter.place is undefined");
  //                 }
  //               } else {
  //                 console.log("boundariesRef.current is undefined");
  //               }
  //             }
  //           } else {
  //             console.log("mapRef.current is undefined");
  //           }
  //         }
  //       );
  //       return () => google.maps.event.removeListener(mapTypeIdListener);
  //     }
  //   },
  //   /**
  //    * searchBoxRef.current and mapRef.current are needed deps to
  //    * ensure that boundaries are drawn on the current map with
  //    * the current searchbox results
  //    */ // eslint-disable-next-line
  //   [
  //     searchBoxRef.current,
  //     mapRef.current,
  //     boundariesRef.current,
  //     place,
  //     dispatch,
  //     navigate,
  //     setupHideBoundaryBtn,
  //   ]
  // );

  return <div className={styles["map"]} ref={mapDivRef} id="map"></div>;
}
