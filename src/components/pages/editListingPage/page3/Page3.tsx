import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import ListingAddressForm from "./forms/ListingAddressForm";
import { Helmet } from "react-helmet";

export default function Page3() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Edit listing</title>
        <meta name="edit-listing" content="edit listing page 3" />
      </Helmet>
      <ListingAddressForm thisPageNum={3} />
      <Pagination />
      <Footer />
    </div>
  );
}
