import { Str, Owner, ListingData } from "../../../../../types/index";
import { initOwner } from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import { FormProps } from "../../types/formProps";
import NameInput from "../../../../shared/inputs/nameInput/NameInput";
import PhoneNumberInput from "../../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../../shared/inputs/emailInput/EmailStrInput";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import YesNoBtns from "../../shared/YesNoBtns";
import AddressFields from "../../shared/AddressFields";

export default function OwnerForm(props: FormProps) {
  const stateName: keyof ListingData = "owner";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
    handleProvideAddressWrapper,
  } = useCommonFormLogic<Owner>({
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
        <header>Owner Information</header>

        <NameInput
          state={state.firstName}
          placeholder="First name"
          handleInput={(obj) => handleInput(obj, "firstName")}
        />

        <NameInput
          state={state.middleName}
          placeholder="Middle name"
          handleInput={(obj) => handleInput(obj, "middleName")}
        />

        <NameInput
          state={state.lastName}
          placeholder="Last name"
          handleInput={(obj) => handleInput(obj, "lastName")}
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

        <YesNoBtns
          state={state.provideAddress}
          label="Provide address"
          handleSelected={(obj) => handleProvideAddressWrapper(obj)}
        />

        {state.provideAddress.value === true &&
        state.streetAddress &&
        state.unitNumber &&
        state.city &&
        state.adminAreaLevel1 &&
        state.zipCode &&
        state.country ? (
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
        ) : null}
      </section>

      <FormCheck
        formState={state}
        initialFormState={initOwner}
        children={
          <div>
            {state.firstName.value}{" "}
            {state.middleName && state.middleName.value.length > 0
              ? `${state.middleName.value} ${state.lastName.value}`
              : ` ${state.lastName.value}`}
            <br />
            {state.phoneNumber.formatted}
            <br />
            {state.email.value}
            {state.provideAddress ? (
              <div>
                {state.streetAddress
                  ? `${state.streetAddress.formatted}`
                  : null}
                {", "}
                {state.unitNumber ? `${state.unitNumber.value}` : null}
                <br />
                {state.city ? `${state.city.formatted}` : null}
                {", "}
                {state.adminAreaLevel1
                  ? `${state.adminAreaLevel1.formatted}`
                  : null}
                <br />
                {state.zipCode ? `${state.zipCode.formatted}` : null}{" "}
                {state.country ? `${state.country.formatted}` : null}
              </div>
            ) : null}
          </div>
        }
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
