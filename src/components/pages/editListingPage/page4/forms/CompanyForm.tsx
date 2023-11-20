import { Str, Company, ListingData } from "../../../../../types/index";
import { initCompany } from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import { FormProps } from "../../types/formProps";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import AddressFields from "../../shared/AddressFields";

export default function CompanyForm(props: FormProps) {
  const stateName: keyof ListingData = "company";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
  } = useCommonFormLogic<Company>({
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
        <header>Company Information</header>

        <NameInput
          state={state.name}
          placeholder="Company name"
          handleInput={(obj) => handleInput(obj, "name")}
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
          handleAutocompletedAddress={handleAutocompletedAddress}
        />
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
