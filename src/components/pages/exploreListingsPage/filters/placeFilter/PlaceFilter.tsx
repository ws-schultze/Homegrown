import React, { useEffect, useRef } from "react";
// import { useAppSelector } from "../../../app/hooks";
import { useDispatch } from "react-redux";
import { setPlace } from "./placeFilterSlice";

export default function PlaceFilter({
  emitPlace,
}: {
  emitPlace?: (place: google.maps.places.PlaceResult | undefined) => void;
}) {
  const dispatch = useDispatch();
  const placesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (placesRef.current) {
      const input = document.getElementById(
        "place-filter-searchbox"
      ) as HTMLInputElement;

      const searchBox = new google.maps.places.SearchBox(input);

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
          dispatch(setPlace(JSON.stringify(places[0])));
          if (emitPlace) {
            emitPlace(places[0]);
          }
        } else {
          console.warn("No places found");
        }
      });
    }
  }, [dispatch, emitPlace]);

  return <div ref={placesRef} id="place-filter"></div>;
}
