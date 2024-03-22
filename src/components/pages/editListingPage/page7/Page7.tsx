import { Helmet } from "react-helmet";
import Footer from "../../../shared/footer/Footer";
import Pagination from "../shared/Pagination";
import styles from "../styles.module.scss";
import ReviewForm from "./forms/ReviewForm";

export default function Page7() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Edit listing</title>
        <meta name="edit-listing" content="edit listing page 7" />
      </Helmet>
      <ReviewForm thisPageNum={7} />
      <Pagination />
      <Footer />
    </div>
  );
}
