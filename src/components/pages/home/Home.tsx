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
import { setPlace } from "../../pages/exploreListings/filters/placeFilter/placeFilterSlice";
import { useNavigate } from "react-router";
import PlaceFilter from "../../pages/exploreListings/filters/placeFilter/PlaceFilter";
import { setForSaleOrRent } from "../../pages/exploreListings/filters/forSaleOrRentFilter/forSaleOrRentSlice";
import { renderMap } from "../exploreListings/map/mapHelpers";
import ListingCard from "../../shared/listingCard/ListingCard";
import "./swiper.scss";
import { register } from "swiper/element/bundle";
import { Link } from "react-router-dom";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";

register();

export default function Home() {
  const userContext = useUserContext();
  const commonState = useAppSelector((state) => state.common);
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

  return (
    <>
      {commonState.status === "idle" &&
      commonState.listings &&
      commonState.listings.length >= 1 ? (
        <div
          className={`page-wrap ${styles.fade}`}
          style={{ animationDelay: `${0}ms` }}
        >
          <main>
            <div className={styles["top-container"]}>
              <img src={TopImage} alt="" />

              {userContext.isAuthenticated ? (
                <p>Welcome Back</p>
              ) : (
                <p
                  className={`${styles["page-header"]} ${
                    screenSize !== "desktop" ? styles.mobile : ""
                  }`}
                >
                  Explore The Market
                </p>
              )}

              <div
                className={`${styles["searchbox-container"]} ${
                  screenSize !== "desktop" ? styles.mobile : ""
                }`}
              >
                <input
                  className={`${styles.searchbox} ${
                    screenSize !== "desktop" ? styles.mobile : ""
                  }`}
                  id="place-filter-searchbox"
                  type="search"
                  ref={searchRef}
                  placeholder="Search by City, Postal Code, County, State or Country"
                />
              </div>

              <Wrapper
                apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
                render={renderMap}
                version="beta"
                libraries={["places", "marker"]}
              >
                <PlaceFilter emitPlace={handleSearchboxPlace} />
              </Wrapper>
            </div>

            {screenSize === "desktop" ? (
              <div className={`${styles["most-recent-listings"]} `}>
                <h2>Most recent listings</h2>

                {/* @ts-ignore */}
                <swiper-container
                  ref={swiperElRef}
                  class={`swiper-container ${
                    screenSize !== "desktop" ? "mobile" : ""
                  }`}
                  slides-per-view="auto"
                  space-between="10"
                  pagination="true"
                  pagination-type="progressbar"
                  navigation="true"
                  loop="false"
                >
                  {commonState.listings.map((listing, index) => (
                    //@ts-ignore
                    <swiper-slide class="swiper-slide" key={index}>
                      <ListingCard listing={listing} />
                      {/* @ts-ignore */}
                    </swiper-slide>
                  ))}
                  {/* @ts-ignore */}
                </swiper-container>
              </div>
            ) : (
              <div className={styles["most-recent-listings__mobile"]}>
                <h2>Most Recent Listing</h2>
                {commonState.listings.map((listing, index) => (
                  <ListingCard listing={listing} isMobile={true} />
                ))}
              </div>
            )}

            <div className={styles["bottom-btn-container"]}>
              <Link
                to="explore-listings/"
                className={`${styles["link-btn"]} primary-btn`}
                onClick={() => {
                  dispatch(
                    setForSaleOrRent({ id: "for-sale", label: "For Sale" })
                  );
                }}
              >
                Browse Sales
              </Link>
              <Link
                to="explore-listings/"
                className={`${styles["link-btn"]} primary-btn`}
                onClick={() => {
                  dispatch(
                    setForSaleOrRent({ id: "for-rent", label: "For Rent" })
                  );
                }}
              >
                Browse Rentals
              </Link>
              <>
                {userContext.isAuthenticated ? (
                  <Link
                    to="/create-listing"
                    className={`${styles["link-btn"]} primary-btn`}
                  >
                    Create a Listing
                  </Link>
                ) : (
                  <Link
                    to="/sign-in"
                    className={`${styles["link-btn"]} primary-btn`}
                  >
                    Create a Listing
                  </Link>
                )}
              </>
            </div>

            <Footer />
          </main>
        </div>
      ) : (
        <div>No listings found</div>
      )}
    </>
  );
}
