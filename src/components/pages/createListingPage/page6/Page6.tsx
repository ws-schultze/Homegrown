import UploadsForm from "./forms/UploadsForm";
import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import styles from "../styles.module.scss";
import { Uploads } from "../../../../types";
import { Dispatch, SetStateAction } from "react";

export default function Page6({
  uploads,
  setUploads,
}: {
  uploads: Uploads;
  setUploads: Dispatch<SetStateAction<Uploads>>;
}) {
  return (
    <div className={styles.container}>
      <UploadsForm thisPageNum={6} setUploads={setUploads} uploads={uploads} />
      <Pagination />
      <Footer />
    </div>
  );
}
