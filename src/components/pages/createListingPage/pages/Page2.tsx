import styles from "../styles.module.scss";
import Pagination from "../components/Pagination";
import Footer from "../../../shared/footer/Footer";
import BasicInfoForm from "../components/BasicInfoForm";

export default function Page2() {
  return (
    <div className={styles.container}>
      <BasicInfoForm thisPageNum={2} />
      <Pagination />
      <Footer />
    </div>
  );
}
