import { useState, useEffect } from "react";
import { db } from "../../../firebase.config";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../shared/loaders/Spinner";
import { toast } from "react-toastify";
import { useUserContext } from "../../../UserProvider";
import {
  AddressValidationApi_Response,
  ListingData,
} from "../../../types/index";
import { initListingData } from "../../../initialValues";
import Review from "./components/ReviewPage";
import PageBtns from "./components/PageBtns";
import SingleFamilyHome from "./components/SingleFamilyHomeForm";
import UserAcknowledgementForm from "./components/UserAcknowledgementForm";
import MultiFamilyHomeForSaleForm from "./components/MultiFamilyHomeForSaleForm";
import MultiFamilyHomeUnitForRentForm from "./components/MultiFamilyHomeUnitForRentForm";
import ApartmentBuildingForSaleForm from "./components/ApartmentBuildingForSaleForm";
import ApartmentForRentForm from "./components/ApartmentForRentForm";
import CompanyForm from "./components/CompanyForm";
import PrivateOwnerForm from "./components/PrivateOwnerForm";
import OwnerForm from "./components/OwnerForm";
import AgentForm from "./components/AgentForm";
import ListingAddressForm from "./components/ListingAddressForm";
import BasicInfoForm from "./components/BasicInfoForm";
import UploadsEditForm from "./components/UploadsEditForm";
import deleteImageFromFirestore from "../utils/deleteImageFromFirestore";
import styles from "./styles.module.scss";
import Footer from "../../shared/footer/Footer";

