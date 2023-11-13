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
import { ManufacturedHome } from "../../../../types/index";
import Error from "../../../shared/error/Error";

export default function Page5() {
  const state = useAppSelector((s) => s.createListingPage);
  const { listingKind } = state.listing.basicInfo;

  const { id } = state.listing.basicInfo.listingKind.value!;

  if (listingKind.value === null) {
    return (
      <div className={styles.container}>
        <form>
          <section>
            <p>Please complete page 2 in order to populate this page.</p>
          </section>
          <Pagination />
          <Footer />
        </form>
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
        {/* <ApartmentForRentForm thisPageNum={5} /> */}
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
        {/* <MultiFamilyHomeUnitForRentForm thisPageNum={5} /> */}
        <Pagination />
        <Footer />
      </div>
    );
  }

  return <Error msg="This form could not be found" />;
}
