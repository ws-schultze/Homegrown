import {
  HeatingOption,
  MultiFamilyHome,
  CoolingOption,
  WaterOption,
  PowerOption,
  ListingData,
} from "../../../../../types/index";
import { initMultiFamilyHome } from "../../../../../initialValues";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YesNoBtns from "../../shared/YesNoBtns";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import ExpandingDropdown from "../../../../shared/dropdownWrappers/expandingDropdown/ExpandingDropdown";

export default function MultiFamilyHomeForSaleForm(props: FormProps) {
  const stateName: keyof ListingData = "multiFamilyHome";
  const { state, handleFormVerificationWrapper, handleInput, handleDropdown } =
    useCommonFormLogic<MultiFamilyHome>({
      pageNumber: props.thisPageNum,
      stateName: stateName,
    });

  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection<typeof state>
            parent={state}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}

      <section>
        <header>Multi-Family Home Features</header>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <YearInput
              state={state.yearBuilt}
              placeholder="Year built"
              min={0}
              max={new Date().getFullYear()}
              handleInput={(obj) => handleInput(obj, "yearBuilt")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.totalUnits}
              placeholder="Units"
              min={1}
              max={20}
              handleInput={(obj) => handleInput(obj, "totalUnits")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.stories}
              placeholder="Stories"
              min={1}
              max={5}
              handleInput={(obj) => handleInput(obj, "stories")}
            />
          </div>
          <div className={styles.md}>
            <CommaSeparatedWholeNumberInput
              state={state.squareFeet}
              placeholder="Square feet"
              min={100}
              handleInput={(obj) => handleInput(obj, "squareFeet")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.fullBathrooms}
              placeholder="Full baths"
              min={1}
              max={15}
              handleInput={(obj) => handleInput(obj, "fullBathrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half baths"
              min={0}
              max={15}
              handleInput={(obj) => handleInput(obj, "halfBathrooms")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.unitsWithGarageSpace}
              placeholder="Units with garage"
              min={0}
              max={5}
              handleInput={(obj) => handleInput(obj, "unitsWithGarageSpace")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.bedrooms}
              placeholder="Bedrooms"
              min={1}
              max={20}
              handleInput={(obj) => handleInput(obj, "bedrooms")}
            />
          </div>
        </div>

        <ExpandingDropdown<HeatingOption>
          menuItems={heatingOptions}
          isMulti={true}
          isSearchable={false}
          selectedItems={state.heating.value}
          errorMsg={state.heating.errorMsg}
          label={"Heating"}
          placeHolder={"Select one or more options"}
          disabled={state.readOnly}
          handleSelectedItems={(options) =>
            handleDropdown<HeatingOption>(options, "heating")
          }
        />

        <ExpandingDropdown<CoolingOption>
          menuItems={coolingOptions}
          isMulti={true}
          isSearchable={false}
          selectedItems={state.cooling.value}
          errorMsg={state.cooling.errorMsg}
          label={"Cooling"}
          placeHolder={"Select one or more options"}
          disabled={state.readOnly}
          handleSelectedItems={(options) =>
            handleDropdown<CoolingOption>(options, "cooling")
          }
        />

        <ExpandingDropdown<WaterOption>
          menuItems={waterOptions}
          isMulti={true}
          isSearchable={false}
          selectedItems={state.water.value}
          errorMsg={state.water.errorMsg}
          label={"Water"}
          placeHolder={"Select one or more options"}
          disabled={state.readOnly}
          handleSelectedItems={(options) =>
            handleDropdown<WaterOption>(options, "water")
          }
        />

        <ExpandingDropdown<PowerOption>
          menuItems={powerOptions}
          isMulti={true}
          isSearchable={false}
          selectedItems={state.power.value}
          errorMsg={state.power.errorMsg}
          label={"Power"}
          placeHolder={"Select one or more options"}
          disabled={state.readOnly}
          handleSelectedItems={(options) =>
            handleDropdown<PowerOption>(options, "power")
          }
        />

        <YesNoBtns
          label="Street parking"
          state={state.streetParking}
          handleSelected={(obj) => handleInput(obj, "streetParking")}
        />

        <YesNoBtns
          label="Fenced yard"
          state={state.fencedYard}
          handleSelected={(obj) => handleInput(obj, "fencedYard")}
        />
      </section>

      <FormCheck
        formState={state}
        initialFormState={initMultiFamilyHome}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
