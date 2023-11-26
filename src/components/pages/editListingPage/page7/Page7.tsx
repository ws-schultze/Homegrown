import Footer from "../../../shared/footer/Footer";
import Pagination from "../shared/Pagination";
import styles from "../styles.module.scss";
import ReviewForm from "./forms/ReviewForm";

export default function Page7() {
  return (
    <div className={styles.container}>
      <ReviewForm thisPageNum={7} />
      <Pagination />
      <Footer />
    </div>
  );
}
