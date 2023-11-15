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
  Agent,
  Uploads,
} from "../../../../types";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import styles from "../styles.module.scss";
import Error from "../../../shared/error/Error";

export type FormState =
  | BasicInfo
  | Address
  | Agent
  | Owner
  | SingleFamilyHome
  | MultiFamilyHome
  | MultiFamilyHomeUnit
  | Apartment
  | ApartmentBuilding
  | ManufacturedHome
  | Uploads
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
  if (formState.beingVerified === false && formState.saved === false) {
    return (
      <div className={styles.form_check}>
        <SaveSection<typeof formState>
          needsAddressValidation={false}
          parent={formState}
          parentInitialState={initialFormState}
          handleFormVerification={handleFormVerification}
        />
      </div>
    );
  }

  if (formState.beingVerified === true) {
    return (
      <div className={styles.form_check}>
        <VerifySection<typeof formState>
          parent={formState}
          children={children}
          handleFormVerification={handleFormVerification}
        />
      </div>
    );
  }

  return <p>FormCheck error occurred.</p>;
}
