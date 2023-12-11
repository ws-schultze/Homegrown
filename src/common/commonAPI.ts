import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { FetchedListing } from "../types/index";
import { db } from "../firebase.config";
import { list } from "firebase/storage";

export default async function fetchListings() {
  let listings: FetchedListing[] = [];
  const listingsRef = collection(db, "listings");
  const q = query(listingsRef, orderBy("timestamp"), ...[limit(25)]);
  // https://firebase.google.com/docs/firestore/query-data/order-limit-data

  await getDocs(q)
    .then((resolve: DocumentData) =>
      resolve.forEach((listing: DocumentData) => {
        listings.push({
          id: listing.id,
          data: {
            ...listing.data(),
            timestamp: JSON.stringify(listing.data().timestamp),
          },
        });
      })
    )
    .catch((error: Error) => {
      console.error(error);
    });

  return listings;
}
