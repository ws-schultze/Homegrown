import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../shared/loaders/Spinner";
import UserAcknowledgementForm from "./page1/forms/UserAcknowledgementForm";
import AgentForm from "./page4/forms/AgentForm";
import ListingAddressForm from "./page3/forms/ListingAddressForm";
import BasicInfoForm from "./page2/forms/BasicInfoForm";
import UploadsForm from "./page6/forms/UploadsForm";
import ReviewForm from "./page7/forms/ReviewForm";
import Footer from "../../shared/footer/Footer";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../redux/hooks";
import Pagination from "./shared/Pagination";
import { useDispatch } from "react-redux";
import {
  setCurrentPageNumber,
  setListing,
  setLoading,
} from "./createListingPageSlice";
import useSetUserRefToListing from "./hooks/useSetUserRefToListing";
import Page1 from "./page1/Page1";
import Page2 from "./page2/Page2";
import useCurrentPageNumber from "./hooks/useCurrentPageNumber";
import Page3 from "./page3/Page3";
import Page4 from "./page4/Page4";
import Page5 from "./page5/Page5";
import Page6 from "./page6/Page6";
import Page7 from "./page7/Page7";
import Error from "../../shared/error/Error";

export default function CreateListingPage(): JSX.Element {
  const dispatch = useDispatch();
  const state = useAppSelector((s) => s.createListingPage);
  const listing = state.listing;

  useCurrentPageNumber((num) => dispatch(setCurrentPageNumber(num)));

  useSetUserRefToListing(
    (loading) => dispatch(setLoading(loading)),
    (userId) =>
      dispatch(
        setListing({ ...listing, userRef: { ...listing.userRef, uid: userId } })
      )
  );

  // useEffect(() => {
  //   // const unfinishedListing = localStorage.getItem("unfinished-listing");
  //   if (listing) {
  //     console.log("Setting state from local storage");
  //     const s: typeof state = JSON.parse(unfinishedListing);

  //     // Don't get images from local storage
  //     const t: typeof state = {
  //       ...s,
  //       uploads: {
  //         ...s.uploads,
  //         images: {
  //           ...s.uploads.images,
  //           value: [],
  //           valid: false,
  //           saved: false,
  //         },
  //       },
  //     };

  //     setState(t);
  //   }
  // }, []);

  useEffect(() => {
    document.getElementById("main-container")?.scrollTo(0, 0);
  }, [state.currentPageNumber]);

  if (state.loading) {
    return <Spinner size="large" />;
  }

  if (state.currentPageNumber === 1) {
    return <Page1 />;
  }

  if (state.currentPageNumber === 2) {
    return <Page2 />;
  }

  if (state.currentPageNumber === 3) {
    return <Page3 />;
  }

  if (state.currentPageNumber === 4) {
    return <Page4 />;
  }

  if (state.currentPageNumber === 5) {
    return <Page5 />;
  }

  if (state.currentPageNumber === 6) {
    return <Page6 />;
  }

  if (state.currentPageNumber === 7) {
    return <Page7 />;
  }

  return <Error msg="The page could not be found" />;
}
