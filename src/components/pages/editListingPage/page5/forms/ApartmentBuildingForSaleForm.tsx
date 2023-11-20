import {
  HeatingOption,
  CoolingOption,
  WaterOption,
  PowerOption,
  ApartmentBuilding,
  ListingData,
} from "../../../../../types/index";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initApartmentBuilding,
} from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";

export default function ApartmentBuildingForSaleForm(props: FormProps) {
  const stateName: keyof ListingData = "apartmentBuilding";
  const { state, handleFormVerificationWrapper, handleInput, handleDropdown } =
    useCommonFormLogic<ApartmentBuilding>({
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
        <header>Apartment Building Features</header>

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
            <CommaSeparatedWholeNumberInput
              state={state.totalUnits}
              placeholder="Units"
              min={5}
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
              max={100}
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
            <CommaSeparatedWithDecimalInput
              placeholder="Acres"
              state={state.acres}
              min={0}
              max={1000000}
              handleInput={(obj) => handleInput(obj, "acres")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.bedrooms}
              placeholder="Bedrooms"
              min={1}
              max={2000}
              handleInput={(obj) => handleInput(obj, "bedrooms")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.fullBathrooms}
              placeholder="Full bathrooms"
              min={1}
              max={2000}
              handleInput={(obj) => handleInput(obj, "fullBathrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half bathrooms"
              min={0}
              max={2000}
              handleInput={(obj) => handleInput(obj, "halfBathrooms")}
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
      </section>

      <FormCheck
        formState={state}
        initialFormState={initApartmentBuilding}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
