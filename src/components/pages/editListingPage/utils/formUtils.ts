import { EditListingPageState } from "../editListingPageSlice";
import {
  AddressValidationApi_Response,
  Verify,
  VerifyActionName,
} from "../../../../types";

export interface HandleFormVerificationProps<T> {
  pageState: EditListingPageState;
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

  listingId: string;
  /**
   * Dispatches the state
   */
  handleFormState: (obj: T) => void;
  /**
   * Dispatches saved page numbers to redux
   */
  handleSavedPageNumbers: (nums: number[]) => void;
  /**
   * Dispatches unsaved page numbers to redux
   */
  handleUnsavedPageNumbers: (nums: number[]) => void;
  /**
   * Change the url params
   */
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
}

export function handleFormVerification<T extends Verify>(
  props: HandleFormVerificationProps<T>
) {
  if (
    props.addressValidationApiResponse &&
    props.setAddressValidationApiResponse
  ) {
    props.setAddressValidationApiResponse(props.addressValidationApiResponse);
  }

  /**
   * Save and continue btn clicked => Set this page to saved
   */
  if (props.actionName === "saveAndContinue") {
    props.handleFormState(props.obj);
    return;
  }

  /**
   * Clear form btn clicked => set form to initial value
   */
  if (props.actionName === "clearForm") {
    props.handleFormState(props.obj);
    return;
  }

  /**
   * Enable editing btn clicked => Remove this page number from saved pages
   */
  if (props.actionName === "enableEditing") {
    // Remove this page number from saved page numbers
    const idx = props.pageState.savedPages.indexOf(props.thisPageNum);

    const savedPagesCopy = [...props.pageState.savedPages];
    savedPagesCopy.splice(idx, 1);

    props.handleSavedPageNumbers(savedPagesCopy);

    // Add this page number to unsaved page numbers
    props.handleUnsavedPageNumbers(
      props.pageState.unsavedPages.concat(props.thisPageNum)
    );

    // Set form state
    props.handleFormState(props.obj);
    return;
  }

  /**
   * Everything looks correct, save and go to next page
   */
  if (
    props.actionName === "everythingLooksCorrect"
    // props.obj.saved === true
  ) {
    console.log("all looks correct");
    props.handleFormState(props.obj);

    // Add this page number to saved page numbers
    props.handleSavedPageNumbers(
      props.pageState.savedPages.concat(props.thisPageNum)
    );

    // Remove this page number from unsaved page numbers
    const idx = props.pageState.unsavedPages.indexOf(props.thisPageNum);

    console.log(idx);

    const unsavedPagesCopy = [...props.pageState.unsavedPages];
    unsavedPagesCopy.splice(idx, 1);

    console.log(unsavedPagesCopy);

    props.handleUnsavedPageNumbers(unsavedPagesCopy);

    // Navigate to the next form page
    props.handleNavigate(
      `/edit-listing/${props.thisPageNum + 1}/${props.listingId}`
    );
    return;
  }

  /**
   * Info does not all look correct, hide verification component,
   * stay on this page, show SaveSection component again.
   */
  if (
    props.actionName === "everythingDoesNotLookCorrect" &&
    props.obj.saved === false
  ) {
    props.handleFormState(props.obj);
    return;
  }

  throw new Error("Escaped");
}

/**
 * T is the type of options on the menu i.e. heating options
 * S is the type of form state i.e. singleFamilyHome
 */
export function handleDropdown<O, S>(
  options: O[],
  state: S,
  key: keyof S,
  handleSelectedOptions: (obj: S) => void
) {
  if (options.length === 0) {
    const obj: S = {
      ...state,
      [key]: {
        valid: false,
        value: options,
        errorMsg: "Required",
        required: true,
      },
    };
    handleSelectedOptions(obj);
  } else if (options.length > 0) {
    const obj: S = {
      ...state,
      [key]: {
        valid: true,
        value: options,
        errorMsg: "",
        required: true,
      },
    };
    handleSelectedOptions(obj);
  } else {
    throw new Error("Something went wrong");
  }
}
