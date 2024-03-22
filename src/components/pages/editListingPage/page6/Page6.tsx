import Pagination from "../shared/Pagination";
import Footer from "../../../shared/footer/Footer";
import styles from "../styles.module.scss";
import UploadsEditForm from "./forms/UploadsEditForm";
import { Uploads } from "../../../../types/index";
import { Dispatch, SetStateAction } from "react";
import { FormProps } from "../types/formProps";
import { Helmet } from "react-helmet";

interface Props {
  uploads: Uploads;
  setUploads: Dispatch<SetStateAction<Uploads>>;
}

export default function Page6(props: Props) {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Homegrown | Edit listing</title>
        <meta name="edit-listing" content="edit listing page 6" />
      </Helmet>
      <UploadsEditForm
        thisPageNum={6}
        uploads={props.uploads}
        setUploads={props.setUploads}
      />
      <Pagination />
      <Footer />
    </div>
  );
}
