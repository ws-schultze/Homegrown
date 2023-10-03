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
import { TypeFetchedListing, TypeListingData } from "../../..";
import deleteImageFromFirestore from "../utils/deleteImageFromFirestore";
import { ReactComponent as EditUserSVG } from "../../../assets/svg/user-pen-solid.svg";
import { ReactComponent as MoneySVG } from "../../../assets/svg/circle-dollar-to-slot-solid.svg";
import { ReactComponent as SignOutSVG } from "../../../assets/svg/person-running-solid.svg";
import { ReactComponent as SubmitChangesSVG } from "../../../assets/svg/cloud-arrow-up-solid.svg";
import ListingCard from "../../shared/listingCard/ListingCard";
import { Btn, BtnsContainer, Header, LinkBtn } from "./styledComponents";
import UsernameInput, {
  Username,
} from "../../shared/inputs/usernameInput/UsernameInput";
import EmailInput, { Email } from "../../shared/inputs/emailInput/EmailInput";

export interface TypeProfile {
  username: Username;
  email: Email;
  listings: TypeFetchedListing[] | [];
  unfinishedListing: TypeListingData | null;
  loading: boolean;
  editable: boolean;
}

export default function Profile() {
  const [state, setState] = useState<TypeProfile>({
    username: {
      value: "",
      errorMsg: "",
      valid: false,
      readOnly: true,
      required: true,
    },
    email: {
      value: "",
      errorMsg: "",
      valid: false,
      readOnly: true,
      required: true,
    },
    listings: [],
    unfinishedListing: null,
    loading: true,
    editable: false,
  });
  const auth = getAuth();
  const navigate = useNavigate();

  // const { signedIn, checkingStatus } = useAuthStatus();

  // Fetch the user's listings
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      if (auth.currentUser) {
        if (auth.currentUser.displayName !== null) {
          if (auth.currentUser.email !== null) {
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

            if (auth.currentUser.displayName) {
            }
            //Get user info to populate the state
            const s: TypeProfile = {
              ...state,
              username: {
                ...state.username,
                value: auth.currentUser.displayName,
                readOnly: true,
              },
              email: {
                ...state.email,
                value: auth.currentUser.email,
                readOnly: true,
              },
              listings: listings,
              //@ts-ignore
              unfinishedListing: unfinishedListing,
              loading: false,
            };
            setState(s);
          } else {
            console.error("auth.currentUser.email is null");
          }
        } else {
          console.error("auth.currentUser.displayName is null");
        }
      } else {
        console.error("auth.currentUser is undefined");
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
  async function handleSubmitDetailsUpdate() {
    try {
      if (auth.currentUser) {
        if (auth.currentUser.displayName !== state.username.value) {
          // Update display name in firebase
          await updateProfile(auth.currentUser, {
            displayName: state.username.value,
          });

          // Update display name in firestore
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, {
            username: state.username.value,
            email: state.email.value,
          });

          setState((s) => ({
            ...s,
            username: {
              ...s.username,
              readOnly: true,
            },
            email: {
              ...s.email,
              readOnly: true,
            },
            editable: false,
          }));

          toast.success("Profile Updated Successfully");
        } else {
          console.error(
            `auth.currentUser.displayName == state.username.value => ${auth.currentUser.displayName} ==? ${state.username.value}`
          );
        }
      } else {
        console.error("auth.currentUser is undefined");
      }
    } catch (error) {
      toast.error("Could not update profile");
      //@ts-ignore
      console.error(error.message);
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

  function handleUsername(username: Username) {
    // Set the username
    setState((s) => ({
      ...s,
      username: username,
    }));
  }

  function handleEmail(email: Email) {
    // Set the email
    setState((s) => ({
      ...s,
      email: email,
    }));
  }

  function handleEditDetails() {
    // Make username and email editable
    console.log("Making details editable");
    setState((s) => ({
      ...s,
      username: {
        ...s.username,
        readOnly: false,
      },
      email: {
        ...s.email,
        readOnly: false,
      },
      editable: true,
    }));
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
                  <UsernameInput
                    value={state.username.value}
                    emit={handleUsername}
                    readonly={state.username.readOnly}
                  />
                  <EmailInput
                    value={state.email.value}
                    emit={handleEmail}
                    readonly={state.email.readOnly}
                  />
                  {state.editable === false ? (
                    <Btn type="button" onClick={handleEditDetails}>
                      <EditUserSVG /> Edit Details
                    </Btn>
                  ) : (
                    <Btn type="button" onClick={handleSubmitDetailsUpdate}>
                      <SubmitChangesSVG /> Submit Updates
                    </Btn>
                  )}
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
