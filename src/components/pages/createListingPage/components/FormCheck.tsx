import {
  Address,
  Apartment,
  ApartmentBuilding,
  BasicInfo,
  Land,
  ManufacturedHome,
  MultiFamilyHome,
  MultiFamilyHomeUnit,
  SingleFamilyHome,
} from "../../../../types";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";

export type FormState =
  | BasicInfo
  | Address
  | SingleFamilyHome
  | MultiFamilyHome
  | MultiFamilyHomeUnit
  | Apartment
  | ApartmentBuilding
  | ManufacturedHome
  | Land;

export interface FormCheckProps {
  formState: FormState;
  initialFormState: FormState;
  handleFormVerification: (...args: any[]) => void;
}

/**
 * The bottom section of each form page that is used for
 * entering listing data. This is not used on form pages
 * that are used for entering other data.
 */
export default function FormCheck({
  formState,
  initialFormState,
  handleFormVerification,
}: FormCheckProps) {
  return (
    <div>
      {formState.saved === false && formState.beingVerified === false ? (
        <SaveSection<typeof formState>
          needsAddressValidation={false}
          parent={formState}
          parentInitialState={initialFormState}
          emit={handleFormVerification}
        />
      ) : null}
      {formState.beingVerified === true ? (
        <VerifySection<typeof formState>
          parentName="Basic Information"
          parent={formState}
          emit={handleFormVerification}
        />
      ) : null}
    </div>
  );
}
