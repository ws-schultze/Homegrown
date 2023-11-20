import {
  ListingData,
  MultiFamilyHomeUnit,
  SingleFamilyHome,
  TypeBool,
} from "../../../../types";
import { useDispatch } from "react-redux";
import { setListing } from "../editListingPageSlice";
import { useAppSelector } from "../../../../redux/hooks";
import { initStrReq, initTypeBoolReqNull } from "../../../../initialValues";

export default function useGarage<
  T extends SingleFamilyHome | MultiFamilyHomeUnit
>(stateName: keyof ListingData) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing[stateName] as T;
  const dispatch = useDispatch();

  function handleGarage(obj: TypeBool) {
    const { garageAttached, garageNumCars, garageSqFt, ...rest } = state;

    // Has garage
    if (obj.value === true) {
      dispatch(
        setListing({
          ...listing,
          [stateName]: {
            ...state,
            garage: obj,
            garageAttached: initTypeBoolReqNull,
            garageNumCars: initStrReq,
            garageSqFt: initStrReq,
          },
        })
      );
      return;
    }

    // No garage --> remove garage props from state
    if (obj.value === false) {
      dispatch(
        setListing({
          ...listing,
          [stateName]: {
            ...rest,
            garage: obj,
          },
        })
      );
      return;
    }
  }

  return { handleGarage };
}
