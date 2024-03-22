import { useAppSelector } from "../../../../redux/hooks";
import styles from "../styles.module.scss";
import UserAcknowledgementForm from "./forms/UserAcknowledgementForm";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import { Helmet } from "react-helmet";

export default function Page1() {
  const state = useAppSelector((s) => s.createListingPage);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Edit listing</title>
        <meta name="edit-listing" content="edit listing page 1" />
      </Helmet>
      <UserAcknowledgementForm thisPageNum={1} />
      {state.userAcknowledged ? <Pagination /> : null}
      <Footer />
    </div>
  );
}
