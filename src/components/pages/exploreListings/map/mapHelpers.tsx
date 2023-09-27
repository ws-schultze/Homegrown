import { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { Status } from "@googlemaps/react-wrapper";
import ErrorComponent from "../../../common/error/Error";
import Spinner from "../../../common/loaders/Spinner";
import {
  TypePlacesRegion,
  TypeFetchedListing,
  TypeCoord,
  TypeBoundaries,
} from "../../../..";
import ListingPopup from "../../listingOverlay/ListingPopup";
import { ExploreListingsFilters } from "../ExploreListings";

import css from "./styles.module.css";
import { MapBoundaryBtn } from "./styledComponents";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { setPlace } from "../filters/placeFilter/placeFilterSlice";
import { NavigateFunction } from "react-router";

export function isOfTypePlacesRegion(
  keyInput: string | undefined
): keyInput is TypePlacesRegion {
  return [
    "locality",
    "sublocality",
    "postal_code",
    "country",
    "administrative_area_level_1",
    "administrative_area_level_2",
    undefined,
  ].includes(keyInput);
}

export function renderMap(status: Status): ReactElement {
  if (status === Status.LOADING) return <Spinner size="small" />;
  if (status === Status.FAILURE) return <ErrorComponent />;
  return <Spinner size="small" />;
}

export function getPlaceFromPlaceId(
  map: google.maps.Map,
  placeId: string
): Promise<google.maps.places.PlaceResult> {
  return new Promise((resolve) => {
    // console.log("getting place from placeId");

    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address", "place_id", "geometry", "types"],
    };

    const service = new google.maps.places.PlacesService(map);

    // https://developers.google.com/maps/documentation/javascript/examples/place-details
    service.getDetails(request, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        // console.log("Got place from ID: ", place.formatted_address);
        resolve(place);
      }
    });
  });
}

export function getCurrentListings(
  map: google.maps.Map,
  listings: TypeFetchedListing[]
): TypeFetchedListing[] {
  return listings.filter((listing) =>
    map.getBounds()?.contains(listing.data.address.geolocation.value)
  );
}

/**
 * Get the coordinates of all listings that are within current map bounds (non-filtered listings)
 * @param currentListings TypeFetchedListing[]
 * @returns TypeCoord[]
 */
export function getCurrentListingsCoords(
  currentListings: TypeFetchedListing[]
): TypeCoord[] {
  let coords: TypeCoord[] = [];
  currentListings.forEach((listing) => {
    coords.push(listing.data.address.geolocation.value);
  });
  return coords;
}

/**
 * Check which markers have coordinates in the given array of
 * current filtered coordinates and return those markers
 * @param markers google.maps.marker.AdvancedMarkerView[]
 * @param currentFilteredCoordinates TypeCoord[]
 * @returns  google.maps.marker.AdvancedMarkerView[]
 */
export function getMarkersToShow(
  markers: google.maps.marker.AdvancedMarkerView[],
  currentFilteredListingsCoordinates: TypeCoord[]
): google.maps.marker.AdvancedMarkerView[] {
  const markersToShow: google.maps.marker.AdvancedMarkerView[] = [];

  markers.forEach((marker) => {
    const markerCoords = {
      lat: marker.position?.lat,
      lng: marker.position?.lng,
    };
    currentFilteredListingsCoordinates.forEach((coords) => {
      if (coords.lat === markerCoords.lat && coords.lng === markerCoords.lng) {
        markersToShow.push(marker);
      }
    });
  });

  return markersToShow;
}

/**
 * Return markers that have coordinates not found
 * in the currentFilteredListingsCoords
 * @param markers google.maps.marker.AdvancedMarkerView[]
 * @param coordsToHide TypeCoord[]
 * @returns google.maps.marker.AdvancedMarkerView[]
 */
