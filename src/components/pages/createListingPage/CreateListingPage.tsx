import { useState, useEffect, useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../../../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Spinner from "../../shared/loaders/Spinner";
import { toast } from "react-toastify";
import { useUserContext } from "../../../UserProvider";
import {
  Address,
  AddressValidationApi_Response,
  Image,
  ListingData,
  VerifyActionName,
} from "../../../types/index";
import { initListingData } from "../../../initialValues";
import UserAcknowledgementForm from "./components/UserAcknowledgementForm";
import PageBtns from "./components/PageBtns-old";

// import Review from "./components/ReviewForm";
// import Uploads from "./components/UploadsForm";
import SingleFamilyHomeForm from "./components/SingleFamilyHomeForm";
import MultiFamilyHomeForSaleForm from "./components/MultiFamilyHomeForSaleForm";
import MultiFamilyHomeUnitForRentForm from "./components/MultiFamilyHomeUnitForRentForm";
import ApartmentBuildingForSaleForm from "./components/ApartmentBuildingForSaleForm";
import ApartmentForRentForm from "./components/ApartmentForRentForm";
import OwnerForm from "./components/OwnerForm";
import AgentForm from "./components/AgentForm";
import CompanyForm from "./components/CompanyForm";
import PrivateOwnerForm from "./components/PrivateOwnerForm";
import ListingAddressForm from "./components/ListingAddressForm";
import BasicInfoForm from "./components/BasicInfoForm";
import UploadsForm from "./components/UploadsForm";
import ReviewForm from "./components/ReviewForm";
import makeFileNameForUpload from "../utils/makeFileNameForUpload";
import Footer from "../../shared/footer/Footer";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
import Pagination from "./components/Pagination";
// import AddressInput from "../../shared/inputs/addressInput/AddressInput";

export default function CreateListingPage(): JSX.Element {
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ListingData>(initListingData);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;

  useEffect(() => {
    const unfinishedListing = localStorage.getItem("unfinished-listing");
    if (unfinishedListing !== null) {
      console.log("Setting state from local storage");
      const s: typeof state = JSON.parse(unfinishedListing);

      // Don't get images from local storage
      const t: typeof state = {
        ...s,
        uploads: {
          ...s.uploads,
          images: {
            ...s.uploads.images,
            value: [],
            valid: false,
            saved: false,
          },
        },
      };

      setState(t);
    }
  }, []);

  // Add userId to state
  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && userId && !isLoading) {
      setState((s) => ({
        ...s,
        userRef: {
          ...s.userRef,
          uid: userId,
        },
      }));
      setLoading(false);
    } else if (!isAuthenticated && !isLoading) {
      navigate("/sign-in");
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    console.log("scrolling to top");
    document.getElementById("main-container")?.scrollTo(0, 0);
  }, [pageState.currentPageNumber]);

  if (loading) {
    return <Spinner size="large" />;
  }

  // Return pages
  switch (pageState.currentPageNumber) {
    case 1:
      return (
        <div className={styles.container}>
          <UserAcknowledgementForm />
          {pageState.userAcknowledged ? <Pagination /> : null}
          <Footer />
        </div>
      );

    case 2:
      return (
        <div className={styles.container}>
          <BasicInfoForm />
          <Pagination />
          <Footer />
        </div>
      );

    case 3:
      return (
        <div className={styles.container}>
          <ListingAddressForm />
          <Pagination />
          <Footer />
        </div>
      );

    case 4:
      return (
        <div className={styles.container}>
          {listing.basicInfo.forSaleBy !== undefined ? (
            <>
              {listing.basicInfo.forSaleBy.value?.id === "agent" ? (
                <AgentForm />
              ) : null}
              {/* {listing.basicInfo.forSaleBy.value?.id === "owner" ? (
                <OwnerForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : null} */}
            </>
          ) : null}

          {/* listing.basicInfo.forRentBy !== undefined ? (
            <>
              {listing.basicInfo.forRentBy.value?.id === "company" ? (
                <CompanyForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : listing.basicInfo.forRentBy.value?.id === "private-owner" ? (
                <PrivateOwnerForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.currentPage}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : null}
            </>
          ) : (
            <div>
              ERROR..
              <Pagination />
            </div>
          )} */}

          <Footer />
        </div>
      );

    case 5:
    // return <></>;
    // return (
    //   <>
    //     <div className={styles.container}>
    //       <form ref={formRef} className={styles.form}>
    //         {listing.basicInfo.listingKind.value?.id ===
    //         "single-family-home" ? (
    //           <SingleFamilyHomeForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : listing.basicInfo.listingKind.value?.id ===
    //           "multi-family-home" ? (
    //           <MultiFamilyHomeForSaleForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : listing.basicInfo.listingKind.value?.id ===
    //           "multi-family-home-unit" ? (
    //           <MultiFamilyHomeUnitForRentForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : listing.basicInfo.listingKind.value?.id ===
    //           "apartment-building" ? (
    //           <ApartmentBuildingForSaleForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : listing.basicInfo.listingKind.value?.id === "apartment" ? (
    //           <ApartmentForRentForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : (
    //           // : listing.basicInfo.listingKind.value?.id === "apartment" ? (
    //           //   <Apartment
    //           //     nextPage={nextPage}
    //           //     prevPage={prevPage}
    //           //     showMap={false}
    //           //     parent={state}
    //           //     forSaleOrRentChoice={listing.basicInfo.forSaleOrRent}
    //           //     emit={handleEmit}
    //           //   />
    //           // )

    //           // : listing.basicInfo.listingKind.value?.id === "townhouse" ? (
    //           //   <Townhouse
    //           //     nextPage={nextPage}
    //           //     prevPage={prevPage}
    //           //     showMap={false}
    //           //     parent={state}
    //           //     forSaleOrRentChoice={listing.basicInfo.forSaleOrRent}
    //           //     emit={handleEmit}
    //           //   />
    //           // )

    //           // : listing.basicInfo.listingKind.value?.id === "condo" ? (
    //           //   <Condo
    //           //     nextPage={nextPage}
    //           //     prevPage={prevPage}
    //           //     showMap={false}
    //           //     parent={state}
    //           //     forSaleOrRentChoice={listing.basicInfo.forSaleOrRent}
    //           //     emit={handleEmit}
    //           //   />
    //           // )

    //           // : listing.basicInfo.listingKind.value?.id === "land" ? (
    //           //   <Land
    //           //     nextPage={nextPage}
    //           //     prevPage={prevPage}
    //           //     showMap={false}
    //           //     parent={state}
    //           //     forSaleOrRentChoice={listing.basicInfo.forSaleOrRent}
    //           //     emit={handleEmit}
    //           //   />
    //           // )

    //           <div>
    //             ERROR..
    //             <Pagination />
    //           </div>
    //         )}
    //       </form>
    //     </div>
    //     <Footer />
    //   </>
    // );

    case 6:
      return (
        <div className={styles.container}>
          <form ref={formRef} className={styles.form}>
            <UploadsForm />
            <Pagination />
          </form>
        </div>
      );

    case 7:
      return (
        <div className={styles.container}>
          <ReviewForm />
          <Pagination />
        </div>
      );

    default:
      return <div>Error...</div>;
  }
}
