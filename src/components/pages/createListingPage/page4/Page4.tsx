import AgentForm from "./forms/AgentForm";
import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import { useAppSelector } from "../../../../redux/hooks";
import OwnerForm from "./forms/OwnerForm";
import CompanyForm from "./forms/CompanyForm";
import PrivateOwnerForm from "./forms/PrivateOwnerForm";

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
          {basicInfo.forSaleBy.value?.id === "owner" ? (
            <OwnerForm thisPageNum={4} />
          ) : null}
        </>
      ) : null}

      {basicInfo.forRentBy !== undefined ? (
        <>
          {basicInfo.forRentBy.value?.id === "company" ? (
            <CompanyForm thisPageNum={4} />
          ) : basicInfo.forRentBy.value?.id === "private-owner" ? (
            <PrivateOwnerForm thisPageNum={4} />
          ) : null}
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