export function getMarkersToHide(
  markers: google.maps.marker.AdvancedMarkerView[],
  currentFilteredListingsCoords: TypeCoord[]
): google.maps.marker.AdvancedMarkerView[] {
  /**
   * Check if a marker is current. This is used in the filter below.
   */
  function markerIsCurrent(
    marker: google.maps.marker.AdvancedMarkerView
  ): boolean {
    let isCurrent: boolean = false;

    // Check if the marker is current
    currentFilteredListingsCoords.forEach((coords) => {
      if (
        coords.lat === marker.position?.lat &&
        coords.lng === marker.position?.lng
      ) {
        isCurrent = true;
      }
    });
    return isCurrent;
  }

  // Filter uses the opposite truth returned by markerIsCurrent, because
  // only non current markers are what are wanted to hide
  const markersToHide = markers.filter((marker) => !markerIsCurrent(marker));
  // console.log(`markers to hide ${markersToHide.length}`);

  return markersToHide;
}

/**
 * Set the given map on all given markers
 * @param markers google.maps.marker.AdvancedMarkerView[]
 * @param map google.maps.Map
 */
export function showMarkers(
  markers: google.maps.marker.AdvancedMarkerView[],
  map: google.maps.Map
) {
  markers.forEach((marker) => {
    marker.map = map;
  });
}

/**
 * Set the map to null on all given markers
 * @param markers google.maps.marker.AdvancedMarkerView[]
 * @param map google.maps.Map
 */
export function hideMarkers(markers: google.maps.marker.AdvancedMarkerView[]) {
  markers.forEach((marker) => {
    marker.map = null;
  });
}

/**
 * Get the coordinates of all the filtered listings that a currently within map bounds
 * @param filteredListings TypeFetchedListing[]
 */
export function getCurrentFilteredListingsCoords(
  filteredListings: TypeFetchedListing[]
): TypeCoord[] {
  let coords: TypeCoord[] = [];
  filteredListings.forEach((listing) => {
    coords.push(listing.data.address.geolocation.value);
  });
  return coords;
}

/**
 * Return currentListingsCoords that are not found
 * in currentFilteredListingsCoords
 * @param currentListingsCoords TypeCoord[]
 * @param currentFilteredListingsCoords TypeCoord[]
 * @returns TypeCoord[]
 */
export function getCurrentCoordsToHide(
  currentListingsCoords: TypeCoord[],
  currentFilteredListingsCoords: TypeCoord[]
) {
  return currentListingsCoords.filter(
    (coord) => !currentFilteredListingsCoords.includes(coord)
  );
}

export function getCurrentMarkers(
  map: google.maps.Map,
  markers: google.maps.marker.AdvancedMarkerView[]
): google.maps.marker.AdvancedMarkerView[] {
  return markers.filter((marker) =>
    map.getBounds()?.contains(marker.position!)
  );
}

export function getMarkerSize(
  map: google.maps.Map,
  zoomLevelToChangeMarkerSize: number
): "large" | "small" {
  return map.getZoom()! >= zoomLevelToChangeMarkerSize ? "large" : "small";
}

/**
 * Create an Element from the given JSX.Element
 */
export function makeElement({
  component,
  className,
  id,
}: {
  component: JSX.Element;
  className?: string;
  id?: string;
}): Element {
  let div = document.createElement("div");

  if (className) {
    div.classList.add(className);
  }

  if (id) {
    div.id = id;
  }

  const root = ReactDOM.createRoot(div);
  root.render(component);

  return div;
}

/**
 * Creates a popup card for a listing when marker is clicked in mobile size window
 * @param listing TypeFetchedListing
 */
export function makeListingPopup(listing: TypeFetchedListing) {
  const listingPopup = makeElement({
    component: <ListingPopup listing={listing} />,
    className: css["listing-popup"],
  });

  listingPopup.id = `${css["listing-popup"]}-${listing.id}`;

  const rootElement = document.getElementById("root");

  if (rootElement) {
    rootElement.appendChild(listingPopup);
  } else {
    console.log("No root element found ");
  }
}

/**
 * Used on mobile size window to use popups rather than custom info windows for a selected listing
 */
