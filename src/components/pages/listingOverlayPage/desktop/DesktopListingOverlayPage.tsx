import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ReactComponent as ShareSVG } from "../assets/share-from-square-regular.svg";
import { ReactComponent as CloseSVG } from "../assets/circle-xmark-regular.svg";
import { ReactComponent as BuildingSVG } from "../assets/building-regular.svg";
import { ReactComponent as CalendarSVG } from "../assets/calendar-days-solid.svg";
import { ReactComponent as ThermometerSVG } from "../assets/temperature-full-solid.svg";
import { ReactComponent as SnowflakeSVG } from "../assets/snowflake-regular.svg";
import { ReactComponent as MapSVG } from "../assets/mapIcon.svg";
import { ReactComponent as RulerSVG } from "../assets/ruler-combined-solid.svg";
import { ReactComponent as MagnifyMoneySVG } from "../assets/magnifying-glass-dollar-solid.svg";
import { ReactComponent as StairsSVG } from "../assets/stairs-solid.svg";
import { ReactComponent as ElevatorSVG } from "../assets/elevator-solid.svg";
import { ReactComponent as FaucetSVG } from "../assets/faucet-drip-solid.svg";
import { ReactComponent as PlugSVG } from "../assets/plug-solid.svg";
import { ReactComponent as EnvelopeSVG } from "../assets/envelopeIcon.svg";
import { ReactComponent as BedSVG } from "../assets/bed-solid.svg";
import { ReactComponent as BathSVG } from "../assets/bath-solid.svg";
import { ReactComponent as ToiletSVG } from "../assets/toilet-solid.svg";

import { Wrapper } from "@googlemaps/react-wrapper";
import AddressMap from "../../../shared/addressMap/AddressMap";
import assertIsNode from "../../../utils/assertIsNode";
import DesktopLogo from "../../../shared/logo/desktop/DesktopLogo";
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import { useAppSelector } from "../../../../redux/hooks";
import styles from "./desktopListingOverlayPage.module.scss";
import { useDispatch } from "react-redux";
import { setShowFullOverlay } from "../../exploreListingsPage/exploreListingsPageSlice";

