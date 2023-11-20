import { useEffect, useState } from "react";
import Spinner from "../../shared/loaders/Spinner";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import Page1 from "./page1/Page1";
import Page2 from "./page2/Page2";
import useCurrentPageNumber from "./hooks/useCurrentPageNumber";
import Page3 from "./page3/Page3";
import Page4 from "./page4/Page4";
import Page5 from "./page5/Page5";
import Page6 from "./page6/Page6";
import Page7 from "./page7/Page7";
import { Image, ListingData, Uploads } from "../../../types/index";
import { initUploads } from "../../../initialValues";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { toast } from "react-toastify";
import deleteImageFromFirestore from "../utils/deleteImageFromFirestore";
import { useUserContext } from "../../../UserProvider";
import { useNavigate, useParams } from "react-router";
import Error from "../../shared/error/Error";
import {
  setCurrentPageNumber,
  setListing,
  setLoading,
} from "./editListingPageSlice";

export default function EditListingPage() {
  const state = useAppSelector((s) => s.editListingPage);
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  useCurrentPageNumber((num) => dispatch(setCurrentPageNumber(num)));

  // Add userId to state
  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && userId && !isLoading) {
      // setState((s) => ({
      //   ...s,
      //   userRef: {
      //     ...s.userRef,
      //     uid: userId,
      //   },
      // }));
      // dispatch(setListing({
      //   ...state.listing,
      //   userRef: {
      //     ...state.listing.userRef,
      //     uid:
      //   }
      // }))
      setLoading(false);
    } else if (!isAuthenticated && !isLoading) {
      navigate("/sign-in");
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Fetch the listing to edit
  useEffect(() => {
    dispatch(setLoading(true));
    const fetchListing = async () => {
      if (params.listingId) {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const listing = docSnap.data() as ListingData;
          // dispatch(setListingId(params.listingId));
          // const { ...serializable, timestamp } = listing;
          dispatch(
            setListing({
              ...listing,
              timestamp: JSON.stringify(listing.timestamp),
            })
          );
          dispatch(setLoading(false));
        } else {
          navigate("/");
          console.error("listing does not exist");
          toast.error("Listing does not exist");
        }
      } else {
        dispatch(setLoading(false));
        console.error("No listingId found in params");
      }
    };

    fetchListing();
  }, []);

  // /**
  //  * Handle the forms submission
  //  * @param e FormEvent - submit state
  //  */
  // async function handleSubmitListingEdit() {
  //   console.log("Submitting Edit...");
  //   setLoading(true);

  //   if (params.listingId) {
  //     // Update listing

  //     let s: DocumentData = { ...state, timestamp: serverTimestamp() };
  //     const docRef = doc(db, "listings", params.listingId);
  //     await updateDoc(docRef, s);
  //     setLoading(false);
  //     toast.success("Listing Updated");
  //     navigate(
  //       `/explore-listings/details/${state.listing.address.formattedAddress.value}/${docRef.id}`
  //     );
  //   } else {
  //     console.error("No listingId passed as a param from App.js");
  //   }
  // }

  async function deleteListing() {
    if (window.confirm("Are you sure that you want to delete this listing?")) {
      dispatch(setLoading(true));

      // Delete images from the listing from storage
      await Promise.all(
        state.listing.uploads.images.value.map((image: Image) =>
          deleteImageFromFirestore(image)
        )
      ).catch(() => {
        dispatch(setLoading(false));
        console.warn("Delete image failed");
        return;
      });

      // Delete the listing from firestore
      if (params.listingId) {
        await deleteDoc(doc(db, "listings", params.listingId));
      } else {
        console.error("No listingId found in params");
        return;
      }

      dispatch(setLoading(false));
      navigate("/profile");
      toast.success("Listing successfully deleted");
    }
  }

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

  return <Error msg="Something went wrong." />;
}
