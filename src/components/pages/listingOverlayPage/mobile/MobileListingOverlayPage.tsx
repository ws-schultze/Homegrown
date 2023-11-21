import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ReactComponent as ShareSVG } from "../assets/share-solid.svg";
import { ReactComponent as CloseSVG } from "../assets/close-icon.svg";
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
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import { useAppSelector } from "../../../../redux/hooks";
import styles from "./mobileListingOverlayPage.module.scss";
import MobileLogo from "../../../shared/logo/mobile/MobileLogo";
import { setShowFullOverlay } from "../../exploreListingsPage/exploreListingsPageSlice";
import { useDispatch } from "react-redux";
import {
  Apartment,
  ApartmentBuilding,
  Condo,
  ManufacturedHome,
  MultiFamilyHome,
  MultiFamilyHomeUnit,
} from "../../../../types";
import { SingleFamilyHome } from "../../../../types/index";

export default function MobileListingOverlayPage() {
  const state = useAppSelector((state) => state.exploreListings);
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
  } = state!.listingToOverlay!.data;

  function heating(
    listing:
      | Apartment
      | SingleFamilyHome
      | ApartmentBuilding
      | Condo
      | ManufacturedHome
      | MultiFamilyHome
      | MultiFamilyHomeUnit
  ): JSX.Element {
    return (
      <div className={styles.feature}>
        <ThermometerSVG />
        Heating:
        <div className={styles.options}>
          {listing.heating.value.slice(0, -1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label},{" "}
            </div>
          ))}
          {listing?.heating.value.slice(-1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function cooling(
    listing:
      | SingleFamilyHome
      | Apartment
      | ApartmentBuilding
      | Condo
      | ManufacturedHome
      | MultiFamilyHome
      | MultiFamilyHomeUnit
  ): JSX.Element {
    return (
      <div className={styles.feature}>
        <SnowflakeSVG />
        Cooling:
        <div className={styles.options}>
          {listing.cooling.value.slice(0, -1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label},{" "}
            </div>
          ))}
          {listing.cooling.value.slice(-1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function water(
    listing:
      | SingleFamilyHome
      | Apartment
      | ApartmentBuilding
      | Condo
      | ManufacturedHome
      | MultiFamilyHome
      | MultiFamilyHomeUnit
  ): JSX.Element {
    return (
      <div className={styles.feature}>
        <FaucetSVG />
        Water:
        <div className={styles.options}>
          {listing.water.value.slice(0, -1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label},{" "}
            </div>
          ))}
          {listing.water.value.slice(-1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function power(
    listing:
      | SingleFamilyHome
      | Apartment
      | ApartmentBuilding
      | Condo
      | ManufacturedHome
      | MultiFamilyHome
      | MultiFamilyHomeUnit
  ): JSX.Element {
    return (
      <div className={styles.feature}>
        <PlugSVG />
        Power:
        <div className={styles.options}>
          {listing.power.value.slice(0, -1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label},{" "}
            </div>
          ))}
          {listing.power.value.slice(-1).map((option, i) => (
            <div className={styles.option} key={i}>
              {option?.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state.listingToOverlay) {
    return (
      <div className={styles.container} ref={containerRef}>
        <header className={styles.header}>
          <MobileLogo />
          <div className={styles.btns}>
            {auth.currentUser?.uid !== userRef.uid && (
              <button
                onClick={() =>
                  navigate(
                    `/contact/${userRef.uid}/${state.listingToOverlay!.id}`
                  )
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
                console.log("copied");
                setTimeout(() => {
                  setShareLinkCopied(false);
                }, 2000);
              }}
            >
              <ShareSVG className={styles.share_icon} />
              <label>Share</label>

              {shareLinkCopied ? (
                <div className={styles.share_link_copied}>Link Copied</div>
              ) : null}
            </button>
            <button onClick={() => dispatch(setShowFullOverlay(false))}>
              <CloseSVG />
            </button>
          </div>
        </header>
        <div className={styles.contents} ref={overlayRef}>
          <div></div>
          <div className={styles["info-card"]}>
            <div className={styles["basic-info"]}>
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
                            multiFamilyHomeUnit?.halfBathrooms.number! * 0.5 ||
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
              {address.formattedAddress.value}
            </div>
          </div>
          <div className={styles.images}>
            {uploads.images.value.map((image, i) => (
              <img className={styles.image} key={i} src={image.url} alt="" />
            ))}
          </div>
          <div className={styles.info}>
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

                    {/* Heating */}
                    {singleFamilyHome ? heating(singleFamilyHome) : null}
                    {apartment ? heating(apartment) : null}
                    {apartmentBuilding ? heating(apartmentBuilding) : null}
                    {condo ? heating(condo) : null}
                    {multiFamilyHome ? heating(multiFamilyHome) : null}
                    {multiFamilyHomeUnit ? heating(multiFamilyHomeUnit) : null}
                    {manufacturedHome ? heating(manufacturedHome) : null}

                    {/* Cooling */}
                    {singleFamilyHome ? cooling(singleFamilyHome) : null}
                    {apartment ? cooling(apartment) : null}
                    {apartmentBuilding ? cooling(apartmentBuilding) : null}
                    {condo ? cooling(condo) : null}
                    {multiFamilyHome ? cooling(multiFamilyHome) : null}
                    {multiFamilyHomeUnit ? cooling(multiFamilyHomeUnit) : null}
                    {manufacturedHome ? cooling(manufacturedHome) : null}

                    {/* Water */}
                    {singleFamilyHome ? water(singleFamilyHome) : null}
                    {apartment ? water(apartment) : null}
                    {apartmentBuilding ? water(apartmentBuilding) : null}
                    {condo ? water(condo) : null}
                    {multiFamilyHome ? water(multiFamilyHome) : null}
                    {multiFamilyHomeUnit ? water(multiFamilyHomeUnit) : null}
                    {manufacturedHome ? water(manufacturedHome) : null}

                    {/* Power */}

                    {singleFamilyHome ? power(singleFamilyHome) : null}
                    {apartment ? power(apartment) : null}
                    {apartmentBuilding ? water(apartmentBuilding) : null}
                    {condo ? power(condo) : null}
                    {multiFamilyHome ? power(multiFamilyHome) : null}
                    {multiFamilyHomeUnit ? power(multiFamilyHomeUnit) : null}
                    {manufacturedHome ? power(manufacturedHome) : null}

                    <div className={styles.feature}>
                      <RulerSVG />
                      Square Feet: {singleFamilyHome?.squareFeet.formatted}
                      {multiFamilyHome?.squareFeet.formatted}
                      {multiFamilyHomeUnit?.squareFeet.formatted}
                      {apartment?.squareFeet.formatted}
                      {apartmentBuilding?.squareFeet.formatted}
                      {condo?.squareFeet.formatted}
                      {manufacturedHome?.squareFeet.formatted}
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

                    {/* Bedrooms */}
                    {singleFamilyHome ||
                    multiFamilyHome ||
                    multiFamilyHomeUnit ||
                    apartment ||
                    apartmentBuilding ||
                    condo ||
                    manufacturedHome ? (
                      <div className={styles.feature}>
                        <BedSVG />
                        Bedrooms: {singleFamilyHome?.bedrooms.number}
                        {multiFamilyHome?.bedrooms.number}
                        {multiFamilyHomeUnit?.bedrooms.number}
                        {apartment?.bedrooms.number}
                        {apartmentBuilding?.bedrooms.number}
                        {condo?.bedrooms.number}
                        {manufacturedHome?.bedrooms.number}
                      </div>
                    ) : null}

                    {/* Full Bathrooms */}
                    {singleFamilyHome ||
                    multiFamilyHome ||
                    multiFamilyHomeUnit ||
                    apartment ||
                    apartmentBuilding ||
                    condo ||
                    manufacturedHome ? (
                      <div className={styles.feature}>
                        <BathSVG />
                        Full Bathrooms: {singleFamilyHome?.fullBathrooms.number}
                        {multiFamilyHome?.fullBathrooms.number}
                        {multiFamilyHomeUnit?.fullBathrooms.number}
                        {apartment?.fullBathrooms.number}
                        {apartmentBuilding?.fullBathrooms.number}
                        {condo?.fullBathrooms.number}
                        {manufacturedHome?.fullBathrooms.number}
                      </div>
                    ) : null}

                    {/* Half Bathrooms */}
                    {singleFamilyHome ||
                    multiFamilyHome ||
                    multiFamilyHomeUnit ||
                    apartment ||
                    apartmentBuilding ||
                    condo ||
                    manufacturedHome ? (
                      <div className={styles.feature}>
                        <ToiletSVG />
                        Half Bathrooms: {
                          singleFamilyHome?.halfBathrooms.number
                        }{" "}
                        {multiFamilyHome?.halfBathrooms.number}
                        {multiFamilyHomeUnit?.halfBathrooms.number}
                        {apartment?.halfBathrooms.number}
                        {apartmentBuilding?.halfBathrooms.number}
                        {condo?.halfBathrooms.number}
                        {manufacturedHome?.halfBathrooms.number}
                      </div>
                    ) : null}

                    {/* Number of stories */}
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

                    {/* Elevator Access */}
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
                    Lot Size: {land.acres.formatted} {" Acres"}
                  </div>
                ) : null}

                {singleFamilyHome ? (
                  <div className={styles.feature}>
                    <MapSVG />
                    Lot Size: {singleFamilyHome.acres.formatted} {" Acres"}
                  </div>
                ) : null}
              </div>

              <p className={styles.description}>
                {basicInfo.description.value}
              </p>
              <div className={styles["listed-by"]}>
                {agent ? (
                  <span>
                    Listed by: <br />
                    {agent.firstName.value}{" "}
                    {agent.middleName.value.length > 0
                      ? agent.middleName.value
                      : null}{" "}
                    {agent.lastName.value}
                    <br />
                    DRE# {agent.licenseId.value} <br />
                    Phone# {agent.phoneNumber.formatted}
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
        </div>
      </div>
    );
  }

  return <div className={styles.contents}>No listing found...</div>;
}