export default function ListingOverlayPage() {
  const listing = useAppSelector(
    (state) => state.exploreListings.listingToOverlay
  );
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const auth = getAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

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
                <img key={i} src={image.url} alt="" />
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
                  <button onClick={() => dispatch(setShowFullOverlay(false))}>
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

              <div className={styles.card}>
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
              </div>

              <div className={styles.overview}>
                <div className={styles.features}>
                  {basicInfo.listingKind.value?.id !== "land" ? (
                    <>
                      <div className={styles.feature}>
                        <BuildingSVG />
                        Listing Type: {basicInfo.listingKind.value?.label}
                      </div>
                      <div className={styles.feature}>
                        <CalendarSVG />
                        Year Built: {apartment?.yearBuilt.number}
                        {condo?.yearBuilt.number}
                        {apartmentBuilding?.yearBuilt.number}
                        {manufacturedHome?.yearBuilt.number}
                        {multiFamilyHome?.yearBuilt.number}
                        {multiFamilyHomeUnit?.yearBuilt.number}
                        {singleFamilyHome?.yearBuilt.number}
                        {townhouse?.yearBuilt.number}
                      </div>
                      <div className={styles.feature}>
                        <ThermometerSVG />
                        Heating:{" "}
                        {singleFamilyHome?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {singleFamilyHome?.heating.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {apartment?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartment?.heating.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {condo?.heating.value.slice(0, -1).map((option, i) => (
                          <div key={i}>{option?.label}, </div>
                        ))}
                        {condo?.heating.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {apartmentBuilding?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartmentBuilding?.heating.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {manufacturedHome?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {manufacturedHome?.heating.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHome?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHome?.heating.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHomeUnit?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHomeUnit?.heating.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {townhouse?.heating.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {townhouse?.heating.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                      </div>
                      <div className={styles.feature}>
                        <SnowflakeSVG />
                        Cooling:{" "}
                        {singleFamilyHome?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {singleFamilyHome?.cooling.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {apartment?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartment?.cooling.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {condo?.cooling.value.slice(0, -1).map((option, i) => (
                          <div key={i}>{option?.label}, </div>
                        ))}
                        {condo?.cooling.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {apartmentBuilding?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartmentBuilding?.cooling.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {manufacturedHome?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {manufacturedHome?.cooling.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHome?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHome?.cooling.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHomeUnit?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHomeUnit?.cooling.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {townhouse?.cooling.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {townhouse?.cooling.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                      </div>
                      <div className={styles.feature}>
                        <FaucetSVG />
                        Water:{" "}
                        {singleFamilyHome?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {singleFamilyHome?.water.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {apartment?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartment?.water.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {condo?.water.value.slice(0, -1).map((option, i) => (
                          <div key={i}>{option?.label}, </div>
                        ))}
                        {condo?.water.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {apartmentBuilding?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartmentBuilding?.water.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {manufacturedHome?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {manufacturedHome?.water.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHome?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHome?.water.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHomeUnit?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHomeUnit?.water.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {townhouse?.water.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {townhouse?.water.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                      </div>
                      <div className={styles.feature}>
                        <PlugSVG />
                        Power:{" "}
                        {singleFamilyHome?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {singleFamilyHome?.power.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {apartment?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartment?.power.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {condo?.power.value.slice(0, -1).map((option, i) => (
                          <div key={i}>{option?.label}, </div>
                        ))}
                        {condo?.power.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                        {apartmentBuilding?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {apartmentBuilding?.power.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {manufacturedHome?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {manufacturedHome?.power.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHome?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHome?.power.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {multiFamilyHomeUnit?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {multiFamilyHomeUnit?.power.value
                          .slice(-1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}</div>
                          ))}
                        {townhouse?.power.value
                          .slice(0, -1)
                          .map((option, i) => (
                            <div key={i}>{option?.label}, </div>
                          ))}
                        {townhouse?.power.value.slice(-1).map((option, i) => (
                          <div key={i}>{option?.label}</div>
                        ))}
                      </div>

                      <div className={styles.feature}>
                        <RulerSVG />
                        Square Feet:{" "}
                        {singleFamilyHome?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {multiFamilyHome?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {multiFamilyHomeUnit?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {apartment?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {apartmentBuilding?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {condo?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                        {manufacturedHome?.squareFeet.formatted
                          ? singleFamilyHome?.squareFeet.formatted
                          : null}
                      </div>

                      {singleFamilyHome && basicInfo.priceChange.number > 0 ? (
                        <div className={styles.feature}>
                          <MagnifyMoneySVG />
                          Price/Sqft: ${""}
                          {(
                            basicInfo.priceChange.number /
                            singleFamilyHome?.squareFeet.number
                          ).toFixed(0)}
                        </div>
                      ) : singleFamilyHome &&
                        basicInfo.priceChange.number === 0 ? (
                        <div className={styles.feature}>
                          <MagnifyMoneySVG />
                          Price/Sqft: $
                          {(
                            basicInfo.price.number /
                            singleFamilyHome?.squareFeet.number
                          ).toFixed(0)}
                        </div>
                      ) : null}

                      <div className={styles.feature}>
                        <BedSVG />
                        Bedrooms:{" "}
                        {singleFamilyHome?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {multiFamilyHome?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {multiFamilyHomeUnit?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {apartment?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {apartmentBuilding?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {condo?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                        {manufacturedHome?.bedrooms.number
                          ? singleFamilyHome?.bedrooms.number
                          : null}
                      </div>

                      <div className={styles.feature}>
                        <BathSVG />
                        Full Bathrooms:{" "}
                        {singleFamilyHome?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {multiFamilyHome?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {multiFamilyHomeUnit?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {apartment?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {apartmentBuilding?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {condo?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                        {manufacturedHome?.fullBathrooms.number
                          ? singleFamilyHome?.fullBathrooms.number
                          : null}
                      </div>

                      <div className={styles.feature}>
                        <ToiletSVG />
                        Half Bathrooms:{" "}
                        {singleFamilyHome?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {multiFamilyHome?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {multiFamilyHomeUnit?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {apartment?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {apartmentBuilding?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {condo?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                        {manufacturedHome?.halfBathrooms.number
                          ? singleFamilyHome?.halfBathrooms.number
                          : null}
                      </div>

                      {singleFamilyHome ||
                      multiFamilyHome ||
                      multiFamilyHomeUnit ||
                      apartmentBuilding ? (
                        <div className={styles.feature}>
                          <StairsSVG />
                          Stories: {singleFamilyHome?.stories.number}
                          {multiFamilyHome?.stories.number}
                          {multiFamilyHomeUnit?.stories.number}
                          {apartmentBuilding?.stories.number}
                        </div>
                      ) : null}

                      {apartment || condo ? (
                        <div className={styles.feature}>
                          <ElevatorSVG />
                          Floor Number: {apartment?.floorNumber.number}
                          {condo?.floorNumber.number}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {land ? (
                    <div className={styles.feature}>
                      <MapSVG />
                      Lot Size: {land.acres.formatted}
                      {singleFamilyHome?.acres.formatted} Acres
                    </div>
                  ) : null}

                  {singleFamilyHome ? (
                    <div className={styles.feature}>
                      <MapSVG />
                      Lot Size: {singleFamilyHome.acres.formatted}
                      {singleFamilyHome?.acres.formatted} Acres
                    </div>
                  ) : null}
                </div>
                {/* <header>Overview</header> */}

                {/* <Feature onClick={() => getTimestamp()}>
                    Listing Updated: {dateLastUpdated}
                  </Feature> */}
                {/* <Feature>
                    {getDuration().value} {getDuration().unit} On HomeGrown
                  </Feature> */}
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
