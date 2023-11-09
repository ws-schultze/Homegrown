import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Address,
  AddressValidationApi_Response,
  Str,
  ListingData,
  VerifyActionName,
} from "../../../../types/index";
import { initAddress } from "../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import AddressMap from "../../../shared/addressMap/AddressMap";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import PageBtns from "./PageBtns-old";
import InputStr from "../../../shared/inputs/inputStr/InputStr";
import setUnitNumberToState from "./utils/setUnitNumberToState";

import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import styles from "../styles.module.scss";

interface Props {
  /**
   * Shows a map with a marker for the given address.
   */
  parent: ListingData;
  showMap: boolean;
  prevPage?: () => void;
  nextPage: () => void;
  deleteListing: () => void;
  toPageNumber?: (number: number) => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
}

function ListingAddressForm({
  parent,
  showMap,
  prevPage,
  nextPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<Address>(parent.address);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | null>(null);

  // const streetAddressRef = useRef<HTMLInputElement | null>(null);
  const streetAddressRef = React.createRef<HTMLInputElement>();
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setState(parent.address);
  }, [parent]);

  /**
   * Scroll map into window center is state is validated by user
   */
  useEffect(() => {
    if (
      mapRef.current &&
      state.geolocation.value.lat > 0 &&
      state.geolocation.value.lng > 0
    ) {
      mapRef.current.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [state.geolocation.value.lat, state.geolocation.value.lng]);

  /**
   * Generate the places autocompleteWidget, set it to state and add an event listener to it
   * https://developers.google.com/maps/documentation/javascript/reference/places-widget
   */
  function handleAutocompleteWidget() {
    console.log("handling widget");
    if (streetAddressRef.current && streetAddressRef.current !== null) {
      const widget = makeAutocompleteWidget(streetAddressRef);
      setAutocompleteWidget(widget);
    } else {
      console.log("No street address ref found");
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

  // /**
  //  * Set state for a given address field
  //  * @param e React.ChangeEvent<HTMLInputElement>
  //  * @param key keyof typeof state
  //  */
  // function handleAddress(e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof state): void {
  //   const field = state[key] as Str | TypeBool;
  //   if (key === "streetAddress") {
  //     handleAutocompleteWidget();
  //   }
  //   const s: typeof state = setAddressFieldToState(state, e.target.value, key, field.required);
  //   setState(s);
  // }

  // function handleBlur(key: keyof typeof state): void {
  //   const field = state[key] as Str | TypeBool;
  //   if (field.required === true && field.valid === false && field.value === "") {
  //     const field = setErrorMsg<typeof state>(state, key, "Required");
  //     setState((s) => ({
  //       ...s,
  //       [key]: field,
  //     }));
  //   }
  // }

  function handleVerify(
    actionName: VerifyActionName,
    obj: Address,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        address: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        address: obj,
        currentPage: 4,
        savedPages: [1, 2, 3, 4],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        address: obj,
        savedPages: [1, 2, 3],
      });
    } else {
      throw new Error("Whoops");
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

  // To keep map from re-rendering on each state update, memoize the props of the map.
  // const mapZoom = useMemo(() => 17, []);
  // const markerLabel = useMemo(() => state.formattedAddress.value, [state.formattedAddress.value]);
  const mapCenter = useMemo(
    () => ({
      lat: state.geolocation.value.lat,
      lng: state.geolocation.value.lng,
    }),
    [state.geolocation.value.lat, state.geolocation.value.lng]
  );

  // ** Note about street address label **
  //--------------------------------------//

  // Avoid the word "address" in id, name, or label text to avoid browser autofill from conflicting with Place Autocomplete. Star or comment bug https://crbug.com/587466 to request Chromium to honor   autoComplete="off" attribute.
  // Hack! ---> to have a label on an address input with the word "address", just use the pseudo element ::before on the parent div, then chromium will respect autocomplete="off"
  // In this case listing-form__street-address::before is the label for street address
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
  // To Make sure that autocomplete="off" actually works on chrome, put a hidden label on the input
  // and do NOT include the work address in it's text.
  // Note that removing the hidden label will make chrome NOT respect autocomplete="off"
  // **You can also include a visible label as long as the word address is not in it.**

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection parent={state} emit={handleVerify} />
        </section>
      ) : null}

      <section>
        <header>Listing Address</header>
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
          <div className={styles.flex_row}>
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
          {showMap === true ? (
            <div ref={mapRef} className={styles.map_container}>
              <AddressMap center={mapCenter} />
            </div>
          ) : null}
        </Wrapper>
      </section>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={true}
          parent={state}
          parentInitialState={initAddress}
          emit={handleVerify}
          deleteListing={deleteListing}
        />
      ) : null}

      {state.beingVerified === true &&
      addressValidationApiResponse?.result?.address.formattedAddress ? (
        <VerifySection
          parentName="Address"
          parent={state}
          addressValidationApiResponse={addressValidationApiResponse}
          emit={handleVerify}
          children={
            <div>
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
    </form>
  );
}

export default React.memo(ListingAddressForm);
