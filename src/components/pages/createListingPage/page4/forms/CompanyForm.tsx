import { useState } from "react";
import {
  Str,
  AddressValidationApi_Response,
  Company,
  VerifyActionName,
} from "../../../../../types/index";
import { initCompany } from "../../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import EditFormSection from "../../shared/EditFormSection";
import { renderMap } from "../../../exploreListingsPage/map/mapHelpers";
import { FormProps } from "../../types/formProps";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { handleFormVerification } from "../../utils/formUtils";
import {
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../../createListingPageSlice";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import AddressAutocompleteInput from "../../../../shared/inputs/addressAutocompleteInput/AddressAutocompleteInput";
import FormCheck from "../../shared/FormCheck";

export default function CompanyForm(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const state = pageState.listing.company;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | undefined>(undefined);

  if (!state) throw new Error("company is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: Company
  ) {
    handleFormVerification<Company>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            company: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
      addressValidationApiResponse,
      setAddressValidationApiResponse,
    });
  }

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection
            parent={state}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}
      <section>
        <header>Company Information</header>

        <NameInput
          state={state.name}
          placeholder="Company name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...pageState.listing,
                company: {
                  ...state,
                  name: name,
                },
              })
            )
          }
        />

        <PhoneNumberInput
          state={state.phoneNumber}
          placeholder="Phone number"
          groupSeparators={[")", "-"]}
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...pageState.listing,
                company: {
                  ...state,
                  phoneNumber: obj,
                },
              })
            )
          }
        />

        <EmailStrInput<Str>
          state={state.email}
          placeholder="Email"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...pageState.listing,
                company: {
                  ...state,
                  email: obj,
                },
              })
            )
          }
        />

        <Wrapper
          apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
          render={renderMap}
          version="beta"
          libraries={["places", "marker"]}
        >
          <AddressAutocompleteInput
            state={state.streetAddress}
            placeholder="Street number"
            handleInput={(obj) => {
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    streetAddress: obj,
                  },
                })
              );
            }}
            handleCompleteAddressObj={(obj) => {
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    streetAddress: obj.streetAddress!,
                    unitNumber: obj.unitNumber!,
                    city: obj.city!,
                    zipCode: obj.zipCode!,
                    adminAreaLevel2: obj.adminAreaLevel2!,
                    adminAreaLevel1: obj.adminAreaLevel1!,
                    country: obj.country!,
                  },
                })
              );
            }}
          />

          <NameInput
            state={state.unitNumber}
            placeholder="Unit number"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    unitNumber: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={state.city}
            placeholder="City"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    city: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={state.adminAreaLevel1}
            placeholder="State"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    adminAreaLevel1: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={state.zipCode}
            placeholder="Postal Code"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    zipCode: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={state.country}
            placeholder="Country"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  company: {
                    ...state,
                    country: obj,
                  },
                })
              )
            }
          />
        </Wrapper>
      </section>

      <FormCheck
        formState={state}
        initialFormState={initCompany}
        children={
          <div>
            {state.name.value} <br />
            {state.phoneNumber.formatted}
            <br />
            {state.email.value}
            <br />
            {state.streetAddress.formatted}
            {", "}
            {state.unitNumber.value}
            <br />
            {state.city.formatted}
            {", "}
            {state.adminAreaLevel1.formatted}
            <br />
            {state.zipCode.formatted} {state.country.formatted}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
