import styles from "./features.module.scss";
import {
  Apartment,
  ApartmentBuilding,
  Condo,
  Land,
  ListingData,
  ManufacturedHome,
  MultiFamilyHome,
  MultiFamilyHomeUnit,
  SingleFamilyHome,
  Townhouse,
} from "../../../../../types";
import { ReactComponent as BuildingSVG } from "../../assets/building-regular.svg";
import { ReactComponent as CalendarSVG } from "../../assets/calendar-days-solid.svg";
import { ReactComponent as ThermometerSVG } from "../../assets/temperature-full-solid.svg";
import { ReactComponent as SnowflakeSVG } from "../../assets/snowflake-regular.svg";
import { ReactComponent as MapSVG } from "../../assets/mapIcon.svg";
import { ReactComponent as RulerSVG } from "../../assets/ruler-combined-solid.svg";
import { ReactComponent as MagnifyMoneySVG } from "../../assets/magnifying-glass-dollar-solid.svg";
import { ReactComponent as StairsSVG } from "../../assets/stairs-solid.svg";
import { ReactComponent as ElevatorSVG } from "../../assets/elevator-solid.svg";
import { ReactComponent as FaucetSVG } from "../../assets/faucet-drip-solid.svg";
import { ReactComponent as PlugSVG } from "../../assets/plug-solid.svg";
import { ReactComponent as BedSVG } from "../../assets/bed-solid.svg";
import { ReactComponent as BathSVG } from "../../assets/bath-solid.svg";
import { ReactComponent as ToiletSVG } from "../../assets/toilet-solid.svg";

interface Props {
  listing: ListingData;
}

