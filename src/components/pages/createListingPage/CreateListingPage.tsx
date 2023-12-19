import { useEffect, useState } from "react";
import Spinner from "../../shared/loaders/Spinner";
import { useAppSelector } from "../../../redux/hooks";
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
import { Uploads } from "../../../types/index";
import { initUploads } from "../../../initialValues";

export default function CreateListingPage(): JSX.Element {
  const dispatch = useDispatch();
  const state = useAppSelector((s) => s.createListingPage);
  const listing = state.listing;
  const [uploads, setUploads] = useState<Uploads>(initUploads);

  useCurrentPageNumber((num) => dispatch(setCurrentPageNumber(num)));

  useSetUserRefToListing(
    (loading) => dispatch(setLoading(loading)),
    (userId) =>
      dispatch(
        setListing({ ...listing, userRef: { ...listing.userRef, uid: userId } })
      )
  );

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
    return <Page6 setUploads={setUploads} uploads={uploads} />;
  }

  if (state.currentPageNumber === 7) {
    return <Page7 uploads={uploads} />;
  }

  return <Error msg="The page could not be found" />;
}
