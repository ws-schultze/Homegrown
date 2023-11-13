import {
  Address,
  Apartment,
  ApartmentBuilding,
  BasicInfo,
  Land,
  ManufacturedHome,
  MultiFamilyHome,
  MultiFamilyHomeUnit,
  Owner,
  SingleFamilyHome,
  TypeAgent,
} from "../../../../types";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";

export type FormState =
  | BasicInfo
  | Address
  | TypeAgent
  | Owner
  | SingleFamilyHome
  | MultiFamilyHome
  | MultiFamilyHomeUnit
  | Apartment
  | ApartmentBuilding
  | ManufacturedHome
  | Land;

export interface FormCheckProps {
  /**
   * For an Agent form, the formState would be an agent object.
   */
  formState: FormState;
  /**
   * The initial for values, such as initialAgentState
   */
  initialFormState: FormState;
  /**
   * Nodes to be displayed in the verification section. If verifying an address,
   * the address will be displayed
   */
  children?: JSX.Element;
  /**
   * Each form has its own verification function that does error message checks
   * and prevents the user from saving an incomplete form
   */
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
  children,
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
          // parentName="Basic Information"
          parent={formState}
          children={children}
          emit={handleFormVerification}
        />
      ) : null}
    </div>
  );
}
