import { FormProps } from "../types/formProps";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { VerifyActionName } from "../../../../types";
import { handleDropdown, handleFormVerification } from "../utils/formUtils";
import {
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../editListingPageSlice";

export default function FormFunctionsTemplate(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.singleFamilyHome!;
  const stateName: keyof typeof listing = "singleFamilyHome";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  if (!state) throw new Error("state is undefined");
  if (!params.listingId) throw new Error("params.listingId is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<typeof state>({
      pageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      listingId: params.listingId!,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            [stateName]: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  function handleInput<T>(obj: T, key: keyof typeof state) {
    dispatch(
      setListing({
        ...listing,
        [stateName]: {
          ...state,
          [key]: obj,
        },
      })
    );
  }

  function handleDropdownWrapper<T>(options: T[], key: keyof typeof state) {
    handleDropdown(options, state, key, (obj) =>
      dispatch(
        setListing({
          ...listing,
          [stateName]: obj,
        })
      )
    );
  }
  return <div>FormFunctionsTemplate</div>;
}
