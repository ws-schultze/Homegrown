import { CreateListingPageState } from "../createListingPageSlice";
import {
  AddressValidationApi_Response,
  Verify,
  VerifyActionName,
} from "../../../../types";

export function handleFormVerification<T extends Verify>({
  createListingPageState,
  actionName,
  obj,
  thisPageNum,
  handleFormState,
  handleSavedPageNumbers,
  handleNavigate,
  addressValidationApiResponse,
  setAddressValidationApiResponse,
}: {
  createListingPageState: CreateListingPageState;
  /**
   * Determines if the page is being saved, edited, or verified
   */
  actionName: VerifyActionName;
  /**
   * Form state object.
   */
  obj: T;
  /**
   * Page number being verified
   */
  thisPageNum: number;
  /**
   * Dispatches the state
   */
  handleFormState: (obj: T) => void;
  /**
   * Dispatches saved page numbers to redux
   */
  handleSavedPageNumbers: (nums: number[]) => void;
  handleNavigate: (path: string) => void;
  /**
   *  Formatted address that is used to overwrite and inputs values that
   *  are not spelled correct, or are missing.
   *
   *  If addressValidationApiResponse is
   *  defined, AddressValidationApiResponse must also be defined
   */
  addressValidationApiResponse?: AddressValidationApi_Response;
  /**
   * Sets the addressValidationApiResponse 👆 to the parent's local state
   */
  setAddressValidationApiResponse?: (
    value: React.SetStateAction<AddressValidationApi_Response | undefined>
  ) => void;
}) {
  if (addressValidationApiResponse && setAddressValidationApiResponse) {
    setAddressValidationApiResponse(addressValidationApiResponse);
  }

  if (actionName === "save") {
    /**
     * Set this page to saved
     */
    handleFormState(obj);
    // dispatch(
    //   setListing({
    //     ...state.listing,
    //     address: obj,
    //   })
    // );
    return;
  }

  if (actionName === "edit") {
    /**
     * Remove this page number from saved pages
     */
    handleFormState(obj);

    // dispatch(
    //   setListing({
    //     ...state.listing,
    //     address: obj,
    //   })
    // );
    const idx = createListingPageState.savedPages.indexOf(thisPageNum);
    const savedPagesCopy = [...createListingPageState.savedPages];
    savedPagesCopy.splice(idx, 1);
    // dispatch(setSavedPages(savedPagesCopy));
    handleSavedPageNumbers(savedPagesCopy);
    return;
  }

  if (actionName === "verify" && obj.saved === true) {
    /**
     * Verify info and go to next page
     */
    // dispatch(
    //   setListing({
    //     ...state.listing,
    //     address: obj,
    //   })
    // );
    handleFormState(obj);

    handleSavedPageNumbers(
      createListingPageState.savedPages.concat(thisPageNum)
    );
    handleNavigate(`/create-listing/${thisPageNum + 1}`);
    // dispatch(setSavedPages(state.savedPages.concat(thisPageNum)));
    // navigate(`/create-listing/${thisPageNum + 1}`);
    return;
  }
  if (actionName === "verify" && obj.saved === false) {
    /**
     * Info does not all look correct, hide verification component,
     * stay on this page, show save component again.
     */
    // dispatch(
    //   setListing({
    //     ...state.listing,
    //     address: obj,
    //   })
    // );
    handleFormState(obj);

    return;
  }

  throw new Error("Escaped");
}