export function toggleMarkerHighlight(
  marker: google.maps.marker.AdvancedMarkerView,
  listing: TypeFetchedListing
) {
  removeAllPopups();

  if (marker.content && marker.element) {
    if (marker.content.classList.contains(css["active"])) {
      // Un-Highlight
      marker.content.classList.remove(css["active"]);
      marker.element.style.zIndex = "";
    } else {
      // Highlight
      unhighlightAllMarkers(); // get rid of highlighting on another marker
      marker.content.classList.add(css["active"]);
      marker.element.style.zIndex = "1";
      makeListingPopup(listing);
    }
  } else {
    throw new Error(
      "Either marker.content and/or marker.element is/are null or undefined"
    );
  }
}

export function removeAllPopups() {
  // console.log("Removing popups");
  const popups = Array.from(
    document.getElementsByClassName(
      css["listing-popup"]
    ) as HTMLCollectionOf<HTMLElement>
  );
  if (popups) {
    popups.forEach((popup: HTMLElement) => {
      // console.log("removing popup: ", popup);
      popup.remove();
    });
  } else {
    throw new Error("no popup(s) found");
  }
}

/**
 * Remove the class "highlight" from marker classlist and remove z-index
 * @param marker google.maps.marker.AdvancedMarkerView
 */
export function unhighlightMarker(
  marker: google.maps.marker.AdvancedMarkerView
) {
  if (marker.content && marker.element) {
    marker.content.classList.remove(css["active"]);
    marker.element.style.zIndex = "";
  } else {
    throw new Error(
      "Either marker.content and/or marker.element is/are null or undefined"
    );
  }
}

export function unhighlightAllMarkers() {
  // Unhighlight all markersSmall
  const markersSmall = Array.from(
    document.getElementsByClassName(
      "map-marker-wrap"
    ) as HTMLCollectionOf<HTMLElement>
  );
  if (markersSmall) {
    markersSmall.forEach((marker: HTMLElement) =>
      marker.classList.remove(css["active"])
    );
  } else {
    console.log(`marker(s) not found`);
  }
}

/**
 * Add the class "highlight" to marker and change z-index to 1
 * @param marker google.maps.marker.AdvancedMarkerView
 */
export function highlightMarker(marker: google.maps.marker.AdvancedMarkerView) {
  if (marker.content && marker.element) {
    marker.content.classList.add(css["active"]);
    marker.element.style.zIndex = "1";
  } else {
    throw new Error(
      "Either marker.content and/or marker.element is/are null or undefined"
    );
  }
}

/**
 * Position the custom info window so that is stays within the window when the marker is hovered
 */
export function moveMarkerContent(
  map: google.maps.Map,
  marker: google.maps.marker.AdvancedMarkerView
  // markerContent: Element
) {
  /**
   * Scale multiplier to use on point values
   */
  const scale = Math.pow(2, map.getZoom()!);

  /**
   *
   */
  const projection = map.getProjection()!;

  /**
   * Get maps bounds (bottom, left, top, right) as lat/lng values
   */
  const bounds = map.getBounds()!;

  /**
   * Point position from lat/Lng of top right and bottom left corners of the maps projection.
   * From these two points we can get a value for top, bottom, left and right map sides.
   * These sides' values will be used to calculate how far the marker is from a given side.
   */
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast())!;
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest())!;

  /**
   * Map sides in point values and to scale
   */
  const mapLeftX = Math.floor(bottomLeft.x * scale);
  const mapRightX = Math.floor(topRight.x * scale);
  const mapTopY = Math.floor(topRight.y * scale);
  const mapBottomY = Math.floor(bottomLeft.y * scale);

  /**
   * Marker position as lat/lng
   */
  const markerLatLng = marker.position!;

  /**
   * Marker (x, y) as point and to scale
   */
  const markerPoint = projection.fromLatLngToPoint(markerLatLng)!;
  const markerX = Math.floor(markerPoint.x * scale);
  const markerY = Math.floor(markerPoint.y * scale);

  /**
   * Distance between markerX and mapLeftX
   * Distance less that 200 triggers move-down
   */
  const distanceToLeft = markerX - mapLeftX;
  // console.log("dToLeft: ", distanceToLeft);

  /**
   * Distance between markerX and mapRightX
   * Distance less that 200 triggers move-down
   */
  const distanceToRight = mapRightX - markerX;
  // console.log("dToRight: ", distanceToRight);

  /**
   * Distance between makerY and mapTopY
   * Distance less that 200 triggers move-down
   */
  const distanceToTop = markerY - mapTopY;

  /**
   * Distance between makerY and mapBottomY
   * Distance less that 200 triggers move-down
   */
  const distanceToBottom = mapBottomY - markerY;

  const element = marker.content?.getElementsByClassName(
    css["info-window"]
  )[0] as HTMLElement;

  if (distanceToLeft < 200 && distanceToTop >= 200 && distanceToBottom >= 200) {
    // Move info window right
    element.classList.add(css["move-right"]);
  } else if (
    distanceToRight < 200 &&
    distanceToTop >= 200 &&
    distanceToBottom >= 200
  ) {
    // Move info window left
    element.classList.add(css["move-left"]);
  } else if (
    distanceToTop < 200 &&
    distanceToLeft >= 200 &&
    distanceToRight >= 200
  ) {
    // Move info window down
    console.log("top y boundary reached");
    element.classList.add(css["move-down"]);
  } else if (distanceToLeft < 200 && distanceToTop < 200) {
    // Move info window southeast
    element.classList.add(css["move-southeast"]);
  } else if (distanceToRight < 200 && distanceToTop < 200) {
    // Move info window southwest
    element.classList.add(css["move-southwest"]);
  } else if (distanceToRight < 200 && distanceToBottom < 200) {
    // Move info window north-west
    element.classList.add(css["move-northwest"]);
  } else if (distanceToLeft < 200 && distanceToBottom < 200) {
    // Move info window north-east
    element.classList.add(css["move-northeast"]);
  } else {
    // Default move is up
    element.classList.add(css["move-up"]);
  }
}

