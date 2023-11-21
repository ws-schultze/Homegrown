import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import BedAndBathFilter from "../../shared/listingFilters/bedAndBathFilter/BedAndBathFilter";
import Footer from "../../shared/footer/Footer";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "./map/mapHelpers";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setHoveredListing } from "./exploreListingsPageSlice";
import ExploreListingsMap from "./map/ExploreListingsMap";
import ForSaleOrRentFilter from "../../shared/listingFilters/forSaleOrRentFilter/ForSaleOrRentFilter";
import ListingTypeFilter from "../../shared/listingFilters/listingTypeFilter/ListingTypeFilter";
import PriceFilter from "../../shared/listingFilters/priceFilter/PriceFilter";
import ListingCard from "../../shared/listingCard/ListingCard";
import {
  ListingKindValue,
  ForSaleOrRentValue,
  Str,
} from "../../../types/index";
import styles from "./exploreListingsPage.module.scss";
import DesktopListingOverlayPage from "../listingOverlayPage/desktop/DesktopListingOverlayPage";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
import { ReactComponent as SlidersSVG } from "./assets/sliders-solid.svg";
import { AbsDropdownMenu } from "../../shared/dropdownWrappers/types";
import MobileListingOverlayPage from "../listingOverlayPage/mobile/MobileListingOverlayPage";
import MobileOverlayCard from "./map/mobileOverlayCard/MobileOverlayCard";

const dDropdownBtnStyle = {
  height: "50px",
  width: "260px",
};

const mDropdownBtnStyle = {
  height: "55px",
  width: "100%",
};

