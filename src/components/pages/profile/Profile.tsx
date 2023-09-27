import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TypeFetchedListing, TypeListingData, TypeStr } from "../../..";
import deleteImageFromFirestore from "../utils/deleteImageFromFirestore";
import InputTypeStr from "../../common/inputTypeStr/InputTypeStr";
import { ReactComponent as EditUserSVG } from "../../../assets/svg/user-pen-solid.svg";
import { ReactComponent as MoneySVG } from "../../../assets/svg/circle-dollar-to-slot-solid.svg";
import { ReactComponent as SignOutSVG } from "../../../assets/svg/person-running-solid.svg";
import { ReactComponent as SubmitChangesSVG } from "../../../assets/svg/cloud-arrow-up-solid.svg";
import { initTypeStrReq } from "../../../initialValues";
import ListingCard from "../../common/listingCard/ListingCard";

import { Btn, BtnsContainer, Header, LinkBtn } from "./styledComponents";

export interface TypeProfile {
  userName: TypeStr;
  email: TypeStr;
  listings: TypeFetchedListing[] | [];
  unfinishedListing: TypeListingData | null;
  loading: boolean;
}

export const initProfile: TypeProfile = {
  userName: initTypeStrReq,
  email: initTypeStrReq,
  listings: [],
  unfinishedListing: null,
  loading: true,
};

export default function Profile() {
  const [state, setState] = useState<TypeProfile>(initProfile);
  const auth = getAuth();
  const navigate = useNavigate();

  // const { signedIn, checkingStatus } = useAuthStatus();

  // Fetch the user's listings
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      if (
        auth.currentUser &&
        auth.currentUser.displayName !== null &&
        auth.currentUser.email !== null
      ) {
        const q = query(
          listingsRef,
          where("userRef.uid", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );
        const querySnap = await getDocs(q);

        let listings: TypeFetchedListing[] = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            //@ts-ignore
            data: doc.data(),
          });
        });

        // Get unfinished listings from local storage
        let unfinishedListing = localStorage.getItem("unfinished-listing");
        if (unfinishedListing !== null) {
          unfinishedListing = JSON.parse(unfinishedListing);
        }

        //Get user info to populate the state
        const s: TypeProfile = {
          ...state,
          userName: {
            ...state.userName,
            value: auth.currentUser.displayName,
            formatted: auth.currentUser.displayName,
            readOnly: true,
          },
          email: {
            ...state.email,
            value: auth.currentUser.email,
            formatted: auth.currentUser.email,
            readOnly: true,
          },
          listings: listings,
          //@ts-ignore
          unfinishedListing: unfinishedListing,
          loading: false,
        };
        setState(s);
      } else {
        console.log("No authorized user found...");
      }
    };
    fetchUserListings();
  }, [auth.currentUser]);

  /**
   * Sign the user out
   */
  async function handleSignOut(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setState((s) => ({
      ...s,
      loading: true,
    }));
    // setLoading(true);
    await auth.signOut();
    navigate("/");
    toast.success("You have been successfully signed out");
    setState((s) => ({
      ...s,
      loading: false,
    }));
    // setLoading(false);
  }

  /**
   * Update the user's profile
   */
  async function handleSubmit() {
    try {
      if (
        auth.currentUser &&
        auth.currentUser.displayName !== state.userName.value
      ) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: state.userName.value,
        });

        // Update display name in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: state.userName.value,
        });
      }
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Could not update profile...");
    }
  }

  async function handleDelete(listingId: string) {
    if (window.confirm("Are you sure that you want to delete this listing?")) {
      const listing = state.listings.filter(
        (listings) => listings.id === listingId
      )[0];

      setState((s) => ({
        ...s,
        loading: true,
      }));

      // Delete images of the given listing from firestore
      await Promise.all(
        listing.data.uploads.images.value.map((image) =>
          deleteImageFromFirestore(image)
        )
      ).catch(() => {
        setState((s) => ({
          ...s,
          loading: false,
        }));
        console.warn(`Image not deleted`);
        return;
      });

      // Delete the listing from firestore
      await deleteDoc(doc(db, "listings", listingId));

      // Refresh the listings on the profile page
      const updatedListings = state.listings.filter(
        (listings) => listings.id !== listingId
      );

      setState((s) => ({
        ...s,
        listings: updatedListings,
      }));

      toast.success("Listing Successfully Deleted");
    }
  }

  function handleEdit(listingId: string) {
    navigate(`/edit-listing/${listingId}`);
  }

  function handleInputTypeStr(object: TypeStr, fieldName: keyof typeof state) {
    setState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  function handleReadOnly() {
    if (state.userName.readOnly === false && state.email.readOnly === false) {
      // Click submit profile details changes
      handleSubmit();
    }

    // Toggle readyOnly on profile details inputs
    const s: TypeProfile = {
      ...state,
      userName: {
        ...state.userName,
        readOnly: !state.userName.readOnly,
      },
      email: {
        ...state.email,
        readOnly: !state.email.readOnly,
      },
    };
    setState(s);
  }

  return (
    <div className="page-wrap">
      <div className="profile-wrap">
        <main className="profile">
          {state.loading === false ? (
            <section>
              <Header>Personal Details</Header>
              <div>
                <form className="personal-details-form">
                  <InputTypeStr<typeof state>
                    size="lg"
                    fieldName="userName"
                    placeholder="Username"
                    formatType="name"
                    parent={state.userName}
                    emit={handleInputTypeStr}
                  />
                  <InputTypeStr<typeof state>
                    size="lg"
                    fieldName="email"
                    placeholder="Email"
                    formatType="email"
                    parent={state.email}
                    emit={handleInputTypeStr}
                  />
                  <Btn type="button" onClick={handleReadOnly}>
                    {state.userName.readOnly === false &&
                    state.email.readOnly === false ? (
                      <>
                        <SubmitChangesSVG /> Submit Changes
                      </>
                    ) : (
                      <>
                        <EditUserSVG /> Edit Details
                      </>
                    )}
                  </Btn>
                </form>
              </div>
              <BtnsContainer>
                {state.unfinishedListing === null ? (
                  <LinkBtn to="/create-listing" className="profile__btn">
                    <MoneySVG />
                    <p>List a Property</p>
                  </LinkBtn>
                ) : (
                  <LinkBtn to="/create-listing" className="profile__btn">
                    <MoneySVG />
                    <p>Continue Listing</p>
                  </LinkBtn>
                )}
                <Btn type="button" onClick={handleSignOut}>
                  <SignOutSVG />
                  Sign Out
                </Btn>
              </BtnsContainer>
            </section>
          ) : null}

          <section>
            <Header>My Listings</Header>
            <div className="my-listings-wrap">
              {state.loading === false && state.listings?.length > 0 ? (
                <>
                  {state.listings.map((listing, index) => (
                    <ListingCard
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      key={listing.id}
                      listing={listing}
                    />
                  ))}
                </>
              ) : (
                <>
                  <p>You have no listings.</p>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
