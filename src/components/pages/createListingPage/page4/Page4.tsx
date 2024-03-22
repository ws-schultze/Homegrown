import AgentForm from "./forms/AgentForm";
import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import { useAppSelector } from "../../../../redux/hooks";
import OwnerForm from "./forms/OwnerForm";
import CompanyForm from "./forms/CompanyForm";
import PrivateOwnerForm from "./forms/PrivateOwnerForm";
import { Helmet } from "react-helmet";

export default function Page4() {
  const state = useAppSelector((s) => s.createListingPage);
  const { basicInfo } = state.listing;

  if (basicInfo.forSaleBy) {
    if (basicInfo.forSaleBy.value?.id === "agent") {
      return (
        <div className={styles.container}>
          <Helmet>
            <title>Homegrown | Create listing</title>
            <meta name="create-listing" content="create listing page 4" />
          </Helmet>
          <AgentForm thisPageNum={4} />
          <Pagination />
          <Footer />
        </div>
      );
    }

    if (basicInfo.forSaleBy.value?.id === "owner") {
      return (
        <div className={styles.container}>
          <Helmet>
            <title>Homegrown | Create listing</title>
            <meta name="create-listing" content="create listing page 4" />
          </Helmet>
          <OwnerForm thisPageNum={4} />
          <Pagination />
          <Footer />
        </div>
      );
    }
  }

  if (basicInfo.forRentBy) {
    if (basicInfo.forRentBy.value?.id === "company") {
      return (
        <div className={styles.container}>
          <Helmet>
            <title>Homegrown | Create listing</title>
            <meta name="create-listing" content="create listing page 4" />
          </Helmet>
          <CompanyForm thisPageNum={4} />
          <Pagination />
          <Footer />
        </div>
      );
    }

    if (basicInfo.forRentBy.value?.id === "private-owner") {
      return (
        <div className={styles.container}>
          <Helmet>
            <title>Homegrown | Create listing</title>
            <meta name="create-listing" content="create listing page 4" />
          </Helmet>
          <PrivateOwnerForm thisPageNum={4} />
          <Pagination />
          <Footer />
        </div>
      );
    }
  }

  if (!basicInfo.forRentBy && !basicInfo.forSaleBy) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Homegrown | Create listing</title>
          <meta name="create-listing" content="create listing page 4" />
        </Helmet>
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

  if (basicInfo.forRentBy && basicInfo.forRentBy?.value === null) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Homegrown | Create listing</title>
          <meta name="create-listing" content="create listing page 4" />
        </Helmet>
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

  if (basicInfo.forSaleBy && basicInfo.forSaleBy?.value === null) {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Homegrown | Create listing</title>
          <meta name="create-listing" content="create listing page 4" />
        </Helmet>
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

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Create listing</title>
        <meta name="create-listing" content="create listing page 4" />
      </Helmet>
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
