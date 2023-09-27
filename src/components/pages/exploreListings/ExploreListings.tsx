import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";

import BedAndBathFilter from "./filters/bedAndBathFilter/BedAndBathFilter";
import {
  FiltersBar,
  ListingCards,
  ListingCardsWrap,
  MapContainer,
  Page,
  PageWrap,
  SearchBox,
  SearchResultsHeader,
} from "./styledComponents";
import Footer from "../../common/footer/Footer";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "./map/mapHelpers";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setHoveredListing, setListingToOverlay } from "./exploreListingsSlice";
import ExploreListingsMap from "./map/ExploreListingsMap";
import ListingOverlay from "../listingOverlay/ListingOverlay";
import ForSaleOrRentFilter from "./filters/forSaleOrRentFilter/ForSaleOrRentFilter";
import PriceFilter from "./filters/priceFilter/PriceFilter";
import ListingsTypeFilter from "./filters/listingTypeFilter/ListingTypeFilter";
import ListingCard from "../../common/listingCard/ListingCard";
import { ListingTypeValue, TypeForSaleOrRentValue, TypeStr } from "../../..";

export interface ExploreListingsFilters {
  place: google.maps.places.PlaceResult | undefined;
  forSaleOrRent: TypeForSaleOrRentValue;
  lowPrice: TypeStr;
  highPrice: TypeStr;
  listingTypes: ListingTypeValue[];
  beds: number | null;
  baths: number | null;
}

export default function ExploreListings(): JSX.Element {
  console.log("ExploreListings: rendering");
  const dispatch = useDispatch();
  const commonState = useAppSelector((state) => state.common);
  const pageState = useAppSelector((state) => state.exploreListings);
  const placeFilter = useAppSelector((state) => state.placeFilter);
  let place: google.maps.places.PlaceResult | undefined = undefined;
  if (placeFilter.place) {
    place = JSON.parse(placeFilter.place);
  }
  const params = useParams();
  const listingCardRefs = useRef([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  /**
   * Set the listing to overlay
   */
  useEffect(() => {
    /**
     * Find a listing that has the same formatted address as the one provided
     * in the params
     * @returns TypeFetchedListing | undefined
     */
    function handleListingToOverlay() {
      if (!params.listingAddress) {
        // console.log(
        //   `Effect: handleListingToOverlay: dispatching listingToOverlay `
        // );
        dispatch(setListingToOverlay(undefined));
      } else if (params.listingAddress) {
        if (commonState.listings) {
          commonState.listings.forEach((listing) => {
            if (
              listing.data.address.formattedAddress.value ===
              params.listingAddress
            ) {
              console.log(
                `Effect: handleListingToOverlay: dispatching listingToOverlay `
              );
              dispatch(setListingToOverlay(listing));
            }
          });
        } else {
          console.log("no listings found");
        }
      }
    }
    handleListingToOverlay();
  }, [params.listingAddress, commonState.listings, dispatch]);

  /**
   * Sync the searchbox value with placeFilter.place
   */
  useEffect(() => {
    // console.log(
    //   "Effect: syncing searchRef.current with placeFilter.place.formatted_address"
    // );
    if (searchRef && searchRef.current && !place) {
      searchRef.current.value = "";
    }
    if (searchRef && searchRef.current && place && place.formatted_address) {
      searchRef.current.value = place.formatted_address;
    }
  }, [place]);

  // useEffect(() => {
  //   console.log("Effect: Map container div changed");
  // }, [mapRef.current]);

  return (
    <PageWrap id="map-page-wrap">
      <Page>
        <FiltersBar id="map-page-filters-bar">
          <SearchBox
            type="search"
            id="place-filter-searchbox"
            placeholder="City, PostalCode, County, or State"
            ref={searchRef}
            defaultValue={place ? place.formatted_address : ""}
          />

          <ForSaleOrRentFilter />
          <PriceFilter />
          <ListingsTypeFilter />
          <BedAndBathFilter />
        </FiltersBar>

        <main>
          <ListingCardsWrap>
            <ListingCards>
              {!place && !params.placeFormattedAddress ? (
                <SearchResultsHeader
                  style={{ border: " 2px solid orange" }}
                >{`Enter a location 👆 to search for listings`}</SearchResultsHeader>
              ) : null}

              {place ? (
                <SearchResultsHeader>
                  {`Search results for ${
                    place ? place.formatted_address : null
                  }`}
                  <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                </SearchResultsHeader>
              ) : null}

              {!place ? (
                <SearchResultsHeader>
                  <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                </SearchResultsHeader>
              ) : null}

              <ul>
                {pageState.currentFilteredListings.length > 0
                  ? pageState.currentFilteredListings.map((listing, i) => (
                      <li
                        key={i}
                        ref={listingCardRefs.current[i]}
                        onMouseEnter={() => {
                          dispatch(setHoveredListing(listing));
                        }}
                        onMouseLeave={() => {
                          dispatch(setHoveredListing(undefined));
                        }}
                      >
                        <ListingCard key={listing.id} listing={listing} />
                      </li>
                    ))
                  : null}
              </ul>
              <Footer />
            </ListingCards>
          </ListingCardsWrap>

          <Wrapper
            apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
            render={renderMap}
            version="beta"
            libraries={["places", "marker"]}
          >
            <MapContainer>
              <ExploreListingsMap />
            </MapContainer>
          </Wrapper>
        </main>
      </Page>
      {pageState.listingToOverlay ? <ListingOverlay /> : null}
    </PageWrap>
  );
}