const mDropdownMenuStyle = {
  // height: "100%",
  // width: "100%",
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

export default function ExploreListingsPage(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useAppSelector((state) => state.exploreListings);
  const placeFilter = useAppSelector((state) => state.placeFilter);
  let place: google.maps.places.PlaceResult | undefined = undefined;
  if (placeFilter.place) {
    place = JSON.parse(placeFilter.place);
  }
  const listingCardRefs = useRef([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const screenSize = useScreenSizeContext();
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const filtersMenuRef = useRef<HTMLDivElement | null>(null);
  const openFiltersMenuBtnRef = useRef<HTMLButtonElement | null>(null);

  // /**
  //  * Set the listing to overlay
  //  */
  // useEffect(() => {
  //   /**
  //    * Find a listing that has the same formatted address as the one provided
  //    * in the params
  //    * @returns FetchedListing | undefined
  //    */
  //   function handleListingToOverlay() {
  //     if (!params.listingAddress) {
  //       dispatch(setListingToOverlay(undefined));
  //     } else if (params.listingAddress) {
  //       if (commonState.listings) {
  //         commonState.listings.forEach((listing) => {
  //           if (
  //             listing.data.address.formattedAddress.value ===
  //             params.listingAddress
  //           ) {
  //             dispatch(setListingToOverlay(listing));
  //           }
  //         });
  //       } else {
  //         console.log("no listings found");
  //       }
  //     }
  //   }
  //   handleListingToOverlay();
  // }, [params.listingAddress, commonState.listings, dispatch]);

  /**
   * Sync the url with the listing to overlay
   */
  useEffect(() => {
    function handler() {
      if (pageState.showFullListingOverlay) {
        if (pageState.listingToOverlay) {
          navigate(
            `/explore-listings/details/${pageState.listingToOverlay.data.address.formattedAddress.value}/${pageState.listingToOverlay.id}`
          );
        } else {
          console.error(`No listing to overlay was found`);
        }
      } else if (!pageState.showFullListingOverlay) {
        if (placeFilter.place) {
          const place = JSON.parse(placeFilter.place);
          const address = place.formatted_address;
          if (address) {
            navigate(`/explore-listings/${address}`);
          } else {
            console.error("No formatted_address was found on <place>");
          }
        } else if (placeFilter.place === undefined) {
          navigate(`/explore-listings`);
        } else {
          console.warn("escaped");
          const path = ``;
          return path;
        }
      } else {
        console.error(
          `A non boolean value was found where is should only be boolean`
        );
      }
    }
    handler();
  }, [pageState.showFullListingOverlay]);

  /**
   * Sync the searchbox value with placeFilter.place
   */
  useEffect(() => {
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
   * Close filters menu when clicking outside of it
   */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;

      // if menu is open and click outside it, close menu
      if (showFiltersMenu) {
        if (filtersMenuRef.current) {
          if (!filtersMenuRef.current.contains(t)) {
            // ignore clicks on the filter menu btn
            if (openFiltersMenuBtnRef.current) {
              if (!openFiltersMenuBtnRef.current.contains(t)) {
                setShowFiltersMenu(false);
              }
            }
          }
        }
      }
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [filtersMenuRef, showFiltersMenu, openFiltersMenuBtnRef]);

  /**
   * DESKTOP RENDER
   */
  if (screenSize === "desktop") {
    return (
      <div className={styles.container}>
        <div className={styles.filters}>
          <input
            className={styles["search-box"]}
            type="search"
            id="place-filter-searchbox"
            placeholder="City, PostalCode, County, or State"
            ref={searchRef}
            defaultValue={place ? place.formatted_address : ""}
          />

          <ForSaleOrRentFilter<AbsDropdownMenu>
            menuKind="absolute"
            label="For Sale or Rent"
            btnStyles={dDropdownBtnStyle}
          />

          <PriceFilter<AbsDropdownMenu>
            menuKind="absolute"
            label="Price Range"
            btnStyles={dDropdownBtnStyle}
          />

          <ListingTypeFilter<AbsDropdownMenu>
            menuKind="absolute"
            label="Listing Type"
            btnStyles={dDropdownBtnStyle}
          />

          <BedAndBathFilter<AbsDropdownMenu>
            menuKind="absolute"
            label="Beds and Baths"
            btnStyles={dDropdownBtnStyle}
            menuStyles={{
              minWidth: "fit-content",
              right: "0",
              left: "unset",
            }}
          />
        </div>

        <div className={styles["content"]}>
          <div className={styles["listing-cards-container"]}>
            <div className={styles["listing-cards"]}>
              {pageState.currentFilteredListings.length === 0 && !place ? (
                <div className={styles["search-results-header"]}>
                  <h3>No listings were found.</h3>
                  <p>
                    Try changing the filters and or adding a location to get
                    better results.
                  </p>
                </div>
              ) : pageState.currentFilteredListings.length === 0 && place ? (
                <div className={styles["search-results-header"]}>
                  <h3>No listings were found.</h3>
                  <p>
                    {`Either there are no listing in ${place.formatted_address} or there are none that match your filter criteria.`}{" "}
                    <br />
                    <br />
                    To remove this location filter, click "Remove Boundary" on
                    the map 👉
                  </p>
                </div>
              ) : pageState.currentFilteredListings.length > 0 && !place ? (
                <div className={styles["search-results-header"]}>
                  <h3>{`Found ${pageState.currentFilteredListings.length} listings.`}</h3>
                  <p>
                    Try adding a location or some filters to refine your search.
                  </p>
                </div>
              ) : pageState.currentFilteredListings.length > 0 && place ? (
                <div className={styles["search-results-header"]}>
                  <h3>
                    {" "}
                    {`Found ${pageState.currentFilteredListings.length} listings in ${place.formatted_address}.`}
                  </h3>
                  <p>
                    Try applying some filters to refine your search. <br />
                    <br /> To remove this location filter, click "Remove
                    Boundary" on the map 👉
                  </p>
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
              <ExploreListingsMap />
            </div>
          </Wrapper>
        </div>

        {pageState.showFullListingOverlay && pageState.listingToOverlay ? (
          <DesktopListingOverlayPage />
        ) : null}
      </div>
    );
  }

  /**
   * MOBILE RENDER
   */
  return (
    <div className={styles.container}>
      <Wrapper
        apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
        render={renderMap}
        version="beta"
        libraries={["places", "marker"]}
      >
        <div className={`${styles["map-container"]}  ${styles.mobile}`}>
          <ExploreListingsMap />
        </div>
      </Wrapper>

      <button
        ref={openFiltersMenuBtnRef}
        type="button"
        id="filters-menu-btn"
        className={styles["m-filters-btn"]}
        onClick={toggleFiltersMenu}
      >
        <SlidersSVG />
      </button>

      <div
        className={`${styles["m-filters-container"]} ${
          showFiltersMenu ? styles["is-open"] : styles["is-closed"]
        }`}
      >
        {/* <CloseSVG className={styles["m-filters-close-icon"]} /> */}
        <div
          className={`${styles["m-filters"]} ${
            showFiltersMenu ? styles["is-open"] : styles["is-closed"]
          }`}
          ref={filtersMenuRef}
        >
          {/* <button
            type="button"
            id="filters-menu-btn"
            className={styles["m-filters-close-btn"]}
            onClick={toggleFiltersMenu}
          >
            <CloseSVG />
          </button> */}

          <div className={styles["search-box-container"]}>
            <input
              className={styles["m-search-box"]}
              type="search"
              id="place-filter-searchbox"
              placeholder="Search for a location"
              ref={searchRef}
              defaultValue={place ? place.formatted_address : ""}
            />
          </div>

          <ForSaleOrRentFilter
            menuKind="flex"
            label="For Sale or Rent"
            btnStyles={mDropdownBtnStyle}
            menuStyles={mDropdownMenuStyle}
          />

          <PriceFilter
            menuKind="flex"
            label="Price Range"
            btnStyles={mDropdownBtnStyle}
            menuStyles={mDropdownMenuStyle}
          />

          <ListingTypeFilter
            menuKind="flex"
            label="Listing Type"
            btnStyles={mDropdownBtnStyle}
            menuStyles={mDropdownMenuStyle}
          />

          <BedAndBathFilter
            menuKind="flex"
            label="Beds and Baths"
            btnStyles={mDropdownBtnStyle}
            menuStyles={mDropdownMenuStyle}
          />
        </div>
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
      {pageState.listingToOverlay ? (
        <MobileOverlayCard listing={pageState.listingToOverlay} />
      ) : null}
      {pageState.showFullListingOverlay ? <MobileListingOverlayPage /> : null}
    </div>
  );
}
