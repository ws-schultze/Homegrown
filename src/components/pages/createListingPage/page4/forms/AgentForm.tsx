import { Str, Agent, ListingData } from "../../../../../types/index";
import { initAgent } from "../../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import EditFormSection from "../../shared/EditFormSection";
import { renderMap } from "../../../exploreListingsPage/map/mapHelpers";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import AgentLicenseIdInput from "../../../../shared/inputs/agentLicenseIdInput/AgentLicenseIdInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import AddressAutocompleteInput from "../../../../shared/inputs/addressAutocompleteInput/AddressAutocompleteInput";
import FormCheck from "../../shared/FormCheck";
import { FormProps } from "../../types/formProps";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";

export default function AgentForm(props: FormProps) {
  const stateName: keyof ListingData = "agent";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
  } = useCommonFormLogic<Agent>({
    pageNumber: props.thisPageNum,
    stateName: stateName,
  });

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
        <header>Agent Information</header>

        <NameInput
          state={state.firstName}
          placeholder="First name"
          handleInput={(obj) => handleInput(obj, "firstName")}
        />

        <NameInput
          state={state.middleName}
          placeholder="Middle name*"
          handleInput={(obj) => handleInput(obj, "middleName")}
        />

        <NameInput
          state={state.lastName}
          placeholder="Last name"
          handleInput={(obj) => handleInput(obj, "lastName")}
        />

        <NameInput
          state={state.companyName}
          placeholder="Company name"
          handleInput={(obj) => handleInput(obj, "companyName")}
        />

        <AgentLicenseIdInput
          state={state.licenseId}
          placeholder="License ID"
          handleInput={(obj) => handleInput(obj, "licenseId")}
        />

        <PhoneNumberInput
          state={state.phoneNumber}
          placeholder="Phone number"
          groupSeparators={[")", "-"]}
          handleInput={(obj) => handleInput(obj, "phoneNumber")}
        />

        <EmailStrInput<Str>
          state={state.email}
          placeholder="Email"
          handleInput={(obj) => handleInput(obj, "email")}
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
            handleInput={(obj) => handleInput(obj, "streetAddress")}
            handleAutocompletedAddress={handleAutocompletedAddress}
          />

          <NameInput
            state={state.unitNumber}
            placeholder="Unit number"
            handleInput={(obj) => handleInput(obj, "unitNumber")}
          />

          <NameInput
            state={state.city}
            placeholder="City"
            handleInput={(obj) => handleInput(obj, "city")}
          />

          <NameInput
            state={state.adminAreaLevel1}
            placeholder="State"
            handleInput={(obj) => handleInput(obj, "adminAreaLevel1")}
          />

          <NameInput
            state={state.zipCode}
            placeholder="Postal Code"
            handleInput={(obj) => handleInput(obj, "zipCode")}
          />

          <NameInput
            state={state.country}
            placeholder="Country"
            handleInput={(obj) => handleInput(obj, "country")}
          />
        </Wrapper>
      </section>

      <FormCheck
        formState={state}
        initialFormState={initAgent}
        children={
          <div>
            {state.firstName.value}{" "}
            {state.middleName && state.middleName.value.length > 0
              ? `${state.middleName.value} ${state.lastName.value}`
              : `${state.lastName.value}`}
            <br />
            License# {state.licenseId.value}
            <br />
            {state.phoneNumber.formatted}
            <br />
            {state.email.value}
            <br />
            {state.companyName.value}
            <br />
            {state.formattedAddress ? `${state.formattedAddress.value}` : null}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
