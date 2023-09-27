import React, { useState, useEffect, useRef } from "react";
import {
  TypeStr,
  TypeAddressValidationApi_Response,
  TypeCompany,
  TypeVerifyActionName,
  TypeListingData,
} from "../../../../index";
import { initCompany } from "../../../../initialValues";
import InputTypeStr from "../../../common/inputTypeStr/InputTypeStr";
import { Wrapper } from "@googlemaps/react-wrapper";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
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
  deleteListing: () => void;
  toPageNumber: (number: number) => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: TypeListingData) => void;
}

export default function CompanyForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypeCompany>(initCompany);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<TypeAddressValidationApi_Response | null>(null);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const streetAddressRef = useRef<HTMLInputElement | null>(null);

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.company) {
      setState(parent.company);
    } else {
      throw new Error("Owner object not found in parent");
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

  function handleVerify(
    actionName: TypeVerifyActionName,
    obj: TypeCompany,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }

    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        company: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        company: obj,
        page: 5,
        savedPages: [1, 2, 3, 4, 5],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        company: obj,
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
        <Header>Company Information</Header>
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="name"
          placeholder="Company Name"
          formatType="name"
          parent={state.name}
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
      </div>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={true}
          parent={state}
          parentInitialState={initCompany}
          emit={handleVerify}
        />
      ) : null}

      {state.beingVerified === true &&
      addressValidationApiResponse?.result?.address.formattedAddress ? (
        <VerifySection
          addressValidationApiResponse={addressValidationApiResponse}
          parentName="Company"
          parent={state}
          emit={handleVerify}
          children={
            <div>
              {state.name.formatted}
              <br />
              {state.phoneNumber.formatted}
              <br />
              {state.email.formatted}
              <br />
              {addressValidationApiResponse.result.address.formattedAddress}
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