export function setMapOnMarkers(
  map: google.maps.Map,
  zoomLevelToChangeMarkerSize: number,
  smallMarkersToHide: google.maps.marker.AdvancedMarkerView[],
  smallMarkersToShow: google.maps.marker.AdvancedMarkerView[],
  largeMarkersToHide: google.maps.marker.AdvancedMarkerView[],
  largeMarkersToShow: google.maps.marker.AdvancedMarkerView[]
) {
  const zoom = map.getZoom();

  if (zoom) {
    // Hide/Show markers
    if (zoom < zoomLevelToChangeMarkerSize) {
      // Hide small markers
      smallMarkersToHide.forEach((marker) => {
        marker.map = null;
      });

      // Show small markers
      if (map) {
        smallMarkersToShow.forEach((marker) => {
          marker.map = map;
        });
      }
    } else if (zoom >= zoomLevelToChangeMarkerSize) {
      // Hide large markers
      largeMarkersToHide.forEach((marker) => {
        marker.map = null;
      });

      // Show large  markers
      if (map) {
        largeMarkersToShow.forEach((marker) => {
          marker.map = map;
        });
      }
    }
  } else {
    console.log("Zoom is undefined");
  }
}

/**
 * Clear that marker's info window's class list from any position classes (e.g. "moved-right", "moved-left", ... etc)
 * @param marker google.maps.marker.AdvancedMarkerView
 */
export default function clearMarkerContentClassList(
  marker: google.maps.marker.AdvancedMarkerView
) {
  const element = marker.content?.getElementsByClassName(
    css["info-window"]
  )[0] as HTMLElement;
  element.classList.remove(
    css["move-right"],
    css["move-left"],
    css["move-down"],
    css["move-up"],
    css["move-southeast"],
    css["move-southwest"],
    css["move-northeast"],
    css["move-northwest"]
  );
}

export function defineBoundaries(map: google.maps.Map): {
  cityBoundaries: google.maps.FeatureLayer;
  postalCodeBoundaries: google.maps.FeatureLayer;
  countyBoundaries: google.maps.FeatureLayer;
  stateBoundaries: google.maps.FeatureLayer;
  countryBoundaries: google.maps.FeatureLayer;
} {
  // console.log("defining boundaries...");
  //@ts-ignore
  const cityBoundaries = map.getFeatureLayer("LOCALITY");
  //@ts-ignore
  const postalCodeBoundaries = map.getFeatureLayer("POSTAL_CODE");
  //@ts-ignore
  const countyBoundaries = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_2");
  //@ts-ignore
  const stateBoundaries = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");
  //@ts-ignore
  const countryBoundaries = map.getFeatureLayer("COUNTRY");
  // console.log("done defining boundaries");
  return {
    cityBoundaries,
    postalCodeBoundaries,
    countyBoundaries,
    stateBoundaries,
    countryBoundaries,
  };
}

