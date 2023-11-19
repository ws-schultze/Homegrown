import {
  HeatingOption,
  CoolingOption,
  WaterOption,
  PowerOption,
  ListingData,
  MultiFamilyHomeUnit,
} from "../../../../../types/index";
import { initMultiFamilyHomeUnit } from "../../../../../initialValues";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../../initialValues";
import {} from "../../../../../index";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import YesNoBtns from "../../shared/YesNoBtns";
import FormCheck from "../../shared/FormCheck";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import ExpandingDropdown from "../../../../shared/dropdownWrappers/expandingDropdown/ExpandingDropdown";

export default function MultiFamilyHomeUnitForRentForm(props: FormProps) {
  const stateName: keyof ListingData = "multiFamilyHomeUnit";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleDropdown,
    handleGarage,
  } = useCommonFormLogic<MultiFamilyHomeUnit>({
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
        <header>Multi-Family Home Unit</header>

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
              placeholder="Sqft"
              min={100}
              max={10000}
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
              max={10}
              handleInput={(obj) => handleInput(obj, "bedrooms")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.fullBathrooms}
              placeholder="Full baths"
              min={1}
              max={5}
              handleInput={(obj) => handleInput(obj, "fullBathrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half baths"
              min={1}
              max={5}
              handleInput={(obj) => handleInput(obj, "halfBathrooms")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.parkingSpaces}
              placeholder="Parking spaces"
              min={1}
              max={10}
              handleInput={(obj) => handleInput(obj, "parkingSpaces")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.unitsInBuilding}
              placeholder="Units in building"
              min={1}
              max={10}
              handleInput={(obj) => handleInput(obj, "unitsInBuilding")}
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
          handleSelected={(obj) => handleInput(obj, "furnished")}
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
          state={state.streetParking}
          label="Street parking"
          handleSelected={(obj) => handleInput(obj, "streetParking")}
        />

        <YesNoBtns
          state={state.fencedYard}
          label="Fenced yard"
          handleSelected={(obj) => handleInput(obj, "fencedYard")}
        />

        <YesNoBtns
          state={state.sharedYard}
          label="Shared yard"
          handleSelected={(obj) => handleInput(obj, "sharedYard")}
        />
      </section>

      <FormCheck
        formState={state}
        initialFormState={initMultiFamilyHomeUnit}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
