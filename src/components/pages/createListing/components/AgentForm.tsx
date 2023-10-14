import React, { useState, useEffect, useRef } from "react";
import {
  Str,
  TypeAgent,
  AddressValidationApi_Response,
  ListingData,
  VerifyActionName,
} from "../../../../types/index";
import { initAgent } from "../../../../initialValues";
import InputStr from "../../../shared/inputs/inputStr/InputStr";
import { Wrapper } from "@googlemaps/react-wrapper";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
import EditFormSection from "./EditFormSection";
import VerifySection from "./VerifySection";
import SaveSection from "./SaveSection";
import PageBtns from "./PageBtns";
import setUnitNumberToState from "./utils/setUnitNumberToState";
import { Header } from "./styledComponents";
import { renderMap } from "../../exploreListings/map/mapHelpers";

interface Props {
  parent: ListingData;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
}

export default function AgentForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypeAgent>(initAgent);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | null>(null);
  const streetAddressRef = useRef<HTMLInputElement | null>(null);

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.agent) {
      setState(parent.agent);
    } else {
      throw new Error("Agent object not found in parent");
    }
  }, [parent]);

  // console.log("Agent.tsx rendered");

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

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
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

  function handleVerify(
    actionName: VerifyActionName,
    obj: typeof state,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }

    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        agent: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        agent: obj,
        page: 5,
        savedPages: [1, 2, 3, 4, 5],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        agent: obj,
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
        <Header>Agent Information</Header>
        <InputStr<typeof state>
          size="lg"
          fieldName="firstName"
          placeholder="First Name"
          formatType="name"
          parent={state.firstName}
          emit={handleInputStr}
        />
        <InputStr<typeof state>
          size="md"
          fieldName="middleName"
          placeholder="Middle Name*"
          formatType="name"
          parent={state.middleName}
          emit={handleInputStr}
        />
        <InputStr<typeof state>
          size="lg"
          fieldName="lastName"
          placeholder="Last Name"
          formatType="name"
          parent={state.lastName}
          emit={handleInputStr}
        />
        <InputStr<typeof state>
          size="lg"
          fieldName="companyName"
          placeholder="Company Name"
          formatType="name"
          parent={state.companyName}
          emit={handleInputStr}
        />
        <div className="listing-form__flex-row">
          <InputStr<typeof state>
            size="md"
            fieldName="licenseId"
            placeholder="License ID"
            formatType="real-estate-license-id"
            parent={state.licenseId}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="phoneNumber"
            placeholder="Phone Number"
            groupSeparators={[")", "-"]}
            formatType="phone-number"
            parent={state.phoneNumber}
            emit={handleInputStr}
          />
        </div>
        <InputStr<typeof state>
          size="lg"
          fieldName="email"
          placeholder="Email"
          formatType="email"
          parent={state.email}
          emit={handleInputStr}
        />
        {/* Address */}
        <Wrapper
          apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
          render={renderMap}
          version="beta"
          libraries={["places", "marker"]}
        >
          <InputStr<typeof state>
            size="lg"
            fieldName="streetAddress"
            ref={streetAddressRef}
            placeholder="Street Number"
            formatType="name"
            parent={state.streetAddress}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="unitNumber"
            placeholder="Unit Number*"
            formatType="name"
            parent={state.unitNumber}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="lg"
            fieldName="city"
            placeholder="City"
            formatType="name"
            parent={state.city}
            emit={handleInputStr}
          />
          <div className="listing-form__flex-row">
            <InputStr<typeof state>
              size="md"
              fieldName="adminAreaLevel1"
              placeholder="State/Province"
              formatType="name"
              parent={state.adminAreaLevel1}
              emit={handleInputStr}
            />
            <InputStr<typeof state>
              size="md"
              fieldName="zipCode"
              placeholder="Postal Code"
              formatType="name"
              parent={state.zipCode}
              emit={handleInputStr}
            />
          </div>
          <InputStr<typeof state>
            size="lg"
            fieldName="country"
            placeholder="Country"
            formatType="name"
            parent={state.country}
            emit={handleInputStr}
          />
        </Wrapper>
      </div>

      {/* Clear/Save */}
      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={true}
          parent={state}
          parentInitialState={initAgent}
          // children={<BellSVG />}
          emit={handleVerify}
        />
      ) : null}

      {/* Verify*/}
      {state.beingVerified === true &&
      addressValidationApiResponse?.result?.address.formattedAddress ? (
        <VerifySection
          parentName="Private Owner"
          parent={state}
          addressValidationApiResponse={addressValidationApiResponse}
          emit={handleVerify}
          children={
            <div>
              {state.firstName.formatted}{" "}
              {state.middleName && state.middleName.formatted.length > 0
                ? `${state.middleName.formatted} ${state.lastName.formatted}`
                : `${state.lastName.formatted}`}
              <br />
              License# {state.licenseId.formatted}
              <br />
              {state.phoneNumber.formatted}
              <br />
              {state.email.formatted}
              <br />
              {state.companyName.formatted}
              <br />
              {addressValidationApiResponse.result.address.formattedAddress}
            </div>
          }
        />
      ) : null}

      {state.saved === true ? (
        <PageBtns
          prevPage={prevPage}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          deleteListing={deleteListing}
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