/**
 * Apply styling to a boundary that has the matching Id to the given placeId.
 * @param boundaries object containing all boundary layers to check the places Id against (city, state, postal code, state, county and country)
 * @param placeId string (if the given place is a city, its Id will match a cityBoundaries's Id and thus that particular city boundary will be styled)
 */
export function stylePlaceBoundary(
  placeId: string,
  boundaries: TypeBoundaries,
  style: google.maps.FeatureStyleOptions
) {
  // console.log("styling boundaries...");

  // Apply styling to the city layer
  // @ts-ignore
  boundaries.cityBoundaries.style = (options: {
    feature: { placeId: string };
  }) => {
    if (options.feature.placeId === placeId) {
      return style;
    }
  };

  // Apply styling to the postal code layer
  // @ts-ignore
  boundaries.postalCodeBoundaries.style = (options: {
    feature: { placeId: string };
  }) => {
    if (options.feature.placeId === placeId) {
      return style;
    }
  };

  // Apply styling to the county layer
  // @ts-ignore
  boundaries.countyBoundaries.style = (options: {
    feature: { placeId: string };
  }) => {
    if (options.feature.placeId === placeId) {
      return style;
    }
  };

  // Apply styling to the state layer
  // @ts-ignore
  boundaries.stateBoundaries.style = (options: {
    feature: { placeId: string };
  }) => {
    if (options.feature.placeId === placeId) {
      return style;
    }
  };

  // Apply boundary styling to the country layer
  // @ts-ignore
  boundaries.countryBoundaries.style = (options: {
    feature: { placeId: string };
  }) => {
    if (options.feature.placeId === placeId) {
      return style;
    }
  };

  // console.log("done styling boundaries");
}

export function isFullscreen(element: HTMLElement) {
  return (
    (document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement) == element
  );
}

export function requestFullscreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullScreen) {
    element.msRequestFullScreen();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

export function onClickPanToCurrentLocation(map: google.maps.Map) {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
      },
      () => {
        handleLocationError();
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError();
  }
}

export function handleLocationError() {
  window.alert(
    "Either your browser does not support Geolocation or you have it disabled."
  );
}

/**
 * Apply filters to the given listings and return an array of
 * filtered listings.
 * @param filter TypeListingFilter
 * @returns TypeFetchedListing[]
 */
