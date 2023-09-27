import { useState, useEffect, useRef } from "react";
import {
  TypeStr,
  TypePrivateOwner,
  TypeAddressValidationApi_Response,
  TypeListingData,
  TypeVerifyActionName,
} from "../../../../index";
import {
  initPrivateOwner,
  initTypeStrOpt,
  initTypeStrReq,
} from "../../../../initialValues";
import InputTypeStr from "../../../common/inputTypeStr/InputTypeStr";
import { Wrapper } from "@googlemaps/react-wrapper";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
import TwoBtnRow, { TypeTwoBtnRowState } from "./TwoBtnRow";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import PageBtns from "./PageBtns";
import setUnitNumberToState from "./utils/setUnitNumberToState";

import { Header } from "./styledComponents";
import { renderMap } from "../../exploreListings/map/mapHelpers";

interface Props {
  parent: TypeListingData;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: TypeListingData) => void;
}

export default function PrivateOwnerForm({
  parent,
  prevPage,
  nextPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypePrivateOwner>(initPrivateOwner);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<TypeAddressValidationApi_Response | null>(null);
  const streetAddressRef = useRef<HTMLInputElement | null>(null);

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.privateOwner) {
      setState(parent.privateOwner);
    } else {
      throw new Error("Private object not found in parent");
    }
  }, [parent]);

  /**
   * Generate the places autocompleteWidget, set it to state and add an event listener to it
   * https://developers.google.com/maps/documentation/javascript/reference/places-widget
   */
  function handleAutocompleteWidget() {
    if (streetAddressRef.current && streetAddressRef.current !== null) {
      const widget = makeAutocompleteWidget(streetAddressRef);
      setAutocompleteWidget(widget);
    }

    // Listen for click on widget item
    if (autocompleteWidget) {
      autocompleteWidget.addListener("place_changed", () => {
        const s: typeof state = setAutocompletePlaceValuesToState<typeof state>(
          {
            state: state,
            autocomplete: autocompleteWidget,
          }
        );
        setState(s);
      });
    }
  }

  function handleInputTypeStr(object: TypeStr, fieldName: keyof typeof state) {
    if (fieldName === "streetAddress") {
      handleAutocompleteWidget();
    } else if (fieldName === "unitNumber") {
      const s: typeof state = setUnitNumberToState(state, object);
      setState(s);
    } else {
      setState((s) => ({
        ...s,
        [fieldName]: object,
      }));
    }
  }

  function handleTwoBtnRow(
    fieldName: keyof typeof state,
    obj: TypeTwoBtnRowState
  ) {
    const value = obj.value;

    if (value !== true && value !== false) {
      throw new Error(`Must have a value of "true" or "false"`);
    }

    if (fieldName === "provideAddress") {
      // Address

      const {
        streetAddress,
        unitNumber,
        city,
        adminAreaLevel1,
        country,
        zipCode,
        ...rest
      } = state;

      if (value === true) {
        // Provide address --> add address props to state

        setState((s) => ({
          ...s,
          provideAddress: obj,
          streetAddress: initTypeStrReq,
          unitNumber: initTypeStrOpt,
          city: initTypeStrReq,
          adminAreaLevel1: initTypeStrReq,
          country: initTypeStrReq,
          zipCode: initTypeStrReq,
        }));
      } else if (value === false) {
        // Do not provide address --> remove address props from state

        setState({
          ...rest,
          provideAddress: obj,
        });
      }
    } else {
      // Btns that do not add/subtract state props

      setState((s) => ({
        ...s,
        [fieldName]: obj,
      }));
    }
  }

  function handleVerify(
    actionName: TypeVerifyActionName,
    obj: TypePrivateOwner,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }

    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        privateOwner: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        privateOwner: obj,
        page: 5,
        savedPages: [1, 2, 3, 4, 5],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        privateOwner: obj,
        savedPages: [1, 2, 3, 4],
      });
    } else {
      throw new Error("Whoops");
    }
  }

  return (
    <>
      {state.saved === true ? (
        <div className="listing-form__section">
          <EditFormSection parent={state} emit={handleVerify} />
        </div>
      ) : null}

      <div className="listing-form__section">
        <Header>Private Owner Information</Header>
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="firstName"
          placeholder="First Name"
          formatType="name"
          parent={state.firstName}
          emit={handleInputTypeStr}
        />
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="middleName"
          placeholder="Middle Name*"
          formatType="name"
          parent={state.middleName}
          emit={handleInputTypeStr}
        />
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="lastName"
          placeholder="Last Name"
          formatType="name"
          parent={state.lastName}
          emit={handleInputTypeStr}
        />
        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="phoneNumber"
            placeholder="Phone Number"
            groupSeparators={[")", "-"]}
            formatType="phone-number"
            parent={state.phoneNumber}
            emit={handleInputTypeStr}
          />
        </div>
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="email"
          placeholder="Email"
          formatType="email"
          parent={state.email}
          emit={handleInputTypeStr}
        />
        {/* Provide address? */}
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="provideAddress"
          formLayer="1"
          label="Provide address"
          parent={state.provideAddress}
          emit={handleTwoBtnRow}
        />
        {/* Address */}
        {state.provideAddress.value === true &&
        state.streetAddress &&
        state.unitNumber &&
        state.city &&
        state.adminAreaLevel1 &&
        state.zipCode &&
        state.country ? (
          <Wrapper
            apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
            render={renderMap}
            version="beta"
            libraries={["places", "marker"]}
          >
            <InputTypeStr<typeof state>
              size="lg"
              fieldName="streetAddress"
              ref={streetAddressRef}
              placeholder="Street Number"
              formatType="name"
              parent={state.streetAddress}
              emit={handleInputTypeStr}
            />
            <InputTypeStr<typeof state>
              size="md"
              fieldName="unitNumber"
              placeholder="Unit Number*"
              formatType="name"
              parent={state.unitNumber}
              emit={handleInputTypeStr}
            />
            <InputTypeStr<typeof state>
              size="lg"
              fieldName="city"
              placeholder="City"
              formatType="name"
              parent={state.city}
              emit={handleInputTypeStr}
            />
            <div className="listing-form__flex-row">
              <InputTypeStr<typeof state>
                size="md"
                fieldName="adminAreaLevel1"
                placeholder="State/Province"
                formatType="name"
                parent={state.adminAreaLevel1}
                emit={handleInputTypeStr}
              />
              <InputTypeStr<typeof state>
                size="md"
                fieldName="zipCode"
                placeholder="Postal Code"
                formatType="name"
                parent={state.zipCode}
                emit={handleInputTypeStr}
              />
            </div>
            <InputTypeStr<typeof state>
              size="lg"
              fieldName="country"
              placeholder="Country"
              formatType="name"
              parent={state.country}
              emit={handleInputTypeStr}
            />
          </Wrapper>
        ) : null}
      </div>

      {state.saved === false &&
      state.beingVerified === false &&
      state.provideAddress.value !== null ? (
        <SaveSection<typeof state>
          needsAddressValidation={state.provideAddress.value}
          parent={state}
          parentInitialState={initPrivateOwner}
          emit={handleVerify}
        />
      ) : null}

      {/* Verify -- address provided */}
      {state.beingVerified === true &&
      state.provideAddress.value === true &&
      addressValidationApiResponse?.result?.address.formattedAddress ? (
        <VerifySection
          addressValidationApiResponse={addressValidationApiResponse}
          parentName="Private Owner"
          parent={state}
          emit={handleVerify}
          children={
            <div>
              {state.firstName.formatted}{" "}
              {state.middleName && state.middleName.formatted.length > 0
                ? `${state.middleName.formatted} ${state.lastName.formatted}`
                : `, ${state.lastName.formatted}`}
              <br />
              {state.phoneNumber.formatted}
              <br />
              {state.email.formatted}
              <br />
              {addressValidationApiResponse?.result?.address.formattedAddress}
            </div>
          }
        />
      ) : null}

      {/* Verify -- no address provided */}
      {state.beingVerified === true && state.provideAddress.value === false ? (
        <VerifySection
          parentName="Private Owner"
          parent={state}
          emit={handleVerify}
          children={
            <div>
              {state.firstName.formatted}{" "}
              {state.middleName && state.middleName.formatted.length > 0
                ? `${state.middleName.formatted} ${state.lastName.formatted}`
                : `, ${state.lastName.formatted}`}
              <br />
              {state.phoneNumber.formatted}
              <br />
              {state.email.formatted}
            </div>
          }
        />
      ) : null}

      {state.saved === true ? (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      ) : (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      )}
    </>
  );
}
