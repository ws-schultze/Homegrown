import React, { useState, useRef } from "react";
import {
  Str,
  AddressValidationApi_Response,
  VerifyActionName,
  TypeAgent,
} from "../../../../../types/index";
import { initAgent } from "../../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import EditFormSection from "../../shared/EditFormSection";
import { renderMap } from "../../../exploreListingsPage/map/mapHelpers";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setListing, setSavedPages } from "../../createListingPageSlice";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import AgentLicenseIdInput from "../../../../shared/inputs/agentLicenseIdInput/AgentLicenseIdInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import AddressAutocompleteInput from "../../../../shared/inputs/addressAutocompleteInput/AddressAutocompleteInput";
import FormCheck from "../../shared/FormCheck";
import { FormProps } from "../../types/formProps";
import { handleFormVerification } from "../../utils/formUtils";
import { useNavigate } from "react-router";

export default function AgentForm(props: FormProps) {
  const state = useAppSelector((s) => s.createListingPage);
  const { agent } = state.listing;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | undefined>(undefined);

  if (!agent) throw new Error("agent is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: TypeAgent
  ) {
    handleFormVerification<TypeAgent>({
      createListingPageState: state,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...state.listing,
            agent: obj,
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
      {agent.saved === true ? (
        <section>
          <EditFormSection
            parent={agent}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Agent Information</header>

        <NameInput
          state={agent.firstName}
          placeholder="First name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  firstName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.middleName}
          placeholder="Middle name*"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  middleName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.lastName}
          placeholder="Last name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  lastName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.companyName}
          placeholder="Company name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  companyName: name,
                },
              })
            )
          }
        />

        <AgentLicenseIdInput
          state={agent.licenseId}
          placeholder="License ID"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  licenseId: obj,
                },
              })
            )
          }
        />

        <PhoneNumberInput
          state={agent.phoneNumber}
          placeholder="Phone number"
          groupSeparators={[")", "-"]}
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
                  phoneNumber: obj,
                },
              })
            )
          }
        />

        <EmailStrInput<Str>
          state={agent.email}
          placeholder="Email"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                agent: {
                  ...state.listing.agent!,
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
            state={agent.streetAddress}
            placeholder="Street number"
            handleInput={(obj) => {
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    streetAddress: obj,
                  },
                })
              );
            }}
            handleCompleteAddressObj={(obj) => {
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
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
            state={agent.unitNumber}
            placeholder="Unit number"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    unitNumber: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={agent.city}
            placeholder="City"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    city: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={agent.adminAreaLevel1}
            placeholder="State"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    adminAreaLevel1: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={agent.zipCode}
            placeholder="Postal Code"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    zipCode: obj,
                  },
                })
              )
            }
          />

          <NameInput
            state={agent.country}
            placeholder="Country"
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...state.listing,
                  agent: {
                    ...state.listing.agent!,
                    country: obj,
                  },
                })
              )
            }
          />
        </Wrapper>
      </section>

      <FormCheck
        formState={agent}
        initialFormState={initAgent}
        children={
          <div>
            {agent.firstName.value}{" "}
            {agent.middleName && agent.middleName.value.length > 0
              ? `${agent.middleName.value} ${agent.lastName.value}`
              : `${agent.lastName.value}`}
            <br />
            License# {agent.licenseId.value}
            <br />
            {agent.phoneNumber.formatted}
            <br />
            {agent.email.value}
            <br />
            {agent.companyName.value}
            <br />
            {addressValidationApiResponse &&
            addressValidationApiResponse.result &&
            addressValidationApiResponse.result.address.formattedAddress
              ? addressValidationApiResponse.result.address.formattedAddress
              : null}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
