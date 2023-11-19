import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../../shared/loaders/Spinner";
import styles from "./contactLandlordPage.module.scss";
import ListingCard from "../../shared/listingCard/ListingCard";
import { FetchedListing, TypeFetchedListingData } from "../../../types/index";
import useScreenSize from "../../../hooks/useScreenSize";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
import Footer from "../../shared/footer/Footer";

export default function ContactLandlordPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState<DocumentData | null>(null);
  const [listing, setListing] = useState<FetchedListing | null>(null);
  const screenSize = useScreenSizeContext();
  const params = useParams();

  // Fetch landlord
  useEffect(() => {
    const getLandlord = async () => {
      if (params.landlordId) {
        const docRef = doc(db, "users", params.landlordId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        } else {
          toast.error(`Could not find the given landlord data`);
        }
      }
    };
    getLandlord();
  }, [params.landlordId]);

  // Fetch listing
  useEffect(() => {
    async function fetchListing() {
      if (params.listingId) {
        console.log("getting listing data for ", params.listingId);
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TypeFetchedListingData;
          setListing({ id: params.listingId, data: data });
          setLoading(false);
        } else {
          console.error("docSnap.exists() is undefined");
        }
      }
    }
    fetchListing();
  }, [params.listingId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  if (loading) {
    return <Spinner size="large" />;
  }

  if (landlord !== null && listing !== null) {
    return (
      <>
        <div className={styles.container}>
          <header>
            <p className={styles["landlord-name"]}>
              {listing.data.agent
                ? `Listing Agent: ${listing.data.agent.firstName.value} ${listing.data.agent.lastName.value}`
                : listing.data.privateOwner
                ? `Property Owner: ${listing.data.privateOwner.firstName.value} ${listing.data.privateOwner.lastName.value}`
                : listing.data.company
                ? `Property Management Company: ${listing.data.company.name.value}`
                : listing.data.owner
                ? `Property Owner: ${listing.data.owner.firstName.value} ${listing.data.owner.lastName.value}`
                : null}
            </p>
            <ListingCard
              listing={listing}
              isMobile={screenSize !== "desktop" ? true : false}
            />
          </header>
          <form>
            <div className={styles["msg-container"]}>
              <label htmlFor="message">Email Content</label>
              <textarea
                name="message"
                id="message"
                className={styles.message}
                value={message}
                onChange={(e) => handleChange(e)}
                placeholder="Please type your message here..."
              ></textarea>
            </div>
            {listing && listing.data.address.formattedAddress.value ? (
              <a
                href={`mailto:${landlord.email}?Subject=${listing.data.address.formattedAddress.value}&body=${message}`}
              >
                <button type="button">Send Message</button>
              </a>
            ) : null}
          </form>
        </div>
        <Footer />
      </>
    );
  }

  return <Spinner size="large" />;
}
