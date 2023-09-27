import React, { useState, useEffect } from "react";
import { TypeFetchedListing, TypeListingData } from "..";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import {
  collection,
  getDocs,
  DocumentData,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  CollectionReference,
} from "firebase/firestore";

export default function useFetchListings(
  collectionRef: CollectionReference,
  queryConstraints: QueryConstraint[]
): {
  fetchedListings: TypeFetchedListing[] | null;
  isFetchingListings: boolean;
} {
  const [isFetchingListings, setIsFetchingListings] = useState<boolean>(false);
  const [fetchedListings, setFetchedListings] =
    useState<TypeFetchedListing[] | null>(null);

  // console.log("Fetching listings data");

  useEffect(() => {
    async function fetchListings() {
      setIsFetchingListings(true);
      const listings: TypeFetchedListing[] = [];
      const q = query(collectionRef, ...queryConstraints);
      // https://firebase.google.com/docs/firestore/query-data/order-limit-data

      await getDocs(q)
        .then((res: DocumentData) =>
          res.forEach((r: DocumentData) => {
            const _id: string = r.id;
            const _data: TypeListingData = r.data();
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
