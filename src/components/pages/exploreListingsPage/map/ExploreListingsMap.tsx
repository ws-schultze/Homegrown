import { useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ReactComponent as ImageSVG } from "../../../../assets/svg/image-regular.svg";
import { Boundaries, FetchedListing } from "../../../../types/index";
import { useNavigate } from "react-router-dom";
import { MapBoundaryBtn } from "./styledComponents";
import clearMarkerContentClassList, {
  highlightMarker,
  makeElement,
  moveMarkerContent,
  unhighlightMarker,
} from "./mapHelpers";

import styles from "./exploreListingsMap.module.scss";

import {
  setHoveredListing,
  setListingToOverlay,
  setShowFullOverlay,
} from "../exploreListingsPageSlice";
import { setPlace } from "../../../shared/listingFilters/placeFilter/placeFilterSlice";
import { MapType } from "../../../shared/mapTypeMenu/mapTypeMenuSlice";
import { useDispatch } from "react-redux";
import { useMapContext } from "../../../../MapProvider";
import useSetupMapZoomControls from "./hooks/useSetupMapZoomControls";
import { roadmapBoundaryStyle } from "./mapStyles";
import { useScreenSizeContext } from "../../../../ScreenSizeProvider";
import useMakeFullScreenBtn from "./hooks/useMakeFullScreenBtn";
import useUpdateMarkers from "./hooks/useUpdateMarkers";
import useInitializeMap from "./hooks/useInitializeMap";
import useFadeInMapOnLoad from "./hooks/useFadeInMapOnLoad";
import useFadeOnThemeChange from "./hooks/useFadeOnThemeChange";
import useMapIdleEvent from "./hooks/useMapIdleEvent";
import useSearchboxBias from "./hooks/useSearchboxBias";
import useHighlightHoveredListingMarker from "./hooks/useHighlightHoveredListingMarker";
import usePlaceFilter from "./hooks/usePlaceFilter";
import { useAppSelector } from "../../../../redux/hooks";

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

