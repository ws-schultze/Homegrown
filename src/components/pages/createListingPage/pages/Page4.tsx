import React from "react";
import AgentForm from "../components/AgentForm";
import styles from "../styles.module.scss";
import Pagination from "../components/Pagination";
import Footer from "../../../shared/footer/Footer";
import { useAppSelector } from "../../../../redux/hooks";
import { FormProps } from "../components/formProps";

export default function Page4() {
  const state = useAppSelector((s) => s.createListingPage);
  const { basicInfo } = state.listing;
  return (
    <div className={styles.container}>
      {basicInfo.forSaleBy !== undefined ? (
        <>
          {basicInfo.forSaleBy.value?.id === "agent" ? (
            <AgentForm thisPageNum={4} />
          ) : null}
          {/* {basicInfo.forSaleBy.value?.id === "owner" ? (
                <OwnerForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : null} */}
        </>
      ) : null}

      {basicInfo.forRentBy !== undefined ? (
        <>
          {/* {basicInfo.forRentBy.value?.id === "company" ? (
                <CompanyForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : basicInfo.forRentBy.value?.id === "private-owner" ? (
                <PrivateOwnerForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : null} */}
        </>
      ) : null}

      {basicInfo.forRentBy === undefined &&
      basicInfo.forSaleBy === undefined ? (
        <form>
          <section>
            <p>Please complete page 2 in order to populate this page.</p>
          </section>
        </form>
      ) : null}

      <Pagination />
      <Footer />
    </div>
  );
}