export function filterListings(
  listings: TypeFetchedListing[],
  filters: ExploreListingsFilters
): TypeFetchedListing[] {
  // console.log("filterListings: starting");

  if (!listings) {
    throw new Error("filterListings: listings are undefined");
  }

  const {
    place,
    forSaleOrRent,
    lowPrice,
    highPrice,
    listingTypes,
    beds,
    baths,
  } = filters;

  // Define array of filtered listings to be returned
  let filtered: TypeFetchedListing[] = listings;

  if (listings.length > 0) {
    // Filter by place if it is defined
    if (place) {
      // console.log("filterListings: filtering by place");

      if (place.types) {
        if (place.name) {
          // Filter by locality/city
          if (place.types?.includes("locality")) {
            // console.log(`filterListings: filtering by locality: `, place.types);
            filtered = listings.filter(
              (listing) => listing.data.address.city.value === place!.name!
            );
          }

          // Filter by postal_code/zipCode
          if (place.types.includes("postal_code")) {
            // console.log("filterListings: filtering by postal_code");
            filtered = listings.filter((listing) =>
              listing.data.address.formattedAddress.value.includes(place!.name!)
            );
          }

          // administrative_area_level_2/County
          if (place.types.includes("administrative_area_level_2")) {
            // console.log("filterListings: filtering by county");
            filtered = listings.filter((listing) =>
              listing.data.address.adminAreaLevel2.value.includes(place!.name!)
            );
          }

          // administrative_area_level_1/State
          if (place.types.includes("administrative_area_level_1")) {
            // console.log("filterListings: filtering by state");

            let _filtered: TypeFetchedListing[] = [];

            listings.forEach((listing) => {
              for (const key in listing.data.address.address_components) {
                if (
                  listing.data.address.address_components[key].types &&
                  listing.data.address.address_components[key].long_name
                ) {
                  if (
                    listing.data.address.address_components[key].types.includes(
                      //@ts-ignore
                      "administrative_area_level_1"
                    ) &&
                    listing.data.address.address_components[
                      key
                    ].long_name.includes(place!.name!)
                  ) {
                    _filtered.push(listing);
                  }
                }
              }
            });

            filtered = _filtered;
          }
        } else {
          console.warn("filterListings: place.name is undefined");
        }
      } else {
        console.warn("filterListings: place.types is undefined");
      }
    } else {
      // console.log("filterListings: place is undefined, moving to next filter");
    }

    // Filter for sale/rent
    if (
      forSaleOrRent &&
      forSaleOrRent !== null &&
      forSaleOrRent.id !== "for-sale-or-rent"
    ) {
      console.log("filterListings: filtering by for-sale/for-rent");
      filtered = filtered.filter(
        (listing) =>
          listing.data.basicInfo.forSaleOrRent.value?.id === forSaleOrRent?.id
      );
    }

    // Filter by price range
    if (
      filtered.length > 0 &&
      ((lowPrice && lowPrice.number) || (highPrice && highPrice.number))
    ) {
      // console.log("filterListings: filtering by price");
      // Filter by both min and max price
      if (lowPrice.value !== "" && highPrice.value !== "") {
        filtered = filtered.filter(
          (listing) =>
            listing.data.basicInfo.price.number >= lowPrice!.number &&
            listing.data.basicInfo.price.number <= highPrice!.number
        );
        // Filter by only min price
      } else if (lowPrice.value !== "" && highPrice.value === "") {
        filtered = filtered.filter(
          (listing) => listing.data.basicInfo.price.number >= lowPrice!.number
        );

        // Filter by only max price
      } else if (lowPrice.value === "" && highPrice.value !== "") {
        filtered = filtered.filter(
          (listing) => listing.data.basicInfo.price.number <= highPrice!.number
        );
      } else {
        // No min or max price defined
      }
    }

    // Filter by listing kinds
    if (filtered.length > 0 && listingTypes && listingTypes.length > 0) {
      // console.log("filterListings: filtering by listing kinds");
      let newFiltered: TypeFetchedListing[] = [];

      // Check each listing's kind against each filter kind
      // If listing kind matches a filter kind, add it to the new array
      filtered.forEach((listing) =>
        listingTypes!.forEach((kind) => {
          if (kind?.id === listing.data.basicInfo.listingKind.value?.id) {
            newFiltered.push(listing);
          }
        })
      );

      filtered = newFiltered;
    }

    // Filter by beds
    if (filtered.length > 0 && beds) {
      // console.log("filterListings: filtering by beds");
      let newFiltered: TypeFetchedListing[] = [];
      filtered.forEach((listing) => {
        // Maybe refactor TypeListingData so that is has a .features prop that contains all possible
        // listing features for all types of listings. This would simplify filtering.
        if (
          listing.data.apartment?.bedrooms.number! >= beds! ||
          listing.data.apartmentBuilding?.bedrooms.number! >= beds! ||
          listing.data.singleFamilyHome?.bedrooms.number! >= beds! ||
          listing.data.multiFamilyHome?.bedrooms.number! >= beds! ||
          listing.data.multiFamilyHomeUnit?.bedrooms.number! >= beds!
        ) {
          newFiltered.push(listing);
        }
      });
      filtered = newFiltered;
    }

    // Filter by baths
    if (filtered.length > 0 && baths !== null) {
      // console.log("filterListings: filtering by baths");
      let newFiltered: TypeFetchedListing[] = [];
      filtered.forEach((listing) => {
        // Maybe refactor TypeListingData so that is has a .features prop that contains all possible
        // listing features for all types of listings. This would simplify filtering.
        if (
          listing.data.apartment?.fullBathrooms.number! +
            listing.data.apartment?.halfBathrooms.number! * 0.5 >=
            baths! ||
          listing.data.apartmentBuilding?.fullBathrooms.number! +
            listing.data.apartmentBuilding?.halfBathrooms.number! * 0.5 >=
            baths! ||
          listing.data.singleFamilyHome?.fullBathrooms.number! +
            listing.data.singleFamilyHome?.halfBathrooms.number! * 0.5 >=
            baths! ||
          listing.data.multiFamilyHome?.fullBathrooms.number! +
            listing.data.multiFamilyHome?.halfBathrooms.number! * 0.5 >=
            baths! ||
          listing.data.multiFamilyHomeUnit?.fullBathrooms.number! +
            listing.data.multiFamilyHomeUnit?.halfBathrooms.number! * 0.5 >=
            baths!
        ) {
          newFiltered.push(listing);
        }
      });
      filtered = newFiltered;
    }
  }

  // filtered.forEach((l, i) => {
  //   console.log(`filterListings: returning listing-${i}: ${l}`);
  // });

  // console.log("filterListings: done");

  return filtered;
}

