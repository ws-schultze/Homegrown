import { useEffect } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import {
  filterListings,
  getCurrentFilteredMarkers,
  getCurrentListings,
  getCurrentMarkers,
  getMarkerSize,
  getNonCurrentFilteredMarkers,
  hideMarkers,
  showMarkers,
} from "../mapHelpers";
import { useDispatch } from "react-redux";
import {
  setAllFilteredListings,
  setCurrentFilteredListings,
} from "../../exploreListingsPageSlice";

export default function useUpdateMarkers(
  map: google.maps.Map | undefined,
  smallMarkers: google.maps.marker.AdvancedMarkerView[],
  largeMarkers: google.maps.marker.AdvancedMarkerView[]
) {
  const pageState = useAppSelector((s) => s.exploreListings);
  const commonState = useAppSelector((s) => s.common);
  const placeFilter = useAppSelector((s) => s.placeFilter);
  const forSaleOrRentFilter = useAppSelector((s) => s.forSaleOrRentFilter);
  const priceFilter = useAppSelector((s) => s.priceFilter);
  const listingTypeFilter = useAppSelector((s) => s.listingTypeFilter);
  const bedAndBathFilter = useAppSelector((s) => s.bedAndBathFilter);
  const dispatch = useDispatch();

  useEffect(() => {
    if (map && smallMarkers && largeMarkers) {
      const markerSize = getMarkerSize(
        map,
        pageState.mapMinZoomForLargeMarkers
      );
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
        // smallMarkersRef.current,
        smallMarkers,
        currentFilteredListings
      );
      const nonCurrentFilteredLargeMarkers = getNonCurrentFilteredMarkers(
        // largeMarkersRef.current,
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

      dispatch(setAllFilteredListings(allFilteredListings));
      dispatch(setCurrentFilteredListings(currentFilteredListings));
    } else {
      // console.info("Waiting for map and markers to load...");
    }
  }, [
    map,
    smallMarkers,
    largeMarkers,
    placeFilter.place,
    pageState.mapZoom,
    pageState.mapMinZoomForLargeMarkers,
    pageState.currentListings,
    forSaleOrRentFilter.selectedItem,
    priceFilter.lowPrice,
    priceFilter.highPrice,
    listingTypeFilter.selectedTypes,
    bedAndBathFilter.beds,
    bedAndBathFilter.baths,
    commonState.listings,
    dispatch,
  ]);
}
