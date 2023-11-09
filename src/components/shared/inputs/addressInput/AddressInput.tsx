import React, { useState, useRef } from "react";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import styles from "./addressInput.module.scss";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "../../../pages/exploreListingsPage/map/mapHelpers";
import makeAutocompleteWidget from "../../../pages/createListingPage/components/utils/address/makeAutocompleteWidget";
import setAutocompletePlaceValuesToState from "../../../pages/createListingPage/components/utils/address/setAutocompletePlaceValuesToState";
import setUnitNumberToState from "../../../pages/createListingPage/components/utils/setUnitNumberToState";

interface Props {
  address: Types.Address;
  emit: (address: Types.Address) => void;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function AddressInput(props: Props) {
  const [state, setState] = useState<Types.Address>(props.address);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const streetRef = useRef<HTMLInputElement | null>(null);
  const unitRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const stateRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<HTMLInputElement | null>(null);
  const countyRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);

  /**
   * Emit state to parent
   */
  function handleBlur(e: React.FocusEvent): void {
    e.preventDefault();
    e.stopPropagation();
    console.log("handling blur");
    props.emit(state);
  }

  function handleStreet(e: React.ChangeEvent<HTMLInputElement>) {
    handleAutocompleteWidget();
    // setState((s) => ({
    //   ...s,
    //   streetAddress: {
    //     ...s.streetAddress,
    //     value: e.target.value,
    //   },
    // }));
  }

  function handleUnit(e: React.ChangeEvent<HTMLInputElement>) {
    const unit = { ...state.unitNumber };
    unit.value = e.target.value;

    const s: typeof state = setUnitNumberToState(state, unit);
    setState(s);
  }

  function handleCity(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({
      ...s,
      city: {
        ...s.city,
        value: e.target.value,
      },
    }));
  }

  function handleCounty(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({
      ...s,
      adminAreaLevel2: {
        ...s.adminAreaLevel2,
        value: e.target.value,
      },
    }));
  }

  function handleZip(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({
      ...s,
      zipCode: {
        ...s.zipCode,
        value: e.target.value,
      },
    }));
  }

  function handleState(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({
      ...s,
      adminAreaLevel1: {
        ...s.adminAreaLevel1,
        value: e.target.value,
      },
    }));
  }

  function handleCountry(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({
      ...s,
      country: {
        ...s.country,
        value: e.target.value,
      },
    }));
  }

  function handleAutocompleteWidget() {
    if (streetRef.current && streetRef.current !== null) {
      const widget = makeAutocompleteWidget(streetRef);
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

  return (
    <form className={styles.container}>
      <Wrapper
        apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
        render={renderMap}
        version="beta"
        libraries={["places", "marker"]}
      >
        <div className={`${styles.input_wrap} ${styles.street_number}`}>
          <label
            className={` ${
              state.streetAddress.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            Street Number
          </label>
          <input
            placeholder="Street Number"
            ref={streetRef}
            type="text"
            value={state.streetAddress.value}
            onChange={handleStreet}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.streetAddress.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.unit_number}`}>
          <label
            className={` ${
              state.unitNumber.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            Unit Number
          </label>
          <input
            placeholder="Unit Number"
            ref={unitRef}
            type="text"
            value={state.unitNumber.value}
            onChange={handleUnit}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.unitNumber.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.city}`}>
          <label
            className={` ${
              state.city.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            City
          </label>

          <input
            placeholder="City"
            ref={cityRef}
            type="text"
            value={state.city.value}
            onChange={handleCity}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.city.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.admin_1}`}>
          <label
            className={` ${
              state.adminAreaLevel1.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            State
          </label>

          <input
            placeholder="State"
            ref={stateRef}
            type="text"
            value={state.adminAreaLevel1.value}
            onChange={handleState}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.adminAreaLevel1.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.zip}`}>
          <label
            className={` ${
              state.zipCode.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            Zip Code
          </label>

          <input
            placeholder="Zip Code"
            ref={zipRef}
            type="text"
            value={state.zipCode.value}
            onChange={handleZip}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.zipCode.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.admin_2}`}>
          <label
            className={` ${
              state.adminAreaLevel1.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            County
          </label>

          <input
            placeholder="County"
            ref={countyRef}
            type="text"
            value={state.adminAreaLevel1.value}
            onChange={handleStreet}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.adminAreaLevel1.errorMsg} />
        </div>

        <div className={`${styles.input_wrap} ${styles.admin_2}`}>
          <label
            className={` ${
              state.country.value.length > 0 ? styles.show : styles.hide
            }`}
          >
            Country
          </label>
          <input
            placeholder="Country"
            ref={countryRef}
            type="text"
            value={state.country.value}
            onChange={handleCountry}
            onBlur={handleBlur}
            disabled={state.readOnly}
          />
          <ErrorMsg errorMsg={state.country.errorMsg} />
        </div>
      </Wrapper>
    </form>
  );
}
