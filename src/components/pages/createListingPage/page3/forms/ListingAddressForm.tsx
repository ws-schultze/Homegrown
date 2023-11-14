import React, { useState, useRef } from "react";
import ErrorMsg from "../../../../shared/errorMsg/ErrorMsg";
import * as Types from "../../../../../types/index";
import styles from "../../../../shared/inputs/addressAutocompleteInput/addressAutocompleteInput.module.scss";
import { Wrapper } from "@googlemaps/react-wrapper";
import { renderMap } from "../../../exploreListingsPage/map/mapHelpers";
import makeAutocompleteWidget from "../../utils/address/makeAutocompleteWidget";
import setAutocompletePlaceValuesToState from "../../utils/address/setAutocompletePlaceValuesToState";
import setUnitNumberToState from "../../utils/setUnitNumberToState";
import EditFormSection from "../../shared/EditFormSection";
import { initAddress } from "../../../../../initialValues";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import {
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../../createListingPageSlice";
import { useNavigate } from "react-router";
import FormCheck from "../../shared/FormCheck";
import { handleFormVerification } from "../../utils/formUtils";

/**
 * Notice that this component only formats objects of Str
 */
export default function ListingAddressForm({
  thisPageNum,
}: {
  /**
   * Used by handleVerify to add this page number to the array of
   * saved pages in the createListingPage state
   */
  thisPageNum: number;
}) {
  const streetRef = useRef<HTMLInputElement | null>(null);
  const unitRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const stateRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);

  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<Types.AddressValidationApi_Response | undefined>(undefined);

  const dispatch = useDispatch();
  const state = useAppSelector((s) => s.createListingPage);
  const { address } = state.listing;
  const navigate = useNavigate();

  function handleStreet(e: React.ChangeEvent<HTMLInputElement>) {
    handleAutocompleteWidget();
    dispatch(
      setListing({
        ...state.listing,
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
        ...state.listing,
        address: s,
      })
    );
  }

  function handleCity(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      setListing({
        ...state.listing,
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
        ...state.listing,
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
        ...state.listing,
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
        ...state.listing,
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
            state: state.listing.address,
            autocomplete: autocompleteWidget,
          });
        dispatch(
          setListing({
            ...state.listing,
            address: s,
          })
        );
      });
    }
  }

  // function handleVerify(
  //   actionName: Types.VerifyActionName,
  //   obj: Types.Address,
  //   addressValidationApiResponse?: Types.AddressValidationApi_Response
  // ) {
  //   if (addressValidationApiResponse) {
  //     setAddressValidationApiResponse(addressValidationApiResponse);
  //   }

  //   if (actionName === "save") {
  //     /**
  //      * Set this page to saved
  //      */
  //     dispatch(
  //       setListing({
  //         ...state.listing,
  //         address: obj,
  //       })
  //     );
  //     return;
  //   }

  //   if (actionName === "edit") {
  //     /**
  //      * Remove this page number from saved pages
  //      */
  //     dispatch(
  //       setListing({
  //         ...state.listing,
  //         address: obj,
  //       })
  //     );
  //     const idx = state.savedPages.indexOf(thisPageNum);
  //     const savedPagesCopy = [...state.savedPages];
  //     savedPagesCopy.splice(idx, 1);
  //     dispatch(setSavedPages(savedPagesCopy));
  //     return;
  //   }

  //   if (actionName === "verify" && obj.saved === true) {
  //     /**
  //      * Verify info and go to next page
  //      */
  //     dispatch(
  //       setListing({
  //         ...state.listing,
  //         address: obj,
  //       })
  //     );
  //     dispatch(setSavedPages(state.savedPages.concat(thisPageNum)));
  //     navigate(`/create-listing/${thisPageNum + 1}`);
  //     return;
  //   }
  //   if (actionName === "verify" && obj.saved === false) {
  //     /**
  //      * Info does not all look correct, hide verification component,
  //      * stay on this page, show save component again.
  //      */
  // dispatch(
  //   setListing({
  //     ...state.listing,
  //     address: obj,
  //   })
  // );
  //     return;
  //   }

  //   throw new Error("Escaped");
  // }

  function handleFormVerificationWrapper(
    actionName: Types.VerifyActionName,
    obj: Types.Address
  ) {
    handleFormVerification<Types.Address>({
      createListingPageState: state,
      actionName,
      obj,
      thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...state.listing,
            address: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
      addressValidationApiResponse,
      setAddressValidationApiResponse,
    });
  }

  return (
    <form className={styles.container}>
      {address.saved === true ? (
        <section>
          <EditFormSection
            parent={address}
            emit={handleFormVerificationWrapper}
          />
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
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
