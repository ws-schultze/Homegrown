import { Str, Agent, ListingData } from "../../../../../types/index";
import { initAgent } from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import FormCheck from "../../shared/FormCheck";
import { FormProps } from "../../types/formProps";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import AddressFields from "../../shared/AddressFields";
import AgentLicenseIdInput from "../../../../shared/inputs/agentLicenseIdinput/AgentLicenseIdInput";

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

        <AddressFields
          streetAddress={state.streetAddress}
          unitNumber={state.unitNumber}
          city={state.city}
          adminAreaLevel1={state.adminAreaLevel1}
          zipCode={state.zipCode}
          country={state.country}
          handleInput={handleInput}
          handleAutocompletedAddress={(obj) => handleAutocompletedAddress(obj)}
        />
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
