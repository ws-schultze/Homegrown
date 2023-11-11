import { useState } from "react";
import useSetUserRefToListing from "../components/hooks/useSetUserRefToLIsting";
import { useDispatch } from "react-redux";
import { setListing } from "../createListingPageSlice";
import { useAppSelector } from "../../../../redux/hooks";
import Spinner from "../../../shared/loaders/Spinner";
import styles from "../styles.module.scss";
import UserAcknowledgementForm from "../components/UserAcknowledgementForm";
import Pagination from "../components/Pagination";
import Footer from "../../../shared/footer/Footer";

export default function CreateListingPage1() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);
  const { listing } = pageState;

  function handleUserId(userId: string) {
    dispatch(
      setListing({
        ...listing,
        userRef: {
          ...listing.userRef,
          uid: userId,
        },
      })
    );
  }

  useSetUserRefToListing(setLoading, handleUserId);

  if (loading) return <Spinner size="large" />;

  return (
    <div className={styles.container}>
      <UserAcknowledgementForm />
      {pageState.userAcknowledged ? <Pagination /> : null}
      <Footer />
    </div>
  );
}
