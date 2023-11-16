import styles from "../../../../shared/inputs/addressAutocompleteInput/addressAutocompleteInput.module.scss";

import EditFormSection from "../../shared/EditFormSection";
import { initAddress } from "../../../../../initialValues";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import AddressFields from "../../shared/AddressFields";
import { Address, ListingData } from "../../../../../types";

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
  const stateName: keyof ListingData = "address";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleAutocompletedAddress,
  } = useCommonFormLogic<Address>({
    pageNumber: thisPageNum,
    stateName: stateName,
  });

  return (
    <form className={styles.container}>
      {state.saved === true ? (
        <section>
          <EditFormSection
            parent={state}
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
        initialFormState={initAddress}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
