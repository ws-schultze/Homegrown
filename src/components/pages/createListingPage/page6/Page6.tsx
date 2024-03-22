import UploadsForm from "./forms/UploadsForm";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import styles from "../styles.module.scss";
import { Uploads } from "../../../../types";
import { Dispatch, SetStateAction } from "react";
import { Helmet } from "react-helmet";

export default function Page6({
  uploads,
  setUploads,
}: {
  uploads: Uploads;
  setUploads: Dispatch<SetStateAction<Uploads>>;
}) {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Create listing</title>
        <meta name="create-listing" content="create listing page 6" />
      </Helmet>
      <UploadsForm thisPageNum={6} setUploads={setUploads} uploads={uploads} />
      <Pagination />
      <Footer />
    </div>
  );
}