export function getCurrentFilteredListings(
  allFilteredListings: TypeFetchedListing[],
  currentListings: TypeFetchedListing[]
): TypeFetchedListing[] {
  const currentFilteredListings: TypeFetchedListing[] = [];

  allFilteredListings.forEach((fl) => {
    const flCoords = {
      lat: fl.data.address.geolocation.value.lat,
      lng: fl.data.address.geolocation.value.lng,
    };
    currentListings.forEach((cl) => {
      const clCoords = {
        lat: cl.data.address.geolocation.value.lat,
        lng: cl.data.address.geolocation.value.lng,
      };
      if (clCoords.lat === flCoords.lat && clCoords.lng === clCoords.lng) {
        currentFilteredListings.push(fl);
      }
    });
  });

  return currentFilteredListings;
}

export function getNonCurrentFilteredMarkers(
  markers: google.maps.marker.AdvancedMarkerView[],
  currentFilteredListings: TypeFetchedListing[]
): google.maps.marker.AdvancedMarkerView[] {
  /**
   * Check if a marker is current. This is used in the filter below.
   */
  function markerIsCurrent(
    marker: google.maps.marker.AdvancedMarkerView
  ): boolean {
    let isCurrent: boolean = false;

    // Check if the marker is current
    currentFilteredListings.forEach((cfl) => {
      const clfCoords = {
        lat: cfl.data.address.geolocation.value.lat,
        lng: cfl.data.address.geolocation.value.lng,
      };

      if (
        clfCoords.lat === marker.position?.lat &&
        clfCoords.lng === marker.position?.lng
      ) {
        isCurrent = true;
      }
    });
    return isCurrent;
  }

  // Filter uses the opposite truth returned by markerIsCurrent, because
  // only non current markers are what are wanted to hide
  const nonCurrentFilteredMarkers = markers.filter(
    (marker) => !markerIsCurrent(marker)
  );

  return nonCurrentFilteredMarkers;
}

export function getCurrentFilteredMarkers(
  markers: google.maps.marker.AdvancedMarkerView[],
  currentFilteredListings: TypeFetchedListing[]
): google.maps.marker.AdvancedMarkerView[] {
  /**
   * Check if a marker is current. This is used in the filter below.
   */
  function markerIsCurrent(
    marker: google.maps.marker.AdvancedMarkerView
  ): boolean {
    let isCurrent: boolean = false;

    // Check if the marker is current
    currentFilteredListings.forEach((cfl) => {
      const clfCoords = {
        lat: cfl.data.address.geolocation.value.lat,
        lng: cfl.data.address.geolocation.value.lng,
      };

      if (
        clfCoords.lat === marker.position?.lat &&
        clfCoords.lng === marker.position?.lng
      ) {
        isCurrent = true;
      }
    });
    return isCurrent;
  }

  // Filter uses the opposite truth returned by markerIsCurrent, because
  // only non current markers are what are wanted to hide
  const currentFilteredMarkers = markers.filter((marker) =>
    markerIsCurrent(marker)
  );

  return currentFilteredMarkers;
}

