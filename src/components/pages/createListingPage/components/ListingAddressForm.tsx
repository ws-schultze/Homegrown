import React, { useState, useRef } from "react";
import ErrorMsg from "../../../shared/errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import styles from "../../../shared/inputs/addressAutocompleteInput/addressAutocompleteInput.module.scss";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import setUnitNumberToState from "./utils/setUnitNumberToState";
import EditFormSection from "./EditFormSection";
import { initAddress } from "../../../../initialValues";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import {
  setCurrentPageNumber,
  setListing,
  setSavedPages,
} from "../createListingPageSlice";
import { useNavigate } from "react-router";
import FormCheck from "./FormCheck";

/**
 * Notice that this component only formats objects of Str
 */
export default function ListingAddressForm() {
  const streetRef = useRef<HTMLInputElement | null>(null);
  const unitRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const stateRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<HTMLInputElement | null>(null);
  const countyRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<Types.AddressValidationApi_Response | null>(null);

  // const [address, setAddress] = useState<Types.Address>(initAddress);
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);
  const { address } = pageState.listing;
  const navigate = useNavigate();

  function handleStreet(e: React.ChangeEvent<HTMLInputElement>) {
    handleAutocompleteWidget();
    dispatch(
      setListing({
        ...pageState.listing,
        address: {
          ...address,
          streetAddress: {
            ...address.streetAddress,
            value: e.target.value,
          },
        },
      })
    );
  }

  function handleUnit(e: React.ChangeEvent<HTMLInputElement>) {
    const unit = { ...address.unitNumber };
    unit.value = e.target.value;

    const s: typeof address = setUnitNumberToState(address, unit);
    dispatch(
      setListing({
        ...pageState.listing,
        address: s,
      })
    );
  }

  function handleCity(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      setListing({
        ...pageState.listing,
        address: {
          ...address,
          city: {
            ...address.city,
            value: e.target.value,
          },
        },
      })
    );
  }

  function handleZip(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      setListing({
        ...pageState.listing,
        address: {
          ...address,
          zipCode: {
            ...address.zipCode,
            value: e.target.value,
          },
        },
      })
    );
  }

  function handleState(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      setListing({
        ...pageState.listing,
        address: {
          ...address,
          adminAreaLevel1: {
            ...address.adminAreaLevel1,
            value: e.target.value,
          },
        },
      })
    );
  }

  function handleCountry(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      setListing({
        ...pageState.listing,
        address: {
          ...address,
          country: {
            ...address.country,
            value: e.target.value,
          },
        },
      })
    );
  }

  function handleAutocompleteWidget() {
    if (streetRef.current && streetRef.current !== null) {
      const widget = makeAutocompleteWidget(streetRef);
      setAutocompleteWidget(widget);
    }

    // Listen for click on widget item
    if (autocompleteWidget) {
      autocompleteWidget.addListener("place_changed", () => {
        const s: Types.Address =
          setAutocompletePlaceValuesToState<Types.Address>({
            state: pageState.listing.address,
            autocomplete: autocompleteWidget,
          });
        dispatch(
          setListing({
            ...pageState.listing,
            address: s,
          })
        );
      });
    }
  }

  function handleVerify(
    actionName: Types.VerifyActionName,
    address: Types.Address,
    addressValidationApiResponse?: Types.AddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }

    if (
      actionName === "save" ||
      actionName === "edit" ||
      actionName === "blur"
    ) {
      dispatch(
        setListing({
          ...pageState.listing,
          address: address,
        })
      );
    } else if (actionName === "verify" && address.saved === true) {
      dispatch(
        setListing({
          ...pageState.listing,
          address: address,
        })
      );
      dispatch(setSavedPages([1, 2, 3, 4]));
      dispatch(setCurrentPageNumber(4));
      navigate("/create-listing/4");
    } else if (actionName === "verify" && address.saved === false) {
      dispatch(
        setListing({
          ...pageState.listing,
          address: address,
        })
      );
      dispatch(setSavedPages([1, 2, 3]));
    } else {
      throw new Error("Whoops");
    }
  }

  return (
    <form className={styles.container}>
      {address.saved === true ? (
        <section>
          <EditFormSection parent={address} emit={handleVerify} />
        </section>
      ) : null}

      <section>
        <header>Listing Address</header>
        <p>
          Start entering the street address and select an option from the
          dropdown menu that will appear.
        </p>

        <Wrapper
          apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
          render={renderMap}
          version="beta"
          libraries={["places", "marker"]}
        >
          <div className={`${styles.input_wrap} ${styles.street_number}`}>
            <label
              className={` ${
                address.streetAddress.value.length > 0
                  ? styles.show
                  : styles.hide
              }`}
            >
              Street Number
            </label>
            <input
              placeholder="Street Number"
              ref={streetRef}
              type="text"
              value={address.streetAddress.value}
              onChange={handleStreet}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.streetAddress.errorMsg} />
          </div>

          <div className={`${styles.input_wrap} ${styles.unit_number}`}>
            <label
              className={` ${
                address.unitNumber.value.length > 0 ? styles.show : styles.hide
              }`}
            >
              Unit Number
            </label>
            <input
              placeholder="Unit Number"
              ref={unitRef}
              type="text"
              value={address.unitNumber.value}
              onChange={handleUnit}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.unitNumber.errorMsg} />
          </div>

          <div className={`${styles.input_wrap} ${styles.city}`}>
            <label
              className={` ${
                address.city.value.length > 0 ? styles.show : styles.hide
              }`}
            >
              City
            </label>

            <input
              placeholder="City"
              ref={cityRef}
              type="text"
              value={address.city.value}
              onChange={handleCity}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.city.errorMsg} />
          </div>

          <div className={`${styles.input_wrap} ${styles.state}`}>
            <label
              className={` ${
                address.adminAreaLevel1.value.length > 0
                  ? styles.show
                  : styles.hide
              }`}
            >
              State
            </label>

            <input
              placeholder="State"
              ref={stateRef}
              type="text"
              value={address.adminAreaLevel1.value}
              onChange={handleState}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.adminAreaLevel1.errorMsg} />
          </div>

          <div className={`${styles.input_wrap} ${styles.zip}`}>
            <label
              className={` ${
                address.zipCode.value.length > 0 ? styles.show : styles.hide
              }`}
            >
              Postal Code
            </label>

            <input
              placeholder="Postal Code"
              ref={zipRef}
              type="text"
              value={address.zipCode.value}
              onChange={handleZip}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.zipCode.errorMsg} />
          </div>

          <div className={`${styles.input_wrap} ${styles.admin_2}`}>
            <label
              className={` ${
                address.country.value.length > 0 ? styles.show : styles.hide
              }`}
            >
              Country
            </label>
            <input
              placeholder="Country"
              ref={countryRef}
              type="text"
              value={address.country.value}
              onChange={handleCountry}
              disabled={address.readOnly}
            />
            <ErrorMsg errorMsg={address.country.errorMsg} />
          </div>
        </Wrapper>
      </section>
      <FormCheck
        formState={address}
        initialFormState={initAddress}
        handleFormVerification={handleVerify}
      />
    </form>
  );
}
