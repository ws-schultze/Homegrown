import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ReactComponent as ShareSVG } from "../assets/share-from-square-regular.svg";
import { ReactComponent as CloseSVG } from "../assets/circle-xmark-regular.svg";
import { ReactComponent as EnvelopeSVG } from "../assets/envelopeIcon.svg";
import { Wrapper } from "@googlemaps/react-wrapper";
import AddressMap from "../../../shared/addressMap/AddressMap";
import DesktopLogo from "../../../shared/logo/desktop/DesktopLogo";
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import { useAppSelector } from "../../../../redux/hooks";
import styles from "./desktopListingOverlayPage.module.scss";
import { useDispatch } from "react-redux";
import Footer from "../../../shared/footer/Footer";
import {
  setListingToOverlay,
  setShowFullOverlay,
} from "../../exploreListingsPage/exploreListingsPageSlice";
import Features from "../components/features/Features";
import ImageLoad from "../../../shared/imageLoad/ImageLoad";

export default function ListingOverlayPage() {
  const listing = useAppSelector(
    (state) => state.exploreListings.listingToOverlay
  );
  // const placeFilter = useAppSelector((state) => state.placeFilter);
  const auth = getAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const params = useParams();

  const {
    basicInfo,
    address,
    agent,
    owner,
    company,
    privateOwner,
    singleFamilyHome,
    multiFamilyHome,
    multiFamilyHomeUnit,
    manufacturedHome,
    apartment,
    condo,
    apartmentBuilding,
    townhouse,
    land,
    uploads,
    userRef,
  } = listing!.data;

  /**
   * Close overlay when container transparent region is clicked
   */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (
        overlayRef.current !== null &&
        overlayRef.current?.contains(target) === false &&
        containerRef.current?.contains(target) === true
      ) {
        dispatch(setShowFullOverlay(false));
        dispatch(setListingToOverlay(undefined));
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, [dispatch]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.overlay} ref={overlayRef} id="listing-overlay">
        {listing ? (
          <>
            <div className={styles.images}>
              {uploads.images.value.map((image, i) => (
                <ImageLoad image={image} key={i} height={600} />
              ))}
            </div>

            <div className={styles.info}>
              <header>
                <DesktopLogo />
                <div className={styles.btns}>
                  {auth.currentUser?.uid !== userRef.uid && (
                    <button
                      onClick={() =>
                        navigate(`/contact/${userRef.uid}/${listing.id}`)
                      }
                    >
                      <EnvelopeSVG />
                      {agent ? (
                        <span>Contact Agent</span>
                      ) : owner ? (
                        <span>Contact Owner</span>
                      ) : company ? (
                        <span>Contact Company</span>
                      ) : privateOwner ? (
                        <span>Contact Owner</span>
                      ) : null}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShareLinkCopied(true);
                      setTimeout(() => {
                        setShareLinkCopied(false);
                      }, 2000);
                    }}
                  >
                    <ShareSVG />
                    <label>Share</label>
                    {shareLinkCopied ? (
                      <div className="listing-share-link-copied">
                        Link Copied
                      </div>
                    ) : null}
                  </button>
                  <button
                    onClick={() => {
                      dispatch(setShowFullOverlay(false));
                      dispatch(setListingToOverlay(undefined));
                    }}
                  >
                    <CloseSVG />
                    <label>Close</label>
                  </button>
                </div>
              </header>

              <div className={styles.card}>
                <div className={styles.basic}>
                  <div className={styles.price}>
                    {basicInfo.price.shortFormatted}
                  </div>
                  <div className={styles.specs}>
                    {singleFamilyHome || multiFamilyHomeUnit || apartment ? (
                      <>
                        {/* Bedrooms */}
                        <div>
                          <b>
                            {singleFamilyHome?.bedrooms.number ||
                              multiFamilyHomeUnit?.bedrooms.number ||
                              apartment?.bedrooms.number}
                          </b>
                          bd
                        </div>
                        {" | "}
                        {/* Bathrooms */}
                        <div>
                          <b>
                            {singleFamilyHome?.fullBathrooms.number! +
                              singleFamilyHome?.halfBathrooms.number! * 0.5 ||
                              multiFamilyHomeUnit?.fullBathrooms.number! +
                                multiFamilyHomeUnit?.halfBathrooms.number! *
                                  0.5 ||
                              apartment?.fullBathrooms.number! +
                                apartment?.halfBathrooms.number! * 0.5}
                          </b>
                          ba
                        </div>
                        {" | "}
                        {/* Square feet */}
                        <div>
                          <b>
                            {singleFamilyHome?.squareFeet.formatted ||
                              multiFamilyHomeUnit?.squareFeet.formatted ||
                              apartment?.squareFeet.formatted}
                          </b>
                          ft<sup>2</sup>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className={styles.address}>
                  {/* <div>
                      {basicInfo.listingKind.value?.label}{" "}
                      {basicInfo.forSaleOrRent.value?.label}
                    </div> */}
                  {address.formattedAddress.value}
                </div>
              </div>

              <div className={styles.card}>
                <p>{basicInfo.description.value}</p>
              </div>

              <div className={styles.overview}>
                <Features listing={listing.data} />
                <Wrapper
                  apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
                  render={renderMap}
                  version="beta"
                  libraries={["places", "marker"]}
                >
                  <div className={styles["map-container"]}>
                    <AddressMap
                      center={{
                        lat: address.geolocation.value.lat,
                        lng: address.geolocation.value.lng,
                      }}
                    />
                  </div>
                </Wrapper>

                {/* <div className={styles.card}> */}
                <div className={styles.lister}>
                  {agent ? (
                    <span>
                      Listed by: <br />
                      {agent.firstName.value}{" "}
                      {agent.middleName.value.length > 0
                        ? agent.middleName.value
                        : null}{" "}
                      {agent.lastName.value} <br /> DRE# {agent.licenseId.value}{" "}
                      <br /> Phone# {agent.phoneNumber.formatted}
                      <br />
                      {agent.companyName.value}
                    </span>
                  ) : owner ? (
                    <span>For Sale by Owner</span>
                  ) : company ? (
                    <span>Listed by: {company.name.value}</span>
                  ) : privateOwner ? (
                    <span>For Rent by Owner</span>
                  ) : null}
                </div>
                {/* </div> */}
                <Footer />
              </div>
            </div>
          </>
        ) : (
          <p>No listing found...</p>
        )}
      </div>
    </div>
  );
}
