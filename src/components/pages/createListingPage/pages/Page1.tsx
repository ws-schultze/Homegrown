import { useAppSelector } from "../../../../redux/hooks";
import styles from "../styles.module.scss";
import UserAcknowledgementForm from "../components/UserAcknowledgementForm";
import Pagination from "../components/Pagination";
import Footer from "../../../shared/footer/Footer";

export default function Page1() {
  const state = useAppSelector((s) => s.createListingPage);

  return (
    <div className={styles.container}>
      <UserAcknowledgementForm thisPageNum={1} />
      {state.userAcknowledged ? <Pagination /> : null}
      <Footer />
    </div>
  );
}