/**
 * Hide and show the appropriate filtered markers
 * @param map google.maps.Map
 * @param smallMarkers google.maps.marker.AdvancedMarkerView[]
 * @param largeMarkers google.maps.marker.AdvancedMarkerView[]
 * @param minZoomForLargeMarkers number
 * @param currentFilteredListings TypeFetchedListing[]
 */
export function updateMarkers(
  map: google.maps.Map,
  smallMarkers: google.maps.marker.AdvancedMarkerView[],
  largeMarkers: google.maps.marker.AdvancedMarkerView[],
  minZoomForLargeMarkers: number,
  currentFilteredListings: TypeFetchedListing[]
) {
  if (map && smallMarkers && largeMarkers) {
    const markerSize = getMarkerSize(map, minZoomForLargeMarkers);
    const currentLargeMarkers = getCurrentMarkers(map, largeMarkers);
    const currentSmallMarkers = getCurrentMarkers(map, smallMarkers);

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
      smallMarkers,
      currentFilteredListings
    );
    const nonCurrentFilteredLargeMarkers = getNonCurrentFilteredMarkers(
      largeMarkers,
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
  } else {
    console.warn("Escaped");
  }
}

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
export function setupBoundaryForPlace(
  map: google.maps.Map,
  place: google.maps.places.PlaceResult,
  boundaries: TypeBoundaries,
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

    // boundsRef.current = bounds;
    // Apply extended bounds to map if user has not
    // already set a place filter. This will prevent
    // a theme change from resetting the bounds and
    // thus the zoom and center of the map.
    if (boundaries == null) map.fitBounds(bounds);

    // boundariesRef.current = boundaries;
    // map.fitBounds(bounds);

    // Apply styling to place boundary
    stylePlaceBoundary(place.place_id, boundaries, boundaryStyle);
  } else {
    console.warn("place object is mission some information");
  }
}

// /**
//  * Given a placeId, style the boundary for it, add event listeners to the boundary buttons and fit the bounds to cover the map.
//  * // https://developers.google.com/maps/documentation/javascript/examples/place-details
//  * @param placeId string
//  * @param map google.maps.Map
//  * @param hideBoundaryBtn HTMLElement
//  * @param showBoundaryBtn HTMLElement
//  * @param boundaryStyling  google.maps.FeatureStyleOptions
//  * @param boundaries {
//     cityBoundaries: google.maps.FeatureLayer;
//     postalCodeBoundaries: google.maps.FeatureLayer;
//     countyBoundaries: google.maps.FeatureLayer;
//     stateBoundaries: google.maps.FeatureLayer;
//     countryBoundaries: google.maps.FeatureLayer;
//   }
//  */
//   function setupBoundaryForPlace(
//     map: google.maps.Map,
//     place: google.maps.places.PlaceResult,
//     boundaries: TypeBoundaries,
//     boundaryStyle: google.maps.FeatureStyleOptions
//   ) {
//     if (place && place.geometry && place.geometry.location && place.place_id) {
//       const bounds = new google.maps.LatLngBounds();
//       // Extend bounds to include place
//       if (place.geometry.viewport) {
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }

//       map.fitBounds(bounds);

//       boundariesRef.current = boundaries;

//       stylePlaceBoundary(place.place_id, boundaries, boundaryStyle);
//     } else {
//       console.warn("place object is missing some information");
//     }
//   }

// /**
//  * Hide and show the appropriate filtered markers
//  * @param map google.maps.Map
//  * @param smallMarkers google.maps.marker.AdvancedMarkerView[]
//  * @param largeMarkers google.maps.marker.AdvancedMarkerView[]
//  * @param minZoomForLargeMarkers number
//  * @param currentFilteredListings TypeFetchedListing[]
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
//       listingTypes: listingTypeFilter.selectedItems,
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