export default function EditListingPage() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ListingData>(initListingData);
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();
  const params = useParams();
  const pageNumbers = [1, 2, 3, 4, 5, 6, 7];

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

  // Fetch the listing to edit
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      if (params.listingId) {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const listing = docSnap.data() as ListingData;
          setState({ ...listing });
          setLoading(false);
        } else {
          navigate("/");
          toast.error("Listing does not exist");
        }
      } else {
        throw new Error("No listingId was passed as a param from App.js");
      }
    };

    fetchListing();
  }, [params.listingId]);

  /**
   * Handle the forms submission
   * @param e FormEvent - submit state
   */
  async function handleSubmit() {
    console.log("Submitting Edit...");
    setLoading(true);

    if (params.listingId) {
      // Update listing

      let s: DocumentData = { ...state, timestamp: serverTimestamp() };
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, s);
      setLoading(false);
      toast.success("Listing Updated");
      console.log("Edit submission success...");
      navigate(
        `/explore-listings/details/${state.address.formattedAddress.value}/${docRef.id}`
      );
    } else {
      throw new Error("No listingId passed as a param from App.js");
    }
  }

  function nextPage() {
    const { page } = state;
    setState((s) => ({
      ...s,
      page: page + 1,
    }));
  }

  function prevPage() {
    const { page } = state;
    setState((s) => ({
      ...s,
      page: page - 1,
    }));
  }

  function toPageNumber(number: number) {
    console.log("to page number clicked");
    setState((s) => ({
      ...s,
      page: number,
    }));
  }

  function handleEmit(
    obj: ListingData,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    setState(obj);
  }

  async function deleteListing() {
    if (window.confirm("Are you sure that you want to delete this listing?")) {
      setState((s) => ({
        ...s,
        loading: true,
      }));

      // Delete images from the listing from storage
      await Promise.all(
        state.uploads.images.value.map((image) =>
          deleteImageFromFirestore(image)
        )
      ).catch(() => {
        setState((s) => ({
          ...s,
          loading: false,
        }));
        console.warn("Delete image failed");
        return;
      });

      // Delete the listing from firestore
      if (params.listingId) {
        await deleteDoc(doc(db, "listings", params.listingId));
      } else {
        throw new Error("Whoops, no listing ID found in params");
      }

      navigate("/profile");
      toast.success("Listing Successfully Deleted");
    }
  }

  if (loading) {
    return <Spinner size="large" />;
  }

  // Return pages
  switch (state.page) {
    case 1:
      return (
        <div className={styles.container}>
          <UserAcknowledgementForm
            parent={state}
            nextPage={nextPage}
            toPageNumber={toPageNumber}
            pageNumbers={state.savedPages}
            currentPage={state.page}
            deleteListing={deleteListing}
            emit={handleEmit}
          />
          {state.userAcknowledged === true ? (
            <PageBtns
              deleteListing={deleteListing}
              nextPage={nextPage}
              toPageNumber={toPageNumber}
              pageNumbers={state.savedPages}
              currentPage={state.page}
            />
          ) : null}
          <Footer />
        </div>
      );

    case 2:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            <BasicInfoForm
              deleteListing={deleteListing}
              parent={state}
              prevPage={prevPage}
              nextPage={nextPage}
              toPageNumber={toPageNumber}
              pageNumbers={pageNumbers}
              currentPage={state.page}
              emit={handleEmit}
            />
          </form>
          <Footer />
        </div>
      );

    case 3:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            <ListingAddressForm
              parent={state}
              prevPage={prevPage}
              nextPage={nextPage}
              toPageNumber={toPageNumber}
              deleteListing={deleteListing}
              pageNumbers={pageNumbers}
              currentPage={state.page}
              showMap={true}
              emit={handleEmit}
            />
          </form>
          <Footer />
        </div>
      );

    case 4:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            {state.basicInfo.forSaleBy !== undefined ? (
              <>
                {state.basicInfo.forSaleBy.value?.id === "agent" ? (
                  <AgentForm
                    parent={state}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    toPageNumber={toPageNumber}
                    pageNumbers={pageNumbers}
                    deleteListing={deleteListing}
                    currentPage={state.page}
                    emit={handleEmit}
                  />
                ) : null}

                {state.basicInfo.forSaleBy.value?.id === "owner" ? (
                  <OwnerForm
                    parent={state}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    deleteListing={deleteListing}
                    toPageNumber={toPageNumber}
                    pageNumbers={pageNumbers}
                    currentPage={state.page}
                    emit={handleEmit}
                  />
                ) : null}
              </>
            ) : state.basicInfo.forRentBy !== undefined ? (
              <>
                {state.basicInfo.forRentBy.value?.id === "company" ? (
                  <CompanyForm
                    parent={state}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    toPageNumber={toPageNumber}
                    pageNumbers={pageNumbers}
                    deleteListing={deleteListing}
                    currentPage={state.page}
                    emit={handleEmit}
                  />
                ) : state.basicInfo.forRentBy.value?.id === "private-owner" ? (
                  <PrivateOwnerForm
                    parent={state}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    toPageNumber={toPageNumber}
                    deleteListing={deleteListing}
                    pageNumbers={pageNumbers}
                    currentPage={state.page}
                    emit={handleEmit}
                  />
                ) : null}
              </>
            ) : (
              <div>
                ERROR..
                <PageBtns
                  deleteListing={deleteListing}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  toPageNumber={toPageNumber}
                />
              </div>
            )}
          </form>
          <Footer />
        </div>
      );

    case 5:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            {state.basicInfo.listingKind.value?.id === "single-family-home" ? (
              <SingleFamilyHome
                parent={state}
                nextPage={nextPage}
                prevPage={prevPage}
                toPageNumber={toPageNumber}
                deleteListing={deleteListing}
                pageNumbers={pageNumbers}
                currentPage={state.page}
                emit={handleEmit}
              />
            ) : state.basicInfo.listingKind.value?.id ===
              "multi-family-home" ? (
              <MultiFamilyHomeForSaleForm
                parent={state}
                nextPage={nextPage}
                prevPage={prevPage}
                toPageNumber={toPageNumber}
                deleteListing={deleteListing}
                pageNumbers={pageNumbers}
                currentPage={state.page}
                emit={handleEmit}
              />
            ) : state.basicInfo.listingKind.value?.id ===
              "multi-family-home-unit" ? (
              <MultiFamilyHomeUnitForRentForm
                parent={state}
                nextPage={nextPage}
                prevPage={prevPage}
                toPageNumber={toPageNumber}
                deleteListing={deleteListing}
                pageNumbers={pageNumbers}
                currentPage={state.page}
                emit={handleEmit}
              />
            ) : state.basicInfo.listingKind.value?.id ===
              "apartment-building" ? (
              <ApartmentBuildingForSaleForm
                parent={state}
                nextPage={nextPage}
                prevPage={prevPage}
                toPageNumber={toPageNumber}
                deleteListing={deleteListing}
                pageNumbers={pageNumbers}
                currentPage={state.page}
                emit={handleEmit}
              />
            ) : state.basicInfo.listingKind.value?.id === "apartment" ? (
              <ApartmentForRentForm
                parent={state}
                nextPage={nextPage}
                prevPage={prevPage}
                toPageNumber={toPageNumber}
                deleteListing={deleteListing}
                pageNumbers={pageNumbers}
                currentPage={state.page}
                emit={handleEmit}
              />
            ) : (
              // : state.basicInfo.listingKind.value?.id === "manufacturedHome" ? (
              //   <ManufacturedHome
              //     nextPage={nextPage}
              //     prevPage={prevPage}
              //     showMap={false}
              //     parent={state}
              //     forSaleOrRentChoice={state.basicInfo.forSaleOrRent}
              //     emit={handleEmit}
              //   />
              // )

              // : state.basicInfo.listingKind.value?.id === "apartment" ? (
              //   <Apartment
              //     nextPage={nextPage}
              //     prevPage={prevPage}
              //     showMap={false}
              //     parent={state}
              //     forSaleOrRentChoice={state.basicInfo.forSaleOrRent}
              //     emit={handleEmit}
              //   />
              // )

              // : state.basicInfo.listingKind.value?.id === "townhouse" ? (
              //   <Townhouse
              //     nextPage={nextPage}
              //     prevPage={prevPage}
              //     showMap={false}
              //     parent={state}
              //     forSaleOrRentChoice={state.basicInfo.forSaleOrRent}
              //     emit={handleEmit}
              //   />
              // )

              // : state.basicInfo.listingKind.value?.id === "condo" ? (
              //   <Condo
              //     nextPage={nextPage}
              //     prevPage={prevPage}
              //     showMap={false}
              //     parent={state}
              //     forSaleOrRentChoice={state.basicInfo.forSaleOrRent}
              //     emit={handleEmit}
              //   />
              // )

              // : state.basicInfo.listingKind.value?.id === "land" ? (
              //   <Land
              //     nextPage={nextPage}
              //     prevPage={prevPage}
              //     showMap={false}
              //     parent={state}
              //     forSaleOrRentChoice={state.basicInfo.forSaleOrRent}
              //     emit={handleEmit}
              //   />
              // )

              <div>
                ERROR..
                <PageBtns
                  deleteListing={deleteListing}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  toPageNumber={toPageNumber}
                />
              </div>
            )}
          </form>
          <Footer />
        </div>
      );

    case 6:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            <UploadsEditForm
              parent={state}
              listingId={params.listingId!}
              nextPage={nextPage}
              prevPage={prevPage}
              toPageNumber={toPageNumber}
              deleteListing={deleteListing}
              pageNumbers={pageNumbers}
              currentPage={state.page}
              emit={handleEmit}
            />
          </form>
          <Footer />
        </div>
      );

    case 7:
      return (
        <div className={styles.container}>
          <form className={styles.form}>
            <Review
              editListing={true}
              parent={state}
              prevPage={prevPage}
              toPageNumber={toPageNumber}
              deleteListing={deleteListing}
              pageNumbers={pageNumbers}
              currentPage={state.page}
              emit={handleEmit}
              submit={handleSubmit}
            />
          </form>
          <PageBtns
            deleteListing={deleteListing}
            prevPage={prevPage}
            toPageNumber={toPageNumber}
            pageNumbers={state.savedPages}
            currentPage={state.page}
          />
          <Footer />
        </div>
      );

    default:
      return <div>Error...</div>;
  }
}
