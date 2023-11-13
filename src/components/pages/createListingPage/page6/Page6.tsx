import UploadsForm from "./forms/UploadsForm";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import styles from "../styles.module.scss";

export default function Page6() {
  return (
    <div className={styles.container}>
      {/* <UploadsForm thisPageNum={6} /> */}
      <Pagination />
      <Footer />
    </div>
  );
}
