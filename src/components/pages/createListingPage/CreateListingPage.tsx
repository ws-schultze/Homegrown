import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../shared/loaders/Spinner";
import UserAcknowledgementForm from "./components/UserAcknowledgementForm";
import AgentForm from "./components/AgentForm";
import ListingAddressForm from "./components/ListingAddressForm";
import BasicInfoForm from "./components/BasicInfoForm";
import UploadsForm from "./components/UploadsForm";
import ReviewForm from "./components/ReviewForm";
import Footer from "../../shared/footer/Footer";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../redux/hooks";
import Pagination from "./components/Pagination";
import { useDispatch } from "react-redux";
import {
  setCurrentPageNumber,
  setListing,
  setLoading,
} from "./createListingPageSlice";
import useSetUserRefToListing from "./components/hooks/useSetUserRefToListing";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import useCurrentPageNumber from "./components/hooks/useCurrentPageNumber";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";

export default function CreateListingPage(): JSX.Element {
  const formRef = useRef<HTMLFormElement | null>(null);
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

  // // Add userId to state
  // useEffect(() => {
  //   setLoading(true);
  //   if (isAuthenticated && userId && !isLoading) {
  //     setState((s) => ({
  //       ...s,
  //       userRef: {
  //         ...s.userRef,
  //         uid: userId,
  //       },
  //     }));
  //     setLoading(false);
  //   } else if (!isAuthenticated && !isLoading) {
  //     navigate("/sign-in");
  //     setLoading(false);
  //   }
  // }, [isAuthenticated, userId]);

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

  // Return pages
  switch (state.currentPageNumber) {
    // case 1:
    //   return (
    //     <div className={styles.container}>
    //       <UserAcknowledgementForm />
    //       {state.userAcknowledged ? <Pagination /> : null}
    //       <Footer />
    //     </div>
    //   );

    // case 2:
    //   return (
    //     <div className={styles.container}>
    //       <BasicInfoForm />
    //       <Pagination />
    //       <Footer />
    //     </div>
    //   );

    // case 3:
    //   return (
    //     <div className={styles.container}>
    //       <ListingAddressForm />
    //       <Pagination />
    //       <Footer />
    //     </div>
    //   );

    case 4:
    // return (
    //   <div className={styles.container}>
    //     {listing.basicInfo.forSaleBy !== undefined ? (
    //       <>
    //         {listing.basicInfo.forSaleBy.value?.id === "agent" ? (
    //           <AgentForm />
    //         ) : null}
    //         {/* {listing.basicInfo.forSaleBy.value?.id === "owner" ? (
    //           <OwnerForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : null} */}
    //       </>
    //     ) : null}

    //     {/* listing.basicInfo.forRentBy !== undefined ? (
    //       <>
    //         {listing.basicInfo.forRentBy.value?.id === "company" ? (
    //           <CompanyForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : listing.basicInfo.forRentBy.value?.id === "private-owner" ? (
    //           <PrivateOwnerForm
    //             parent={state}
    //             nextPage={nextPage}
    //             prevPage={prevPage}
    //             toPageNumber={toPageNumber}
    //             pageNumbers={state.savedPages}
    //             currentPage={state.currentPage}
    //             deleteListing={deleteListing}
    //             emit={handleEmit}
    //           />
    //         ) : null}
    //       </>
    //     ) : (
    //       <div>
    //         ERROR..
    //         <Pagination />
    //       </div>
    //     )} */}

    //     <Footer />
    //   </div>
    // );

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
