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
  AddressValidationApi_Response,
  Image,
  ListingData,
} from "../../../types/index";
import { initListingData } from "../../../initialValues";
import UserAcknowledgementForm from "./components/UserAcknowledgementForm";
import PageBtns from "./components/PageBtns";

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
import ReviewForm from "./components/ReviewPage";
import makeFileNameForUpload from "../utils/makeFileNameForUpload";
import Footer from "../../shared/footer/Footer";

import styles from "./styles.module.scss";

export default function CreateListingPage(): JSX.Element {
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ListingData>(initListingData);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

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
    console.log("Form ref changed: ", state.page);
    window.scrollTo(0, 0);
  }, [state.page]);

  /**
   * Handle the forms submission
   * @param e FormEvent - submit state
   */
  async function handleSubmit() {
    console.log("Submit Form Triggered");
    setLoading(true);

    /**
     * Store an image in firestore
     * @param file File
     * @returns {file: undefined, url: string} of Image
     */
    async function storeImage(file: File): Promise<Image> {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = makeFileNameForUpload(state.userRef.uid, file.name);
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        if (!state.userRef.uid) {
          throw new Error("Bad userRef.uid");
        } else if (!file.name) {
          throw new Error("Bad file.name");
        } else if (!fileName) {
          throw new Error("Bad fileName.");
        } else if (!storageRef) {
          throw new Error("Bad storageRef.");
        } else if (!uploadTask) {
          throw new Error("Bad uploadTask.");
        }

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({ name: fileName, url: downloadURL });
            });
          }
        );
      });
    }

    const _images = await Promise.all(
      state.uploads.images.value.map((image) => storeImage(image.file!))
    ).catch(() => {
      setLoading(false);
      toast.warn("All images must be 2MB or less.");
      console.warn("All images must be 2MB or less, image upload failed.");
      return;
    });

    let formDataCopy: ListingData = { ...state };

    if (_images && _images.length > 0) {
      formDataCopy = {
        ...state,
        uploads: {
          ...state.uploads,
          images: {
            ...state.uploads.images,
            value: _images,
          },
        },
        timestamp: serverTimestamp(),
      };

      /**
       * Upload formDataCopy to Firestore
       */
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);

      /**
       * Listing form data submitted successfully
       */
      setLoading(false);
      toast.success("Listing Created");
      localStorage.removeItem("unfinished-listing");
      navigate(
        `/explore-listings/details/${formDataCopy.address.formattedAddress.value}/${docRef.id}`
      );
    } else {
      toast.warn("Uploading at least one image is required!");
      setLoading(false);
      throw new Error("Uploading at least one image is required!");
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

  function deleteListing() {
    if (window.confirm("Delete your progress, are you sure?")) {
      localStorage.removeItem("unfinished-listing");
      setState(initListingData);
      navigate("/profile");
    }
  }

  function handleEmit(
    obj: ListingData,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    setState(obj);

    // Don't use local storage to keep images
    const s: typeof state = {
      ...obj,
      uploads: {
        ...obj.uploads,
        images: {
          ...obj.uploads.images,
          value: [],
        },
      },
    };
    localStorage.setItem("unfinished-listing", JSON.stringify(s));
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
          <BasicInfoForm
            parent={state}
            prevPage={prevPage}
            nextPage={nextPage}
            toPageNumber={toPageNumber}
            pageNumbers={state.savedPages}
            currentPage={state.page}
            deleteListing={deleteListing}
            emit={handleEmit}
          />

          <Footer />
        </div>
      );

    case 3:
      return (
        <>
          <div className={styles.container}>
            <form ref={formRef} className={styles.form}>
              <ListingAddressForm
                parent={state}
                prevPage={prevPage}
                nextPage={nextPage}
                toPageNumber={toPageNumber}
                pageNumbers={state.savedPages}
                currentPage={state.page}
                showMap={true}
                deleteListing={deleteListing}
                emit={handleEmit}
              />
            </form>
          </div>
          <Footer />
        </>
      );

    case 4:
      return (
        <>
          <div className={styles.container}>
            <form ref={formRef} className={styles.form}>
              {state.basicInfo.forSaleBy !== undefined ? (
                <>
                  {state.basicInfo.forSaleBy.value?.id === "agent" ? (
                    <AgentForm
                      parent={state}
                      nextPage={nextPage}
                      prevPage={prevPage}
                      toPageNumber={toPageNumber}
                      pageNumbers={state.savedPages}
                      currentPage={state.page}
                      deleteListing={deleteListing}
                      emit={handleEmit}
                    />
                  ) : null}
                  {state.basicInfo.forSaleBy.value?.id === "owner" ? (
                    <OwnerForm
                      parent={state}
                      nextPage={nextPage}
                      prevPage={prevPage}
                      toPageNumber={toPageNumber}
                      pageNumbers={state.savedPages}
                      currentPage={state.page}
                      deleteListing={deleteListing}
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
                      pageNumbers={state.savedPages}
                      currentPage={state.page}
                      deleteListing={deleteListing}
                      emit={handleEmit}
                    />
                  ) : state.basicInfo.forRentBy.value?.id ===
                    "private-owner" ? (
                    <PrivateOwnerForm
                      parent={state}
                      nextPage={nextPage}
                      prevPage={prevPage}
                      toPageNumber={toPageNumber}
                      pageNumbers={state.savedPages}
                      currentPage={state.page}
                      deleteListing={deleteListing}
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
          </div>
          <Footer />
        </>
      );

    case 5:
      return (
        <>
          <div className={styles.container}>
            <form ref={formRef} className={styles.form}>
              {state.basicInfo.listingKind.value?.id ===
              "single-family-home" ? (
                <SingleFamilyHomeForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.page}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : state.basicInfo.listingKind.value?.id ===
                "multi-family-home" ? (
                <MultiFamilyHomeForSaleForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.page}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : state.basicInfo.listingKind.value?.id ===
                "multi-family-home-unit" ? (
                <MultiFamilyHomeUnitForRentForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.page}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : state.basicInfo.listingKind.value?.id ===
                "apartment-building" ? (
                <ApartmentBuildingForSaleForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.page}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : state.basicInfo.listingKind.value?.id === "apartment" ? (
                <ApartmentForRentForm
                  parent={state}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  toPageNumber={toPageNumber}
                  pageNumbers={state.savedPages}
                  currentPage={state.page}
                  deleteListing={deleteListing}
                  emit={handleEmit}
                />
              ) : (
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
          </div>
          <Footer />
        </>
      );

    case 6:
      return (
        <div className={styles.container}>
          <form ref={formRef} className={styles.form}>
            <UploadsForm
              parent={state}
              nextPage={nextPage}
              prevPage={prevPage}
              toPageNumber={toPageNumber}
              pageNumbers={state.savedPages}
              currentPage={state.page}
              deleteListing={deleteListing}
              emit={handleEmit}
            />
          </form>
        </div>
      );

    case 7:
      return (
        <div className={styles.container}>
          <form ref={formRef} className={styles.form}>
            <ReviewForm
              editListing={false}
              parent={state}
              prevPage={prevPage}
              toPageNumber={toPageNumber}
              pageNumbers={state.savedPages}
              currentPage={state.page}
              deleteListing={deleteListing}
              emit={handleEmit}
              submit={handleSubmit}
            />
            <PageBtns
              deleteListing={deleteListing}
              prevPage={prevPage}
              toPageNumber={toPageNumber}
              pageNumbers={state.savedPages}
              currentPage={state.page}
            />
          </form>
        </div>
      );

    default:
      return <div>Error...</div>;
  }
}
