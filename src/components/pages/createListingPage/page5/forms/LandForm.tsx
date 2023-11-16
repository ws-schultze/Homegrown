import {
  HeatingOption,
  CoolingOption,
  WaterOption,
  PowerOption,
  TypeBool,
  ListingData,
  SingleFamilyHome,
  Land,
} from "../../../../../types/index";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import { initLand, initSingleFamilyHome } from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import FormCheck from "../../shared/FormCheck";
import YesNoBtns from "../../shared/YesNoBtns";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";

export default function LandForm(props: FormProps) {
  const stateName: keyof ListingData = "land";
  const { state, handleFormVerificationWrapper, handleInput } =
    useCommonFormLogic<Land>({
      pageNumber: props.thisPageNum,
      stateName: stateName,
    });

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection
            parent={state}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Land Features</header>
        <div className={styles.flex_row}>
          <div className={styles.md}>
            <CommaSeparatedWithDecimalInput
              placeholder="Acres"
              state={state.acres}
              min={0.01}
              max={1000000}
              handleInput={(obj) => handleInput(obj, "acres")}
            />
          </div>
          <div className={styles.md}>
            <CommaSeparatedWholeNumberInput
              placeholder="Elevation (ft)"
              state={state.elevation}
              min={0}
              max={15000}
              handleInput={(obj) => handleInput(obj, "elevation")}
            />
          </div>
        </div>

        <YesNoBtns
          state={state.developedRoads}
          label="Developed roads"
          handleSelected={(obj) => handleInput(obj, "developedRoads")}
        />

        <div className={styles.conditional_menu_container}>
          <label htmlFor="utilities-menu">Utilities</label>
          <div className={styles.conditional_menu}>
            <YesNoBtns
              state={state.cityWater}
              label="Water"
              handleSelected={(obj) => handleInput(obj, "cityWater")}
            />

            <YesNoBtns
              state={state.citySewer}
              label="Sewer"
              handleSelected={(obj) => handleInput(obj, "citySewer")}
            />

            <YesNoBtns
              state={state.cityPower}
              label="Power"
              handleSelected={(obj) => handleInput(obj, "cityPower")}
            />
          </div>
        </div>
      </section>

      <FormCheck
        formState={state}
        initialFormState={initLand}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
