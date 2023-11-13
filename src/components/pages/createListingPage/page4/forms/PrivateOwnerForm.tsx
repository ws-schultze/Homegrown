import { useState } from "react";
import {
  AddressValidationApi_Response,
  PrivateOwner,
  VerifyActionName,
} from "../../../../../types/index";
import { initPrivateOwner } from "../../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import TwoBtnRow, { TypeTwoBtnRowState } from "../../shared/TwoBtnRow";
import EditFormSection from "../../shared/EditFormSection";
import { renderMap } from "../../../exploreListingsPage/map/mapHelpers";
import { FormProps } from "../../types/formProps";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setListing, setSavedPages } from "../../createListingPageSlice";
import { handleProvideAddress } from "../utils/handleProvideAddress";
import { handleFormVerification } from "../../utils/formUtils";
import FormCheck from "../../shared/FormCheck";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import AddressAutocompleteInput from "../../../../shared/inputs/addressAutocompleteInput/AddressAutocompleteInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import { Str } from "../../../../../types/index";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";

export default function PrivateOwnerForm(props: FormProps) {
  const state = useAppSelector((s) => s.createListingPage);
  const { privateOwner } = state.listing;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | undefined>(undefined);

  if (!privateOwner) throw new Error("privateOwner is undefined");

  function handleProvideAddressWrapper(obj: TypeTwoBtnRowState) {
    if (!privateOwner) {
      console.error("privateOwner is undefined");
      return;
    }
    handleProvideAddress(privateOwner, obj, (s) =>
      dispatch(
        setListing({
          ...state.listing,
          privateOwner: s,
        })
      )
    );
  }

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: PrivateOwner
  ) {
    handleFormVerification<PrivateOwner>({
      createListingPageState: state,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...state.listing,
            privateOwner: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleNavigate: (path) => navigate(path),
      addressValidationApiResponse,
      setAddressValidationApiResponse,
    });
  }

  return (
    <form>
      {privateOwner.saved === true ? (
        <section>
          <EditFormSection
            parent={privateOwner}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Owner Information</header>

        <NameInput
          state={privateOwner.firstName}
          placeholder="First name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                privateOwner: {
                  ...state.listing.privateOwner!,
                  firstName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={privateOwner.middleName}
          placeholder="Middle name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                privateOwner: {
                  ...state.listing.privateOwner!,
                  middleName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={privateOwner.lastName}
          placeholder="Last name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                privateOwner: {
                  ...state.listing.privateOwner!,
                  lastName: name,
                },
              })
            )
          }
        />

        <PhoneNumberInput
          state={privateOwner.phoneNumber}
          placeholder="Phone number"
          groupSeparators={[")", "-"]}
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                privateOwner: {
                  ...state.listing.privateOwner!,
                  phoneNumber: obj,
                },
              })
            )
          }
        />

        <EmailStrInput<Str>
          state={privateOwner.email}
          placeholder="Email"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                privateOwner: {
                  ...state.listing.privateOwner!,
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
          state={privateOwner.provideAddress}
          handleSelected={handleProvideAddressWrapper}
        />

        {privateOwner.provideAddress.value === true &&
        privateOwner.streetAddress &&
        privateOwner.unitNumber &&
        privateOwner.city &&
        privateOwner.adminAreaLevel1 &&
        privateOwner.zipCode &&
        privateOwner.country ? (
          <Wrapper
            apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
            render={renderMap}
            version="beta"
            libraries={["places", "marker"]}
          >
            <AddressAutocompleteInput
              state={privateOwner.streetAddress}
              placeholder="Street number"
              handleInput={(obj) => {
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
                      streetAddress: obj,
                    },
                  })
                );
              }}
              handleCompleteAddressObj={(obj) => {
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
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
              state={privateOwner.unitNumber}
              placeholder="Unit number"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
                      unitNumber: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={privateOwner.city}
              placeholder="City"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
                      city: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={privateOwner.adminAreaLevel1}
              placeholder="State"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
                      adminAreaLevel1: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={privateOwner.zipCode}
              placeholder="Postal Code"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
                      zipCode: obj,
                    },
                  })
                )
              }
            />

            <NameInput
              state={privateOwner.country}
              placeholder="Country"
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...state.listing,
                    privateOwner: {
                      ...state.listing.privateOwner!,
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
        formState={privateOwner}
        initialFormState={initPrivateOwner}
        children={
          <div>
            {privateOwner.firstName.value}{" "}
            {privateOwner.middleName && privateOwner.middleName.value.length > 0
              ? `${privateOwner.middleName.value} ${privateOwner.lastName.value}`
              : ` ${privateOwner.lastName.value}`}
            <br />
            {privateOwner.phoneNumber.formatted}
            <br />
            {privateOwner.email.value}
            {privateOwner.provideAddress ? (
              <div>
                {privateOwner.streetAddress
                  ? `${privateOwner.streetAddress.formatted}`
                  : null}
                {", "}
                {privateOwner.unitNumber
                  ? `${privateOwner.unitNumber.value}`
                  : null}
                <br />
                {privateOwner.city ? `${privateOwner.city.formatted}` : null}
                {", "}
                {privateOwner.adminAreaLevel1
                  ? `${privateOwner.adminAreaLevel1.formatted}`
                  : null}
                <br />
                {privateOwner.zipCode
                  ? `${privateOwner.zipCode.formatted}`
                  : null}{" "}
                {privateOwner.country
                  ? `${privateOwner.country.formatted}`
                  : null}
              </div>
            ) : null}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
