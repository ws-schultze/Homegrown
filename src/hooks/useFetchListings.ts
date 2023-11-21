import { useState, useEffect } from "react";
import * as T from "../types/index";

import {
  getDocs,
  DocumentData,
  query,
  QueryConstraint,
  CollectionReference,
} from "firebase/firestore";

export default function useFetchListings(
  collectionRef: CollectionReference,
  queryConstraints: QueryConstraint[]
): {
  fetchedListings: T.FetchedListing[] | null;
  isFetchingListings: boolean;
} {
  const [isFetchingListings, setIsFetchingListings] = useState<boolean>(false);
  const [fetchedListings, setFetchedListings] =
    useState<T.FetchedListing[] | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setIsFetchingListings(true);
      const listings: T.FetchedListing[] = [];
      const q = query(collectionRef, ...queryConstraints);
      // https://firebase.google.com/docs/firestore/query-data/order-limit-data

      await getDocs(q)
        .then((res: DocumentData) =>
          res.forEach((r: DocumentData) => {
            const _id: string = r.id;
            const _data: T.ListingData = r.data();
            listings.push({
              id: _id,
              data: _data,
            });
          })
        )
        .then((r: DocumentData) => {
          setFetchedListings(listings);
          setIsFetchingListings(false);
        })
        .catch((error: Error) => {
          setIsFetchingListings(false);
          console.warn(error);
        });
    }

    if (collectionRef) {
      fetchListings();
    }
  }, []);

  return { fetchedListings, isFetchingListings };
}
