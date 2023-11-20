import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import ListingAddressForm from "./forms/ListingAddressForm";

export default function Page3() {
  return (
    <div className={styles.container}>
      <ListingAddressForm thisPageNum={3} />
      <Pagination />
      <Footer />
    </div>
  );
}
