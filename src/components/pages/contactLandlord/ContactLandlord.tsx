import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { toast } from "react-toastify";
// import ListingCard from "../components/ListingCard";
import Spinner from "../../shared/loaders/Spinner";

export default function ContactLandlord() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState<DocumentData | null>(null);
  const [listing, setListing] = useState<DocumentData | null>(null);
  // The useSearchParams hook is used to read and modify the query string in the URL for the current location.
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
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
    console.log(landlord);
  }, [params.landlordId]);

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      if (params.listingId) {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
          console.log(docSnap.data());
        }
      }
    };
    fetchListing();
  }, [params.listingId]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <div className="page-wrap">
      <header>{/* <p className='page__header'>Contact Landlord</p> */}</header>
      {landlord !== null && (
        <main>
          <div className="contactLandlordPageHeader">
            <div className="contactLandlordName">
              Landlord: {landlord?.name}
            </div>

            {/* <ListingCard listing={listing} id={params.listingId} key={params.listingId} /> */}
          </div>

          <form className="message-form">
            <div className="messageDiv">
              {/* <label htmlFor='message' className='messageLabel'>
                
              </label> */}
              <textarea
                name="message"
                id="message"
                className="contactLandlordMessageInput"
                value={message}
                onChange={(e) => onChange(e)}
                placeholder="Please type your message here..."
              ></textarea>
            </div>
            {listing ? (
              <a
                href={`mailto:${landlord.email}?Subject=${listing.address}&body=${message}`}
              >
                <button
                  style={{ marginBottom: "10rem" }}
                  type="button"
                  className="primary-btn"
                >
                  Send Message
                </button>
              </a>
            ) : null}
          </form>
        </main>
      )}
    </div>
  );
}
