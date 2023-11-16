import React, { useEffect } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  Address,
  AddressOptional,
  Owner,
  PrivateOwner,
  SingleFamilyHome,
  Str,
  TypeBool,
  VerifyActionName,
} from "../../../../types";
import { handleDropdown, handleFormVerification } from "../utils/formUtils";
import {
  CreateListingPageState,
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../createListingPageSlice";
import { ListingData, Verify } from "../../../../types/index";
import { TypeTwoBtnRowState } from "../shared/TwoBtnRow";
import { handleProvideAddress } from "../page4/utils/handleProvideAddress";
import { initStrReq, initTypeBoolReqNull } from "../../../../initialValues";

/**
 * Hook to used to extract logic/state that all create/edit listing forms will use.
 * @param args { pageNumber: number; stateName: keyof ListingData; }
 */
export default function useCommonFormLogic<T extends Verify>(args: {
  pageNumber: number;
  stateName: keyof ListingData;
}): {
  pageState: CreateListingPageState;
  listing: ListingData;
  state: T;
  handleFormVerificationWrapper: (actionName: VerifyActionName, obj: T) => void;
  handleInput: (obj: T[keyof T], key: keyof T) => void;
  handleAutocompletedAddress: (obj: Address | AddressOptional) => void;
  handleProvideAddressWrapper: (obj: TypeBool) => void;
} {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing[args.stateName]! as T;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("state is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<T>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: args.pageNumber,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            [args.stateName]: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  function handleInput(obj: T[keyof T], key: keyof typeof state) {
    dispatch(
      setListing({
        ...listing,
        [args.stateName]: {
          ...state,
          [key]: obj,
        },
      })
    );
  }

  function handleAutocompletedAddress(obj: Address | AddressOptional) {
    dispatch(
      setListing({
        ...listing,
        [args.stateName]: {
          ...state,
          streetAddress: obj.streetAddress!,
          unitNumber: obj.unitNumber!,
          city: obj.city!,
          zipCode: obj.zipCode!,
          adminAreaLevel2: obj.adminAreaLevel2!,
          adminAreaLevel1: obj.adminAreaLevel1!,
          country: obj.country!,
          formattedAddress: obj.formattedAddress!,
          address_components: obj.address_components!,
        },
      })
    );
  }

  /**
   * Used one the Owner and Private Owner forms when selecting whether or
   * not to provide an address. Selecting <Yes> will populate the
   * address fields of the form to be filled out. Selecting <No>
   * will leave the address fields off of the form.
   */
  function handleProvideAddressWrapper(obj: TypeBool): void {
    if (!listing[args.stateName]) {
      console.error("listing[args.stateName] is undefined");
      return;
    }
    handleProvideAddress(
      listing[args.stateName] as Owner | PrivateOwner,
      obj,
      (newState) =>
        dispatch(
          setListing({
            ...listing,
            [args.stateName]: newState,
          })
        )
    );
  }

  return {
    pageState,
    listing,
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
    handleProvideAddressWrapper,
  };
}
