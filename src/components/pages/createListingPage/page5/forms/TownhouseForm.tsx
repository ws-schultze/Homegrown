import {
  HeatingOption,
  CoolingOption,
  WaterOption,
  PowerOption,
  TypeBool,
  ListingData,
  SingleFamilyHome,
  Townhouse,
} from "../../../../../types/index";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  initSingleFamilyHome,
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initTownhouse,
} from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import FormCheck from "../../shared/FormCheck";
import YesNoBtns from "../../shared/YesNoBtns";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import ExpandingDropdown from "../../../../shared/dropdownWrappers/expandingDropdown/ExpandingDropdown";

export default function TownhouseForm(props: FormProps) {
  const stateName: keyof ListingData = "townhouse";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleDropdown,
    handleGarage,
  } = useCommonFormLogic<Townhouse>({
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
        <header>Townhouse Features</header>
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
              state={state.stories}
              placeholder="Stories"
              min={1}
              max={5}
              handleInput={(obj) => handleInput(obj, "stories")}
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
        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.fullBathrooms}
              placeholder="Full bathrooms"
              min={1}
              max={20}
              handleInput={(obj) => handleInput(obj, "fullBathrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half bathrooms"
              min={0}
              max={20}
              handleInput={(obj) => handleInput(obj, "halfBathrooms")}
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
          state={state.furnished}
          label="Furnished"
          handleSelected={(obj: TypeBool) => handleInput(obj, "furnished")}
        />

        <YesNoBtns
          state={state.garage}
          label="Garage"
          handleSelected={(obj) => handleGarage(obj, state)}
        />

        {state.garage.value === true &&
        state.garageAttached &&
        state.garageNumCars &&
        state.garageSqFt ? (
          <div className={styles.conditional_menu_container}>
            <label htmlFor="garage-menu">Garage features</label>
            <div className={styles.conditional_menu}>
              <YesNoBtns
                leftBtnText="Attached"
                rightBtnText="Detached"
                state={state.garageAttached!}
                handleSelected={(obj) => handleInput(obj, "garageAttached")}
              />
              <div className={styles.flex_row}>
                <div className={styles.sm}>
                  <NumberInput
                    state={state.garageNumCars!}
                    placeholder="Cars"
                    min={1}
                    max={10}
                    handleInput={(obj) => handleInput(obj, "garageNumCars")}
                  />
                </div>
                <div className={styles.sm}>
                  <CommaSeparatedWholeNumberInput
                    state={state.garageSqFt!}
                    placeholder="Sqft"
                    min={80}
                    max={10000}
                    handleInput={(obj) => handleInput(obj, "garageSqFt")}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

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

        <YesNoBtns
          label="Shared yard"
          state={state.sharedYard}
          handleSelected={(obj) => handleInput(obj, "sharedYard")}
        />
      </section>

      <FormCheck
        formState={state}
        initialFormState={initTownhouse}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
