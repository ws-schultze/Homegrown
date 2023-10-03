import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
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
import { TypeAddressValidationApi_Response, TypeListingData } from "../../..";
import { initListingData } from "../../../initialValues";
import Review from "../createListing/components/ReviewForm";
import PageBtns from "../createListing/components/PageBtns";
import SingleFamilyHome from "../createListing/components/SingleFamilyHomeForm";
import UserAcknowledgementForm from "../createListing/components/UserAcknowledgementForm";
import MultiFamilyHomeForSaleForm from "../createListing/components/MultiFamilyHomeForSaleForm";
import MultiFamilyHomeUnitForRentForm from "../createListing/components/MultiFamilyHomeUnitForRentForm";
import ApartmentBuildingForSaleForm from "../createListing/components/ApartmentBuildingForSaleForm";
import ApartmentForRentForm from "../createListing/components/ApartmentForRentForm";
import CompanyForm from "../createListing/components/CompanyForm";
import PrivateOwnerForm from "../createListing/components/PrivateOwnerForm";
import OwnerForm from "../createListing/components/OwnerForm";
import AgentForm from "../createListing/components/AgentForm";
import ListingAddressForm from "../createListing/components/ListingAddressForm";
import BasicInfoForm from "../createListing/components/BasicInfoForm";
import UploadsEditForm from "../createListing/components/UploadsEditForm";
import deleteImageFromFirestore from "../utils/deleteImageFromFirestore";

export default function EditListing() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<TypeListingData>(initListingData);
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
          const listing = docSnap.data() as TypeListingData;
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

  // Set userRef to logged in user's uuid
  // useEffect(() => {
  //   if (isMounted) {
  //     // Add the user to state
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         // userRef NOT useRef. This will be set in state
  //         setFormData({ ...formData, userRef: user.uid });
  //       } else {
  //         navigate("/sign-in");
  //       }
  //     });
  //   }

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [isMounted]);

  //   const onSubmit = async (e) => {
  //     setLoading(true);
  //     e.preventDefault();

  //     // Prices
  //     // Since priceChange and regularPrice will enter as strings, use '+' to evaluate them as numbers.
  //     if (+priceChange >= +regularPrice) {
  //       setLoading(false);
  //       toast.error("priceChangeActive price must be less than regular price");
  //       return;
  //     }

  //     // imgUrls
  //     if (images.length > 6) {
  //       setLoading(false);
  //       toast.error("You can only upload 6 images per listing");
  //       return;
  //     }

  //     // Location
  //     let geolocation = {};
  //     let location;

  //     if (geolocationEnabled) {
  //       const response = await fetch(
  //         // In production use a .env file to place the api key
  //         `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  //       );

  //       const data = await response.json();

  //       geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
  //       geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

  //       location = data.status === "ZERO_RESULTS" ? undefined : data.results[0]?.formatted_address;

  //       console.log(location);

  //       if (location === undefined || location.includes("undefined")) {
  //         setLoading(false);
  //         toast.error("Please enter a correct address");
  //         return;
  //       }
  //     } else {
  //       geolocation.lat = latitude;
  //       geolocation.lng = longitude;
  //     }

  //     // Store image in firebase
  //     // See the docs at https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0#full_example
  //     // The following storeImage function is just like the #full_example in the docs link above
  //     const storeImage = async (image) => {
  //       return new Promise((resolve, reject) => {
  //         const storage = getStorage();
  //         const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
  //         const storageRef = ref(storage, "images/" + fileName);
  //         const uploadTask = uploadBytesResumable(storageRef, image);

  //         // Listen for state changes, errors, and completion of the upload.
  //         uploadTask.on(
  //           "state_changed",
  //           (snapshot) => {
  //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //             console.log("Upload is " + progress + "% done");
  //             switch (snapshot.state) {
  //               case "paused":
  //                 console.log("Upload is paused");
  //                 break;
  //               case "running":
  //                 console.log("Upload is running");
  //                 break;
  //               default:
  //                 break;
  //             }
  //           },
  //           (error) => {
  //             // A full list of error codes is available at
  //             // https://firebase.google.com/docs/storage/web/handle-errors
  //             reject(error);
  //           },
  //           () => {
  //             // Handle successful uploads on complete
  //             // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //               resolve(downloadURL);
  //             });
  //           }
  //         );
  //       });
  //     };

  //     // Create an array of image urls for all images being uploaded
  //     const imgUrls = await Promise.all([...images].map((image) => storeImage(image))).catch(() => {
  //       setLoading(false);
  //       toast.error("Images Not Uploaded");
  //       return;
  //     });

  //     const formDataCopy = {
  //       ...formData,
  //       imgUrls,
  //       geolocation,
  //       timestamp: serverTimestamp(),
  //     };

  //     // Do some cleanup on the form data to be submitted to db
  //     // 1) Since we made imgUrls we don't need the images
  //     // 2) If there is no offer, then we don't have a priceChangeActive price
  //     delete formDataCopy.images;
  //     delete formDataCopy.address;
  //     // formatted_address on geolocation is not reliable all the time, for example it may not say the unit or unit number
  //     // location && (formDataCopy.location = location)
  //     // Instead just use the value typed into the address part of the form
  //     formDataCopy.location = address;
  //     !formDataCopy.offer && delete formDataCopy.priceChange;

  //     // Update listing
  //     const docRef = doc(db, "listings", params.listingId);
  //     await updateDoc(docRef, formDataCopy);

  //     setLoading(false);
  //     toast.success("Listing Updated");
  //     navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  //   };

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
    obj: TypeListingData,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
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
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
            <UserAcknowledgementForm
              parent={state}
              nextPage={nextPage}
              toPageNumber={toPageNumber}
              deleteListing={deleteListing}
              pageNumbers={state.savedPages}
              currentPage={state.page}
              emit={handleEmit}
            />
          </form>
        </div>
      );

    case 2:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    case 3:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    case 4:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    case 5:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    case 6:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    case 7:
      return (
        <div className="page-wrap">
          <header>
            <p className="page__header">Update Listing</p>
          </header>
          <form className="listing-form">
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
        </div>
      );

    default:
      return <div>Error...</div>;
  }
}
