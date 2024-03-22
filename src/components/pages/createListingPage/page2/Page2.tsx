import styles from "../styles.module.scss";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import BasicInfoForm from "./forms/BasicInfoForm";
import { Helmet } from "react-helmet";

export default function Page2() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Create listing</title>
        <meta name="create-listing" content="create listing page 2" />
      </Helmet>
      <BasicInfoForm thisPageNum={2} />
      <Pagination />
      <Footer />
    </div>
  );
}