export default function Features({ listing }: Props) {
  const {
    basicInfo,
    singleFamilyHome,
    multiFamilyHome,
    multiFamilyHomeUnit,
    manufacturedHome,
    apartment,
    condo,
    apartmentBuilding,
    townhouse,
    land,
  } = listing;

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
  function bedrooms(
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
        <BedSVG />
        Bedrooms: {listing.bedrooms.number}
      </div>
    );
  }
  function fullBathrooms(
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
        <BathSVG />
        Full bathrooms: {listing.fullBathrooms.number}
      </div>
    );
  }
  function halfBathrooms(
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
        <ToiletSVG />
        Half bathrooms: {listing.halfBathrooms.number}
      </div>
    );
  }
  function stories(
    listing:
      | SingleFamilyHome
      | MultiFamilyHome
      | MultiFamilyHomeUnit
      | ApartmentBuilding
      | Townhouse
  ): JSX.Element {
    return (
      <div className={styles.feature}>
        <StairsSVG />
        Stories: {listing.stories.number}
      </div>
    );
  }

  function floorNumber(listing: Apartment | Condo): JSX.Element {
    return (
      <div className={styles.feature}>
        <ElevatorSVG />
        Floor number: {listing.floorNumber.number}
      </div>
    );
  }

  function lotSize(listing: SingleFamilyHome | Land): JSX.Element {
    return (
      <div className={styles.feature}>
        <MapSVG />
        Lot size (acres): {listing.acres.formatted}
      </div>
    );
  }

  function pricePerSqft(listing: SingleFamilyHome): JSX.Element {
    return <></>;
  }
  // Does the name change work on github?
  // Try this again
  function yearBuilt(
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
        <CalendarSVG />
        Year built: {listing.yearBuilt.number}
      </div>
    );
  }

  return (
    <div className={styles.features}>
      <div className={styles.feature}>
        <BuildingSVG />
        Listing type: {basicInfo.listingKind.value?.label}
      </div>

      {singleFamilyHome ? yearBuilt(singleFamilyHome) : null}
      {multiFamilyHome ? yearBuilt(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? yearBuilt(multiFamilyHomeUnit) : null}
      {apartment ? yearBuilt(apartment) : null}
      {apartmentBuilding ? yearBuilt(apartmentBuilding) : null}
      {condo ? yearBuilt(condo) : null}
      {manufacturedHome ? yearBuilt(manufacturedHome) : null}
      {townhouse ? yearBuilt(townhouse) : null}

      {singleFamilyHome ? heating(singleFamilyHome) : null}
      {apartment ? heating(apartment) : null}
      {apartmentBuilding ? heating(apartmentBuilding) : null}
      {condo ? heating(condo) : null}
      {townhouse ? heating(townhouse) : null}
      {multiFamilyHome ? heating(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? heating(multiFamilyHomeUnit) : null}
      {manufacturedHome ? heating(manufacturedHome) : null}

      {singleFamilyHome ? cooling(singleFamilyHome) : null}
      {apartment ? cooling(apartment) : null}
      {apartmentBuilding ? cooling(apartmentBuilding) : null}
      {townhouse ? cooling(townhouse) : null}
      {condo ? cooling(condo) : null}
      {multiFamilyHome ? cooling(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? cooling(multiFamilyHomeUnit) : null}
      {manufacturedHome ? cooling(manufacturedHome) : null}

      {singleFamilyHome ? water(singleFamilyHome) : null}
      {apartment ? water(apartment) : null}
      {apartmentBuilding ? water(apartmentBuilding) : null}
      {townhouse ? water(townhouse) : null}
      {condo ? water(condo) : null}
      {multiFamilyHome ? water(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? water(multiFamilyHomeUnit) : null}
      {manufacturedHome ? water(manufacturedHome) : null}

      {singleFamilyHome ? power(singleFamilyHome) : null}
      {apartment ? power(apartment) : null}
      {apartmentBuilding ? water(apartmentBuilding) : null}
      {townhouse ? power(townhouse) : null}
      {condo ? power(condo) : null}
      {multiFamilyHome ? power(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? power(multiFamilyHomeUnit) : null}
      {manufacturedHome ? power(manufacturedHome) : null}

      <div className={styles.feature}>
        <RulerSVG />
        Square feet: {singleFamilyHome?.squareFeet.formatted}
        {multiFamilyHome?.squareFeet.formatted}
        {multiFamilyHomeUnit?.squareFeet.formatted}
        {apartment?.squareFeet.formatted}
        {apartmentBuilding?.squareFeet.formatted}
        {townhouse?.squareFeet.formatted}
        {condo?.squareFeet.formatted}
        {manufacturedHome?.squareFeet.formatted}
      </div>

      {singleFamilyHome && basicInfo.priceChange.number > 0 ? (
        <div className={styles.feature}>
          <MagnifyMoneySVG />
          Price per sqft: ${""}
          {(
            basicInfo.priceChange.number / singleFamilyHome?.squareFeet.number
          ).toFixed(0)}
        </div>
      ) : singleFamilyHome && basicInfo.priceChange.number === 0 ? (
        <div className={styles.feature}>
          <MagnifyMoneySVG />
          Price per sqft: $
          {(
            basicInfo.price.number / singleFamilyHome?.squareFeet.number
          ).toFixed(0)}
        </div>
      ) : null}

      {singleFamilyHome ? bedrooms(singleFamilyHome) : null}
      {multiFamilyHome ? bedrooms(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? bedrooms(multiFamilyHomeUnit) : null}
      {apartment ? bedrooms(apartment) : null}
      {apartmentBuilding ? bedrooms(apartmentBuilding) : null}
      {townhouse ? bedrooms(townhouse) : null}
      {condo ? bedrooms(condo) : null}

      {singleFamilyHome ? fullBathrooms(singleFamilyHome) : null}
      {multiFamilyHome ? fullBathrooms(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? fullBathrooms(multiFamilyHomeUnit) : null}
      {apartment ? fullBathrooms(apartment) : null}
      {apartmentBuilding ? fullBathrooms(apartmentBuilding) : null}
      {townhouse ? fullBathrooms(townhouse) : null}
      {condo ? fullBathrooms(condo) : null}

      {singleFamilyHome ? halfBathrooms(singleFamilyHome) : null}
      {multiFamilyHome ? halfBathrooms(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? halfBathrooms(multiFamilyHomeUnit) : null}
      {apartment ? halfBathrooms(apartment) : null}
      {apartmentBuilding ? halfBathrooms(apartmentBuilding) : null}
      {townhouse ? halfBathrooms(townhouse) : null}
      {condo ? halfBathrooms(condo) : null}

      {singleFamilyHome ? stories(singleFamilyHome) : null}
      {multiFamilyHome ? stories(multiFamilyHome) : null}
      {multiFamilyHomeUnit ? stories(multiFamilyHomeUnit) : null}
      {apartmentBuilding ? stories(apartmentBuilding) : null}
      {townhouse ? stories(townhouse) : null}

      {apartment ? floorNumber(apartment) : null}
      {condo ? floorNumber(condo) : null}

      {/* {land ? (
        <div className={styles.feature}>
          <MapSVG />
          Lot Size: {land.acres.formatted} {" Acres"}
        </div>
      ) : null} */}
      {land ? lotSize(land) : null}
      {singleFamilyHome ? lotSize(singleFamilyHome) : null}
    </div>
  );
}
