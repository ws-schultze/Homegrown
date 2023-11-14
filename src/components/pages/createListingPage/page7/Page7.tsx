import { Uploads } from "../../../../types";
import Footer from "../../../shared/footer/Footer";
import Pagination from "../shared/Pagination";
import styles from "../styles.module.scss";
import ReviewForm from "./forms/ReviewForm";

interface Props {
  uploads: Uploads;
}

export default function Page7(props: Props) {
  return (
    <div className={styles.container}>
      <ReviewForm thisPageNum={7} uploads={props.uploads} />
      <Pagination />
      <Footer />
    </div>
  );
}
