import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import "swiper/swiper-bundle.css";
import { getAuth } from "firebase/auth";
import { ReactComponent as ShareSVG } from "../../../assets/svg/share-from-square-regular.svg";
import { ReactComponent as CloseSVG } from "../../../assets/svg/circle-xmark-regular.svg";
import { ReactComponent as BuildingSVG } from "../../../assets/svg/building-regular.svg";
import { ReactComponent as CalendarSVG } from "../../../assets/svg/calendar-days-solid.svg";
import { ReactComponent as ThermometerSVG } from "../../../assets/svg/temperature-full-solid.svg";
import { ReactComponent as SnowflakeSVG } from "../../../assets/svg/snowflake-regular.svg";
import { ReactComponent as MapSVG } from "../../../assets/svg/mapIcon.svg";
import { ReactComponent as RulerSVG } from "../../../assets/svg/ruler-combined-solid.svg";
import { ReactComponent as MagnifyMoneySVG } from "../../../assets/svg/magnifying-glass-dollar-solid.svg";

import { ReactComponent as StairsSVG } from "../../../assets/svg/stairs-solid.svg";
import { ReactComponent as ElevatorSVG } from "../../../assets/svg/elevator-solid.svg";

// import { ReactComponent as ClockSVG } from "../assets/svg/clock-regular.svg";
import { ReactComponent as FaucetSVG } from "../../../assets/svg/faucet-drip-solid.svg";
import { ReactComponent as PlugSVG } from "../../../assets/svg/plug-solid.svg";
import { ReactComponent as EnvelopeSVG } from "../../../assets/svg/envelopeIcon.svg";
import { ReactComponent as BedSVG } from "../../../assets/svg/bed-solid.svg";

import { ReactComponent as BathSVG } from "../../../assets/svg/bath-solid.svg";
import { ReactComponent as ToiletSVG } from "../../../assets/svg/toilet-solid.svg";

import { Wrapper } from "@googlemaps/react-wrapper";
import AddressMap from "../../shared/addressMap/AddressMap";
import assertIsNode from "../../utils/assertIsNode";
import logoPNG from "../../../assets/logo/logo.png";
import {
  Address,
  BasicInfo,
  Btn,
  Container,
  CoverImg,
  Feature,
  Features,
  Images,
  Info,
  InfoCard,
  InfoHeader,
  InfoHeaderBtns,
  ListedBy,
  MapContainer,
  Overlay,
  Overview,
  Page,
  Price,
  SmallImages,
  SmallImg,
  Specs,
} from "./styledComponents";
import { renderMap } from "../exploreListingsPage/map/mapHelpers";
import { useAppSelector } from "../../../redux/hooks";

