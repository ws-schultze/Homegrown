import React from "react";
import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import { useAppSelector } from "../../../../redux/hooks";
import SingleFamilyHomeForm from "./forms/SingleFamilyHomeForm";
import MultiFamilyHomeForSaleForm from "./forms/MultiFamilyHomeForSaleForm";
import MultiFamilyHomeUnitForRentForm from "./forms/MultiFamilyHomeUnitForRentForm";
import ApartmentBuildingForSaleForm from "./forms/ApartmentBuildingForSaleForm";
import ApartmentForRentForm from "./forms/ApartmentForRentForm";
import Error from "../../../shared/error/Error";
import CondoForm from "./forms/CondoForm";
import TownhouseForm from "./forms/TownhouseForm";
import LandForm from "./forms/LandForm";

export default function Page5() {
  const state = useAppSelector((s) => s.editListingPage);
  const { listingKind } = state.listing.basicInfo;
  let id = "";

  if (state.listing.basicInfo.listingKind.value) {
    id = state.listing.basicInfo.listingKind.value.id;
  }

  if (listingKind.value === null) {
    return (
      <div className={styles.container}>
        <form style={{ justifyContent: "center", fontSize: "18px" }}>
          <section>
            <p>Please complete page 2 in order to populate this page.</p>
          </section>
        </form>
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "single-family-home") {
    return (
      <div className={styles.container}>
        <SingleFamilyHomeForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "apartment") {
    return (
      <div className={styles.container}>
        <ApartmentForRentForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "apartment-building") {
    return (
      <div className={styles.container}>
        <ApartmentBuildingForSaleForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "multi-family-home") {
    return (
      <div className={styles.container}>
        <MultiFamilyHomeForSaleForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "multi-family-home-unit") {
    return (
      <div className={styles.container}>
        <MultiFamilyHomeUnitForRentForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "condo") {
    return (
      <div className={styles.container}>
        <CondoForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "townhouse") {
    return (
      <div className={styles.container}>
        <TownhouseForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  if (id === "land") {
    return (
      <div className={styles.container}>
        <LandForm thisPageNum={5} />
        <Pagination />
        <Footer />
      </div>
    );
  }

  return <Error msg="This form could not be found" />;
}
