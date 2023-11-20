import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import styles from "../styles.module.scss";
import UploadsEditForm from "./forms/UploadsEditForm";

export default function Page6() {
  return (
    <div className={styles.container}>
      <UploadsEditForm thisPageNum={6} />
      <Pagination />
      <Footer />
    </div>
  );
}