export default function ListingOverlayPage() {
  const listing = useAppSelector(
    (state) => state.exploreListings.listingToOverlay
  );
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const params = useParams();
  const auth = getAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  // const { theme } = useThemeContext();
  const navigate = useNavigate();

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
    // timestamp,
  } = listing!.data;

  //@ts-ignore
  // const dateLastUpdated = timestamp.toDate().toDateString();
  // console.log(typeof dateLastUpdated);

  /**
   * Get the simple postal_code (e.g. 95490) not the
   * one including the postal_code_suffix (e.g. 95490-1234)
   * @returns postal_code string without the postal_code_suffix
   */
  // function getPostalCode(): string {
  //   let postal_code = "";
  //   for (const key in listing_.data.address.address_components) {
  //     let component = listing_.data.address.address_components[key];
  //     // console.log(component);
  //     for (const key in component) {
  //       //@ts-ignore
  //       if (key === "types" && component[key].includes("postal_code")) {
  //         postal_code = component["long_name"];
  //       }
  //     }
  //   }

  //   return postal_code;
  // }

  /**
   * Close overlay when container transparent region is clicked
   */
  useEffect(() => {
    function handler({ target }: MouseEvent) {
      assertIsNode(target);

      if (containerRef.current && !overlayRef.current?.contains(target)) {
        navigate(handleNavigate());
      }
    }
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  /**
   * Get the mapPageState from local storage if it is defined.
   * The mapPageState filers will be used to navigate to
   * the map page by passing in the forSaleOrRentId and
   * placeFilter
   * @returns string
   */
  function handleNavigate(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      const path = `/explore-listings/${place.formatted_address}`;
      return path;
    } else if (placeFilter.place) {
      const path = `/explore-listings/`;
      return path;
    } else {
      console.log("escaped...");
      const path = ``;
      return path;
    }
  }

  // function getTimestamp() {
  //   console.log(timestamp);
  //   //@ts-ignore
  //   const date = timestamp.toDate();

  //   console.log(date);
  //   return date;
  // }

  // function getDuration() {
  //   //@ts-ignore
  //   const dateListed = timestamp.toDate();
  //   const dateNow = new Date();
  //   const millisecondsElapsed = dateNow.getTime() - dateListed.getTime();

  //   const minutes = Math.floor(millisecondsElapsed / 60000);
  //   const hours = Math.round(minutes / 60);
  //   const days = Math.round(hours / 24);

  //   return (
  //     (days && { value: days, unit: "days" }) ||
  //     (hours && { value: hours, unit: "hours" }) || {
  //       value: minutes,
  //       unit: "minutes",
  //     }
  //   );
  // }

  return (
    <Container ref={containerRef} id="listing-overlay-container">
      {listing ? (
        <Overlay ref={overlayRef} id="listing-overlay">
          <>
            <Page>
              <Images>
                <CoverImg src={uploads.images.value[0].url} alt="" />
                <SmallImages>
                  {uploads.images.value.slice(1).map((image, i) => (
                    <SmallImg key={i} src={image.url} alt="" />
                  ))}
                </SmallImages>
              </Images>

              <Info>
                <InfoHeader>
                  <img src={logoPNG} alt="" />
                  <InfoHeaderBtns>
                    {auth.currentUser?.uid !== userRef.uid && (
                      <Btn
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
                      </Btn>
                    )}
                    <Btn
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
                    </Btn>
                    <Btn onClick={() => navigate(handleNavigate())}>
                      <CloseSVG />
                      <label>Close</label>
                    </Btn>
                  </InfoHeaderBtns>
                </InfoHeader>

                <InfoCard>
                  <BasicInfo>
                    <Price>{basicInfo.price.shortFormatted}</Price>
                    <Specs>
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
                    </Specs>
                  </BasicInfo>

                  <Address>
                    {/* <div>
                      {basicInfo.listingKind.value?.label}{" "}
                      {basicInfo.forSaleOrRent.value?.label}
                    </div> */}
                    {address.formattedAddress.value}
                  </Address>
                </InfoCard>

                <Overview>
                  <Features>
                    {basicInfo.listingKind.value?.id !== "land" ? (
                      <>
                        <Feature>
                          <BuildingSVG />
                          Listing Type: {basicInfo.listingKind.value?.label}
                        </Feature>
                        <Feature>
                          <CalendarSVG />
                          Year Built: {apartment?.yearBuilt.number}
                          {condo?.yearBuilt.number}
                          {apartmentBuilding?.yearBuilt.number}
                          {manufacturedHome?.yearBuilt.number}
                          {multiFamilyHome?.yearBuilt.number}
                          {multiFamilyHomeUnit?.yearBuilt.number}
                          {singleFamilyHome?.yearBuilt.number}
                          {townhouse?.yearBuilt.number}
                        </Feature>
                        <Feature>
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
                          {apartment?.heating.value
                            .slice(-1)
                            .map((option, i) => (
                              <div key={i}>{option?.label}</div>
                            ))}
                          {condo?.heating.value
                            .slice(0, -1)
                            .map((option, i) => (
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
                          {townhouse?.heating.value
                            .slice(-1)
                            .map((option, i) => (
                              <div key={i}>{option?.label}</div>
                            ))}
                        </Feature>
                        <Feature>
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
                          {apartment?.cooling.value
                            .slice(-1)
                            .map((option, i) => (
                              <div key={i}>{option?.label}</div>
                            ))}
                          {condo?.cooling.value
                            .slice(0, -1)
                            .map((option, i) => (
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
                          {townhouse?.cooling.value
                            .slice(-1)
                            .map((option, i) => (
                              <div key={i}>{option?.label}</div>
                            ))}
                        </Feature>
                        <Feature>
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
                        </Feature>
                        <Feature>
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
                        </Feature>

                        <Feature>
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
                        </Feature>

                        {singleFamilyHome &&
                        basicInfo.priceChange.number > 0 ? (
                          <Feature>
                            <MagnifyMoneySVG />
                            Price/Sqft: ${""}
                            {(
                              basicInfo.priceChange.number /
                              singleFamilyHome?.squareFeet.number
                            ).toFixed(0)}
                          </Feature>
                        ) : singleFamilyHome &&
                          basicInfo.priceChange.number === 0 ? (
                          <Feature>
                            <MagnifyMoneySVG />
                            Price/Sqft: $
                            {(
                              basicInfo.price.number /
                              singleFamilyHome?.squareFeet.number
                            ).toFixed(0)}
                          </Feature>
                        ) : null}

                        <Feature>
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
                        </Feature>

                        <Feature>
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
                        </Feature>

                        <Feature>
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
                        </Feature>

                        {singleFamilyHome ||
                        multiFamilyHome ||
                        multiFamilyHomeUnit ||
                        apartmentBuilding ? (
                          <Feature>
                            <StairsSVG />
                            Stories: {singleFamilyHome?.stories.number}
                            {multiFamilyHome?.stories.number}
                            {multiFamilyHomeUnit?.stories.number}
                            {apartmentBuilding?.stories.number}
                          </Feature>
                        ) : null}

                        {apartment || condo ? (
                          <Feature>
                            <ElevatorSVG />
                            Floor Number: {apartment?.floorNumber.number}
                            {condo?.floorNumber.number}
                          </Feature>
                        ) : null}
                      </>
                    ) : null}

                    {basicInfo.listingKind.value?.id === "land" ||
                    basicInfo.listingKind.value?.id === "single-family-home" ? (
                      <Feature>
                        <MapSVG />
                        Lot Size: {land?.acres}
                        {singleFamilyHome?.acres.formatted} Acres
                      </Feature>
                    ) : null}
                  </Features>
                  <header>Overview</header>
                  <p>{basicInfo.description.value}</p>

                  <ListedBy>
                    {agent ? (
                      <span>
                        Listed by: <br />
                        {agent.firstName.value}{" "}
                        {agent.middleName.value.length > 0
                          ? agent.middleName.value
                          : null}{" "}
                        {agent.lastName.value} {" - "} DRE#{" "}
                        {agent.licenseId.value} {" - "} Phone#{" "}
                        {agent.phoneNumber.formatted}
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
                  </ListedBy>

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
                    <MapContainer>
                      <AddressMap
                        center={{
                          lat: address.geolocation.value.lat,
                          lng: address.geolocation.value.lng,
                        }}
                      />
                    </MapContainer>
                  </Wrapper>
                </Overview>
              </Info>
            </Page>
          </>

          {auth.currentUser?.uid !== userRef.uid && (
            <Link
              to={`/contact/${userRef.uid}/${params.listingId}`}
              className="primary-btn"
            >
              Contact Landlord
            </Link>
          )}
        </Overlay>
      ) : (
        <Overlay>No listing found...</Overlay>
      )}
    </Container>
  );
}