export default function ExploreListingsMap(): JSX.Element {
  // console.log("Map: rendering");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screenSize = useScreenSizeContext();
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
  // const pageState = useAppSelector((state) => state.exploreListings);

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
      console.log("makeMarkers called...");
      let markers: google.maps.marker.AdvancedMarkerView[] = [];

      listings.forEach((listing, i) => {
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
                dispatch(setListingToOverlay(listing));
                if (screenSize === "desktop") {
                  dispatch(setShowFullOverlay(true));
                }
              }}

              // Clicking will show a mobile layover preview
            >
              {screenSize === "desktop" ? (
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
              ) : screenSize === "mobile" ? (
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
                  } `}
                  onClick={() => {
                    dispatch(setHoveredListing(listing));
                  }}
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
                  onClick={() => {
                    dispatch(setHoveredListing(listing));
                  }}
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
                if (screenSize === "desktop") {
                  moveMarkerContent(map, marker);
                }
              }
            });
          });

          ["blur", "pointerleave"].forEach((event) => {
            element.addEventListener(event, () => {
              unhighlightMarker(marker);
              if (screenSize === "desktop") {
                clearMarkerContentClassList(marker);
              }
            });
          });
        } else {
          // marker.addListener("click", () => {
          //   toggleMarkerHighlight(marker, listing);
          // });
        }

        markers.push(marker);
      });

      return markers;
    },
    [navigate, dispatch]
  );

  // /**
  //  * Hide and show the appropriate filtered markers
  //  * @param map google.maps.Map
  //  * @param smallMarkers google.maps.marker.AdvancedMarkerView[]
  //  * @param largeMarkers google.maps.marker.AdvancedMarkerView[]
  //  * @param minZoomForLargeMarkers number
  //  * @param currentFilteredListings FetchedListing[]
  //  */
  // function updateMarkers(
  //   map: google.maps.Map,
  //   smallMarkers: google.maps.marker.AdvancedMarkerView[],
  //   largeMarkers: google.maps.marker.AdvancedMarkerView[],
  //   minZoomForLargeMarkers: number
  // ) {
  //   if (map && smallMarkers && largeMarkers) {
  //     const markerSize = getMarkerSize(map, minZoomForLargeMarkers);
  //     const currentLargeMarkers = getCurrentMarkers(map, largeMarkers);
  //     const currentSmallMarkers = getCurrentMarkers(map, smallMarkers);
  //     const allFilteredListings = filterListings(commonState.listings, {
  //       place: placeFilter.place ? JSON.parse(placeFilter.place) : undefined,
  //       forSaleOrRent: forSaleOrRentFilter.selectedItem,
  //       lowPrice: priceFilter.lowPrice,
  //       highPrice: priceFilter.highPrice,
  //       listingTypes: listingTypeFilter.selectedTypes,
  //       beds: bedAndBathFilter.beds,
  //       baths: bedAndBathFilter.baths,
  //     });

  //     const currentFilteredListings = getCurrentListings(
  //       map,
  //       allFilteredListings
  //     );

  //     // Markers to show
  //     const currentFilteredSmallMarkers = getCurrentFilteredMarkers(
  //       currentSmallMarkers,
  //       currentFilteredListings
  //     );
  //     const currentFilteredLargeMarkers = getCurrentFilteredMarkers(
  //       currentLargeMarkers,
  //       currentFilteredListings
  //     );

  //     // Markers to hide
  //     const nonCurrentFilteredSmallMarkers = getNonCurrentFilteredMarkers(
  //       smallMarkersRef.current,
  //       currentFilteredListings
  //     );
  //     const nonCurrentFilteredLargeMarkers = getNonCurrentFilteredMarkers(
  //       largeMarkersRef.current,
  //       currentFilteredListings
  //     );

  //     // Hide/Show markers
  //     if (markerSize === "small") {
  //       hideMarkers(nonCurrentFilteredSmallMarkers);
  //       hideMarkers(largeMarkers);
  //       showMarkers(currentFilteredSmallMarkers, map);
  //     } else if (markerSize === "large") {
  //       hideMarkers(nonCurrentFilteredLargeMarkers);
  //       hideMarkers(smallMarkers);
  //       showMarkers(currentFilteredLargeMarkers, map);
  //     }

  //     dispatch(setAllFilteredListings(allFilteredListings));
  //     dispatch(setCurrentFilteredListings(currentFilteredListings));
  //   } else {
  //     console.warn("Escaped");
  //   }
  // }

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
   * NOTICE: Data-driven styling for boundaries only works on roadmap
   */
  // useSetupMapTypeIdControls(mapRef.current);
  useEffect(() => {
    console.log("useEffect: commonState.listings changed");
  }, [commonState.listings]);

  useInitializeMap(
    mapDivRef,
    currentMapId,
    roadmapBoundaryStyle,
    smallMarkersRef,
    largeMarkersRef,
    mapRef,
    searchBoxRef,
    setupHideBoundaryBtn,
    boundariesRef,
    makeMarkers
  );

  useFadeInMapOnLoad(mapRef, mapDivRef);

  useFadeOnThemeChange(mapDivRef, currentMapId);

  useMapIdleEvent(mapRef, currentMapId);

  useSetupMapZoomControls(mapRef.current);

  useMakeFullScreenBtn({ mapRef, screenSize });

  useUpdateMarkers(
    mapRef.current,
    smallMarkersRef.current,
    largeMarkersRef.current
  );

  useSearchboxBias(mapRef, searchBoxRef);

  useHighlightHoveredListingMarker(mapRef, smallMarkersRef, largeMarkersRef);

  usePlaceFilter(
    mapRef,
    searchBoxRef,
    mapTypeIdRef,
    boundariesRef,
    roadmapBoundaryStyle,
    largeMarkersRef,
    smallMarkersRef,
    setupHideBoundaryBtn
  );

  return <div className={styles["map"]} ref={mapDivRef} id="map"></div>;
}
