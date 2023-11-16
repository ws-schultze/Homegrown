import { ListingData } from "../../../../types";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { DropdownMenuItem } from "../../../shared/dropdown/Dropdown";
import { setListing } from "../createListingPageSlice";

export default function useDropdown<T>(stateName: keyof ListingData) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing[stateName] as T;
  const dispatch = useDispatch();

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
          [stateName]: obj,
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
          [stateName]: obj,
        })
      );
    } else {
      throw new Error("Something went wrong");
    }
  }

  return { handleDropdown };
}
