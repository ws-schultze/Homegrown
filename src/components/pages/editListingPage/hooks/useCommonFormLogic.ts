import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate, useParams } from "react-router";
import {
  ListingData,
  Verify,
  Address,
  AddressOptional,
  Owner,
  PrivateOwner,
  TypeBool,
  VerifyActionName,
  Str,
} from "../../../../types";
import { handleFormVerification } from "../utils/formUtils";
import {
  EditListingPageState,
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../editListingPageSlice";
import {
  initStrOpt,
  initStrReq,
  initTypeBoolReqNull,
} from "../../../../initialValues";
import { DropdownMenuItem } from "../../../shared/dropdown/Dropdown";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { serverTimestamp } from "firebase/firestore";

/**
 * Hook to used to extract logic/state that all create/edit listing forms will use.
 * @param args { pageNumber: number; stateName: keyof ListingData; }
 */
export default function useCommonFormLogic<T extends Verify>(args: {
  pageNumber: number;
  stateName: keyof ListingData;
}): {
  pageState: EditListingPageState;
  listing: ListingData;
  state: T;
  dispatch: Dispatch<AnyAction>;
  navigate: NavigateFunction;
  handleFormVerificationWrapper: (actionName: VerifyActionName, obj: T) => void;
  handleInput: (obj: T[keyof T], key: keyof T) => void;

  handleAutocompletedAddress(obj: Address | AddressOptional): void;

  handleProvideAddress<T extends Owner | PrivateOwner>(
    state: T,
    obj: TypeBool
  ): void;

  handleDropdown<O extends DropdownMenuItem | null>(
    options: O[],
    key: keyof typeof state
  ): void;

  handleGarage<
    T extends {
      garage: TypeBool;
      garageAttached?: typeof initTypeBoolReqNull;
      garageNumCars?: typeof initStrReq;
      garageSqFt?: typeof initStrReq;
    }
  >(
    obj: TypeBool,
    state: T
  ): void;

  handleAssignedParking<
    T extends {
      assignedParking: TypeBool;
      numAssignedSpaces?: Str;
      numAssignedSpacesWithCover?: Str;
    }
  >(
    obj: TypeBool,
    state: T
  ): void;
} {
  const pageState = useAppSelector((s) => s.editListingPage);

  const { timestamp, ...rest } = pageState.listing;

  // if (!timestamp) throw new Error("timestamp is undefined");
  const listing = { ...rest, timestamp: JSON.stringify(serverTimestamp()) };

  const state = listing[args.stateName]! as T;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  if (!params.listingId) {
    throw new Error("params.listingId must be defined.");
  }

  // if (!state) throw new Error("state is undefined");
  //github glitch fix?

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<T>({
      pageState: pageState,
      actionName,
      obj,
      thisPageNum: args.pageNumber,
      listingId: params.listingId!,
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

  function handleAutocompletedAddress(
    obj: Address | AddressOptional
    // state: T
  ) {
    dispatch(
      setListing({
        ...listing,
        [args.stateName]: {
          ...state,
          streetAddress: obj.streetAddress,
          unitNumber: obj.unitNumber,
          city: obj.city,
          adminAreaLevel1: obj.adminAreaLevel1,
          zipCode: obj.zipCode,
          adminAreaLevel2: obj.adminAreaLevel2,
          country: obj.country,
          formattedAddress: obj.formattedAddress,
          geolocation: obj.geolocation,
          addressComponents: obj.addressComponents,
        },
      })
    );
  }

  function handleProvideAddress<T extends Owner | PrivateOwner>(
    state: T,
    obj: TypeBool
  ) {
    const value = obj.value;

    const {
      streetAddress,
      unitNumber,
      city,
      adminAreaLevel1,
      country,
      zipCode,
      ...rest
    } = state;

    // Provide address
    if (value === true) {
      const s: typeof state = {
        ...state,
        provideAddress: obj,
        streetAddress: initStrReq,
        unitNumber: initStrOpt,
        city: initStrReq,
        adminAreaLevel1: initStrReq,
        country: initStrReq,
        zipCode: initStrReq,
      };

      dispatch(
        setListing({
          ...listing,
          [args.stateName]: s,
        })
      );
      return;
    }

    // Do not provide address --> remove address props from state
    if (value === false) {
      const s = { ...rest, provideAddress: obj } as T;
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: s,
        })
      );
      return;
    }
  }

  /**
   * T is the type of options on the menu i.e. heating options
   * S is the type of form state i.e. singleFamilyHome
   */
  function handleDropdown<O extends DropdownMenuItem | null>(
    options: O[],
    key: keyof typeof state
  ) {
    if (options.length === 0) {
      const obj: typeof state = {
        ...state,
        [key]: {
          valid: false,
          value: options,
          errorMsg: "Required",
          required: true,
        },
      };
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: obj,
        })
      );
    } else if (options.length > 0) {
      const obj: typeof state = {
        ...state,
        [key]: {
          valid: true,
          value: options,
          errorMsg: "",
          required: true,
        },
      };
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: obj,
        })
      );
    } else {
      throw new Error("Something went wrong");
    }
  }

  function handleGarage<
    T extends {
      garage: TypeBool;
      garageAttached?: typeof initTypeBoolReqNull;
      garageNumCars?: typeof initStrReq;
      garageSqFt?: typeof initStrReq;
    }
  >(obj: TypeBool, state: T) {
    const { garageAttached, garageNumCars, garageSqFt, ...rest } = state;

    // Has garage --> add garage props to state
    if (obj.value === true) {
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: {
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
          [args.stateName]: {
            ...rest,
            garage: obj,
          },
        })
      );
      return;
    }
  }

  function handleAssignedParking<
    T extends {
      assignedParking: TypeBool;
      numAssignedSpaces?: Str;
      numAssignedSpacesWithCover?: Str;
    }
  >(obj: TypeBool, state: T) {
    const { numAssignedSpaces, numAssignedSpacesWithCover, ...rest } = state;

    // Has assigned parking
    if (obj.value === true) {
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: {
            ...state,
            assignedParking: obj,
            numAssignedSpaces: initStrReq,
            numAssignedSpacesWithCover: initStrReq,
          },
        })
      );
      return;
    }

    // Does not have assigned parking
    if (obj.value === false) {
      dispatch(
        setListing({
          ...listing,
          [args.stateName]: {
            ...rest,
            assignedParking: obj,
          },
        })
      );
      return;
    }
  }

  return {
    pageState,
    listing,
    state,
    dispatch,
    navigate,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
    handleProvideAddress,
    handleDropdown,
    handleGarage,
    handleAssignedParking,
  };
}
