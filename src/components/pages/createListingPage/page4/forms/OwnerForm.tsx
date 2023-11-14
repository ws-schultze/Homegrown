import { useState } from "react";
import {
  Str,
  AddressValidationApi_Response,
  Owner,
  VerifyActionName,
} from "../../../../../types/index";
import { initOwner } from "../../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import TwoBtnRow, { TypeTwoBtnRowState } from "../../shared/TwoBtnRow";
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
import { handleProvideAddress } from "../utils/handleProvideAddress";

export default function OwnerForm(props: FormProps) {
  const state = useAppSelector((s) => s.createListingPage);
  const { owner } = state.listing;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | undefined>(undefined);

  if (!owner) throw new Error("owner is undefined");

  function handleProvideAddressWrapper(obj: TypeTwoBtnRowState) {
    if (!owner) {
      console.error("owner is undefined");
      return;
    }
    handleProvideAddress(owner, obj, (s) =>
      dispatch(
        setListing({
          ...state.listing,
          owner: s,
        })
      )
    );
  }

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: Owner
  ) {
    handleFormVerification<Owner>({
      createListingPageState: state,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...state.listing,
            owner: obj,
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
      {owner.saved === true ? (
        <section>
          <EditFormSection
            parent={owner}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Owner Information</header>

        <NameInput
          state={owner.firstName}
          placeholder="First name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                owner: {
                  ...state.listing.owner!,
                  firstName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={owner.middleName}
          placeholder="Middle name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                owner: {
                  ...state.listing.owner!,
                  middleName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={owner.lastName}
          placeholder="Last name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                owner: {
                  ...state.listing.owner!,
                  lastName: name,
                },
              })
            )
          }
        />

        <PhoneNumberInput
          state={owner.phoneNumber}
          placeholder="Phone number"
          groupSeparators={[")", "-"]}
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                owner: {
                  ...state.listing.owner!,
                  phoneNumber: obj,
                },
              })
            )
          }
        />

        <EmailStrInput<Str>
          state={owner.email}
          placeholder="Email"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                owner: {
                  ...state.listing.owner!,
                  email: obj,
                },
              })
            )
          }
        />

        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          label="Provide address"
          state={owner.provideAddress}
          handleSelected={handleProvideAddressWrapper}
        />

        {owner.provideAddress.value === true &&
        owner.streetAddress &&
        owner.unitNumber &&
        owner.city &&
        owner.adminAreaLevel1 &&
        owner.zipCode &&
        owner.country ? (
          <Wrapper
            apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
            render={renderMap}
            version="beta"
            libraries={["places", "marker"]}
          >
            <AddressAutocompleteInput
              state={owner.streetAddress}
              placeholder="Street number"
              handleInput={(obj) => {
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      streetAddress: obj,
                    },
                  })
                );
              }}
              handleCompleteAddressObj={(obj) => {
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
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
              state={owner.unitNumber}
              placeholder="Unit number"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      unitNumber: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={owner.city}
              placeholder="City"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      city: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={owner.adminAreaLevel1}
              placeholder="State"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      adminAreaLevel1: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={owner.zipCode}
              placeholder="Postal Code"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      zipCode: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={owner.country}
              placeholder="Country"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    owner: {
                      ...state.listing.owner!,
                      country: obj,
                    },
                  })
                )
              }
            />
          </Wrapper>
        ) : null}
      </section>

      <FormCheck
        formState={owner}
        initialFormState={initOwner}
        children={
          <div>
            {owner.firstName.value}{" "}
            {owner.middleName && owner.middleName.value.length > 0
              ? `${owner.middleName.value} ${owner.lastName.value}`
              : ` ${owner.lastName.value}`}
            <br />
            {owner.phoneNumber.formatted}
            <br />
            {owner.email.value}
            {owner.provideAddress ? (
              <div>
                {owner.streetAddress
                  ? `${owner.streetAddress.formatted}`
                  : null}
                {", "}
                {owner.unitNumber ? `${owner.unitNumber.value}` : null}
                <br />
                {owner.city ? `${owner.city.formatted}` : null}
                {", "}
                {owner.adminAreaLevel1
                  ? `${owner.adminAreaLevel1.formatted}`
                  : null}
                <br />
                {owner.zipCode ? `${owner.zipCode.formatted}` : null}{" "}
                {owner.country ? `${owner.country.formatted}` : null}
              </div>
            ) : null}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
