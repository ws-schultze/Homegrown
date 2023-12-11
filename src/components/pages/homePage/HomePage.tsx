import { useRef } from "react";
import styles from "./homePage.module.scss";
import Spinner from "../../shared/loaders/Spinner";
import { useUserContext } from "../../../UserProvider";
import { Wrapper } from "@googlemaps/react-wrapper";
import TopImage from "../../../assets/jpg/francesca-tosolini-XcVm8mn7NUM-unsplash.jpg";
import Footer from "../../shared/footer/Footer";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setPlace } from "../../shared/listingFilters/placeFilter/placeFilterSlice";
import { useNavigate } from "react-router";
import PlaceFilter from "../../shared/listingFilters/placeFilter/PlaceFilter";
import { setForSaleOrRent } from "../../shared/listingFilters/forSaleOrRentFilter/slice";
import { renderMap } from "../exploreListingsPage/map/mapHelpers";
import ListingCard from "../../shared/listingCard/ListingCard";
import "./swiper.scss";
import { register } from "swiper/element/bundle";
import { Link } from "react-router-dom";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
import Error from "../../shared/error/Error";
import { ReactComponent as MagnifyingGlassSVG } from "./assets/magnifying-glass-solid.svg";
import { FetchedListing } from "../../../types";

register();

export default function HomePage() {
  const userContext = useUserContext();
  const commonState = useAppSelector((state) => state.common);
  const exploreState = useAppSelector((state) => state.exploreListings);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const swiperElRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSizeContext();

  // const swiperProgressBarRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const progressBar = document.querySelector(
  //     ".swiper-pagination-progressbar-fill"
  //   ) as HTMLElement;
  //   if (progressBar) {
  //     console.log("Styling Bar: ", progressBar);
  //     progressBar.style.background = "yellow !important";
  //   }
  // }, []);

  function handleSearchboxPlace(
    place: google.maps.places.PlaceResult | undefined
  ) {
    if (place) {
      const p = JSON.stringify(place);
      dispatch(setPlace(p));
    }

    if (place) {
      navigate(`/explore-listings/${place.formatted_address}`);
    } else {
      console.warn("place is undefined");
      toast.warn("Something went wrong, please try your search again.");
    }
  }

  if (commonState.status === "loading") {
    return <Spinner size="large" />;
  }

  if (
    commonState.status === "idle" &&
    commonState.listings &&
    commonState.listings.length >= 1
  ) {
    return (
      <>
        <header
          className={`${styles.header} ${
            screenSize !== "desktop" ? styles.mobile : ""
          }`}
        >
          <img src={TopImage} alt="" />
          {userContext.isAuthenticated ? (
            <p>Welcome Back</p>
          ) : (
            <p>Explore The Market</p>
          )}
          <div
            className={`${styles["searchbox-container"]} ${
              screenSize !== "desktop" ? styles.mobile : ""
            }`}
          >
            <div
              className={`${styles.searchbox} ${
                screenSize !== "desktop" ? styles.mobile : ""
              }`}
            >
              <MagnifyingGlassSVG className={styles.magnifying_glass} />
              <input
                id="place-filter-searchbox"
                type="search"
                ref={searchRef}
                placeholder={
                  screenSize !== "desktop"
                    ? "Search listings by location"
                    : "Search by city, postal code, county, state or country"
                }
              />
            </div>
          </div>
          <Wrapper
            apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
            render={renderMap}
            version="beta"
            libraries={["places", "marker"]}
          >
            <PlaceFilter emitPlace={handleSearchboxPlace} />
          </Wrapper>
        </header>
        <div
          className={`${styles.content} ${styles.fade}`}
          style={{ animationDelay: `${0}ms` }}
        >
          {screenSize === "desktop" ? (
            <>
              <div className={styles["swiper-wrap"]}>
                <h3>Most recent listings</h3>
                {/* @ts-ignore */}
                <swiper-container
                  ref={swiperElRef}
                  class={`swiper-container ${
                    screenSize !== "desktop" ? "mobile" : ""
                  }`}
                  slides-per-view="auto"
                  space-between="10"
                  pagination="false"
                  // scrollbar="true"
                  // pagination-type="progressbar"
                  navigation="true"
                  loop="false"
                >
                  {commonState.listings.map((listing, index) => (
                    //@ts-ignore
                    <swiper-slide class="swiper-slide" key={index}>
                      <ListingCard listing={listing} key={listing.id} />
                      {/* @ts-ignore */}
                    </swiper-slide>
                  ))}
                  {/* @ts-ignore */}
                </swiper-container>
              </div>

              <div className={styles["swiper-wrap"]}>
                {exploreState.currentFilteredListings.length > 0 ? (
                  <>
                    <h3>Recently found by you</h3>
                    {/* @ts-ignore */}
                    <swiper-container
                      ref={swiperElRef}
                      class={`swiper-container ${
                        screenSize !== "desktop" ? "mobile" : ""
                      }`}
                      slides-per-view="auto"
                      space-between="10"
                      pagination="false"
                      // pagination-type="progressbar"
                      navigation="true"
                      loop="false"
                    >
                      {exploreState.currentFilteredListings.map(
                        (listing, index) => (
                          //@ts-ignore
                          <swiper-slide class="swiper-slide" key={index}>
                            <ListingCard listing={listing} key={listing.id} />
                            {/* @ts-ignore */}
                          </swiper-slide>
                        )
                      )}
                      {/* @ts-ignore */}
                    </swiper-container>
                  </>
                ) : (
                  <>
                    <h3>Recent Napa County listings</h3>
                    {/* @ts-ignore */}
                    <swiper-container
                      ref={swiperElRef}
                      class={`swiper-container ${
                        screenSize !== "desktop" ? "mobile" : ""
                      }`}
                      slides-per-view="auto"
                      space-between="10"
                      pagination="false"
                      // pagination-type="progressbar"
                      navigation="true"
                      loop="false"
                    >
                      {commonState.listings
                        // //@ts-ignore
                        //   .toReversed()
                        .map((listing: FetchedListing) => {
                          // TODO: Make a default set of listings to show here if the user has not recently searched for anything
                          console.log(listing.data.timestamp);
                          if (
                            listing.data.address.adminAreaLevel2.value.includes(
                              "Napa"
                            )
                          ) {
                            return (
                              //@ts-ignore
                              <swiper-slide
                                class="swiper-slide"
                                key={listing.id}
                              >
                                <ListingCard
                                  listing={listing}
                                  key={listing.id}
                                />
                                {/* @ts-ignore */}
                              </swiper-slide>
                            );
                          } else {
                            return [];
                          }
                        })}

                      {/* @ts-ignore */}
                    </swiper-container>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles["m-cards-container"]}>
                <h2>Most recent listings</h2>
                <div className={styles["m-cards"]}>
                  {commonState.listings.map((listing, index) => (
                    <ListingCard
                      listing={listing}
                      isMobile={true}
                      key={listing.id}
                    />
                  ))}
                </div>
              </div>

              {exploreState.currentFilteredListings.length > 0 ? (
                <div className={styles["m-cards-container"]}>
                  <h3>Recently found by you</h3>

                  <div className={styles["m-cards"]}>
                    {exploreState.currentFilteredListings.map((listing) => (
                      <ListingCard
                        listing={listing}
                        isMobile={true}
                        key={listing.id}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles["m-cards-container"]}>
                  <h2>Recent Napa County listings</h2>
                  <div className={styles["m-cards"]}>
                    {commonState.listings.map((listing) => {
                      // TODO: Make a default set of listings to show here if the user has not recently searched for anything
                      if (
                        listing.data.address.adminAreaLevel2.value.includes(
                          "Napa"
                        )
                      ) {
                        return (
                          <ListingCard
                            listing={listing}
                            isMobile={true}
                            key={listing.id}
                          />
                        );
                      } else {
                        return [];
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.btns}>
          <Link
            to="explore-listings/"
            className={styles.btn}
            onClick={() => {
              dispatch(setForSaleOrRent({ id: "for-sale", label: "For Sale" }));
            }}
          >
            Browse Sales
          </Link>
          <Link
            to="explore-listings/"
            className={styles.btn}
            onClick={() => {
              dispatch(setForSaleOrRent({ id: "for-rent", label: "For Rent" }));
            }}
          >
            Browse Rentals
          </Link>
          <>
            {userContext.isAuthenticated ? (
              <Link to="/create-listing" className={styles.btn}>
                Create a Listing
              </Link>
            ) : (
              <Link to="/sign-in" className={styles.btn}>
                Create a Listing
              </Link>
            )}
          </>
        </div>
        <Footer />
      </>
    );
  }

  return <Error />;
}
