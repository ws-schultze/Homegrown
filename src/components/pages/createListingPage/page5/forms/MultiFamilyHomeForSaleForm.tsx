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

        <Dropdown<HeatingOption>
          placeHolder={"Select Heating Option(s)"}
          parent={state.heating.value}
          menuItems={heatingOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.heating.errorMsg}
          label={"Heating"}
          emit={(options) => handleDropdown<HeatingOption>(options, "heating")}
        />

        <Dropdown<CoolingOption>
          placeHolder={"Select Cooling Option(s)"}
          menuItems={coolingOptions}
          isMulti={true}
          isSearchable={false}
          parent={state.cooling.value}
          disabled={state.readOnly}
          errorMsg={state.cooling.errorMsg}
          label={"Cooling"}
          emit={(options) => handleDropdown<CoolingOption>(options, "cooling")}
        />

        <Dropdown<WaterOption>
          placeHolder={"Select Water Option(s)"}
          parent={state.water.value}
          menuItems={waterOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.water.errorMsg}
          label={"Water"}
          emit={(options) => handleDropdown<WaterOption>(options, "water")}
        />

        <Dropdown<PowerOption>
          placeHolder={"Select Power Option(s)"}
          parent={state.power.value}
          menuItems={powerOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.power.errorMsg}
          label={"Power"}
          emit={(options) => handleDropdown<PowerOption>(options, "power")}
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
