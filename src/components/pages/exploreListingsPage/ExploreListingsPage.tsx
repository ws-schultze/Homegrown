import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import BedAndBathFilter from "./filters/bedAndBathFilter/BedAndBathFilter";
import Footer from "../../shared/footer/Footer";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "./map/mapHelpers";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import {
  setHoveredListing,
  setListingToOverlay,
} from "./exploreListingsPageSlice";
import ExploreListingsMap from "./map/ExploreListingsMap";
import ForSaleOrRentFilter from "./filters/forSaleOrRentFilter/ForSaleOrRentFilter";
import PriceFilter from "./filters/priceFilter/PriceFilter";
import ListingsTypeFilter from "./filters/listingTypeFilter/ListingTypeFilter";
import ListingCard from "../../shared/listingCard/ListingCard";
import {
  ListingKindValue,
  ForSaleOrRentValue,
  Str,
  DropdownStyles,
} from "../../../types/index";
import styles from "./exploreListingsPage.module.scss";
import ListingOverlayPage from "../listingOverlay/ListingOverlayPage";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
import { ReactComponent as SlidersSVG } from "./assets/sliders-solid.svg";
import { ReactComponent as CloseSVG } from "./assets/closeIcon.svg";

/**
 * Passed to styled components for styling on desktop screen size
 */
const desktopDropdownStyle: DropdownStyles = {
  btnWidth: "260px",
  btnHeight: "50px",
  menuMinWidth: "100%",
  menuMaxWidth: "fit-content",
};

/**
 * Passed to styled components for styling on mobile screen size
 */
const mobileDropdownStyle: DropdownStyles = {
  btnWidth: "100%",
  btnHeight: "55px",
  menuMinWidth: "100%",
  menuMaxWidth: "100%",
};

export interface ExploreListingsFilters {
  place: google.maps.places.PlaceResult | undefined;
  forSaleOrRent: ForSaleOrRentValue;
  lowPrice: Str;
  highPrice: Str;
  listingTypes: ListingKindValue[];
  beds: number | null;
  baths: number | null;
}

export default function ExploreListingsDesktop(): JSX.Element {
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
  // const mapRef = useRef<HTMLDivElement | null>(null);
  const screenSize = useScreenSizeContext();
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const filtersMenuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Set the listing to overlay
   */
  useEffect(() => {
    /**
     * Find a listing that has the same formatted address as the one provided
     * in the params
     * @returns FetchedListing | undefined
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

  /**
   * Hide and show the filters menu
   */
  function toggleFiltersMenu() {
    setShowFiltersMenu(!showFiltersMenu);
  }

  /**
   * DESKTOP RENDER
   */
  if (screenSize === "desktop") {
    return (
      <div className={styles.container}>
        <div className={styles.page}>
          <div className={styles.filters}>
            <input
              className={styles["search-box"]}
              type="search"
              id="place-filter-searchbox"
              placeholder="City, PostalCode, County, or State"
              ref={searchRef}
              defaultValue={place ? place.formatted_address : ""}
            />

            <ForSaleOrRentFilter styles={desktopDropdownStyle} />
            <PriceFilter styles={desktopDropdownStyle} />
            <ListingsTypeFilter styles={desktopDropdownStyle} />
            <BedAndBathFilter styles={desktopDropdownStyle} />
          </div>

          <div className={styles["page-content"]}>
            <div className={styles["listing-cards-container"]}>
              <div className={styles["listing-cards"]}>
                {!place && !params.placeFormattedAddress ? (
                  <div
                    className={styles["search-results-header"]}
                    style={{ border: " 2px solid orange" }}
                  >{`Enter a location 👆 to search for listings`}</div>
                ) : null}

                {place ? (
                  <div className={styles["search-results-header"]}>
                    {`Search results for ${
                      place ? place.formatted_address : null
                    }`}
                    <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                  </div>
                ) : null}

                {!place ? (
                  <div className={styles["search-results-header"]}>
                    <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                  </div>
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
              </div>
            </div>

            <Wrapper
              apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
              render={renderMap}
              version="beta"
              libraries={["places", "marker"]}
            >
              <div className={styles["map-container"]}>
                <ExploreListingsMap isMobile={false} />
              </div>
            </Wrapper>
          </div>
        </div>
        {pageState.listingToOverlay ? <ListingOverlayPage /> : null}
      </div>
    );
  }

  /**
   * MOBILE RENDER
   */
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <Wrapper
          apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
          render={renderMap}
          version="beta"
          libraries={["places", "marker"]}
        >
          <div className={`${styles["map-container"]}  ${styles.mobile}`}>
            <ExploreListingsMap isMobile={true} />
          </div>
        </Wrapper>

        <button
          type="button"
          id="filters-menu-btn"
          className={styles["m-filters-btn"]}
          onClick={toggleFiltersMenu}
        >
          {/* <label htmlFor="filters-menu-btn">Filters</label> */}
          <SlidersSVG />
        </button>

        <div
          className={`${styles["m-filters"]} ${
            showFiltersMenu ? styles["is-open"] : styles["is-closed"]
          }`}
          ref={filtersMenuRef}
        >
          <button
            type="button"
            id="filters-menu-btn"
            className={styles["m-filters-close-btn"]}
            onClick={toggleFiltersMenu}
          >
            <CloseSVG />
          </button>

          <div className={styles["search-box-container"]}>
            <input
              className={styles["m-search-box"]}
              type="search"
              id="place-filter-searchbox"
              placeholder="City, PostalCode, County, or State"
              ref={searchRef}
              defaultValue={place ? place.formatted_address : ""}
            />
          </div>

          <ForSaleOrRentFilter styles={mobileDropdownStyle} />
          <PriceFilter styles={mobileDropdownStyle} />
          <ListingsTypeFilter styles={mobileDropdownStyle} />
          <BedAndBathFilter styles={mobileDropdownStyle} />
        </div>

        {/* <div className={styles["page-content"]}>
          <div className={styles["listing-cards-container"]}>
            <div className={styles["listing-cards"]}>
              {!place && !params.placeFormattedAddress ? (
                <div
                  className={styles["search-results-header"]}
                  style={{ border: " 2px solid orange" }}
                >{`Enter a location 👆 to search for listings`}</div>
              ) : null}

              {place ? (
                <div className={styles["search-results-header"]}>
                  {`Search results for ${
                    place ? place.formatted_address : null
                  }`}
                  <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                </div>
              ) : null}

              {!place ? (
                <div className={styles["search-results-header"]}>
                  <p>{`Found ${pageState.currentFilteredListings.length} listings`}</p>
                </div>
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
            </div>
          </div>


        </div> */}
      </div>
      {pageState.listingToOverlay ? <ListingOverlayPage /> : null}
    </div>
  );
}
