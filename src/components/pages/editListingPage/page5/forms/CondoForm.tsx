import {
  HeatingOption,
  Apartment,
  CoolingOption,
  WaterOption,
  PowerOption,
  ListingData,
  Condo,
} from "../../../../../types/index";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initApartment,
  initCondo,
} from "../../../../../initialValues";
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

export default function CondoForm(props: FormProps) {
  const stateName: keyof ListingData = "condo";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleDropdown,
    handleAssignedParking,
  } = useCommonFormLogic<Condo>({
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
        <header>Condo Features</header>
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
              handleInput={(obj) => handleInput(obj, "squareFeet")}
            />
          </div>
        </div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.bedrooms}
              placeholder="Bedrooms"
              min={1}
              max={10}
              handleInput={(obj) => handleInput(obj, "bedrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.floorNumber}
              placeholder="Floor number"
              min={1}
              max={50}
              handleInput={(obj) => handleInput(obj, "floorNumber")}
            />
          </div>
        </div>

        <div className={styles.md}></div>

        <div className={styles.flex_row}>
          <div className={styles.md}>
            <NumberInput
              state={state.fullBathrooms}
              placeholder="Full baths"
              min={1}
              max={10}
              handleInput={(obj) => handleInput(obj, "fullBathrooms")}
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half baths"
              min={0}
              max={10}
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
          state={state.stairAccess}
          label="Stair access"
          handleSelected={(obj) => handleInput(obj, "stairAccess")}
        />

        <YesNoBtns
          state={state.elevatorAccess}
          label="Elevator access"
          handleSelected={(obj) => handleInput(obj, "elevatorAccess")}
        />

        <YesNoBtns
          state={state.furnished}
          label="Furnished"
          handleSelected={(obj) => handleInput(obj, "furnished")}
        />
        <YesNoBtns
          state={state.assignedParking}
          label="Assigned parking"
          handleSelected={(obj) => handleAssignedParking(obj, state)}
        />
        {state.assignedParking.value === true &&
        state.numAssignedSpaces &&
        state.numAssignedSpacesWithCover ? (
          <div className={styles.flex_row}>
            <div className={styles.md}>
              <NumberInput
                state={state.numAssignedSpaces}
                placeholder="Spaces"
                min={1}
                max={10}
                handleInput={(obj) => handleInput(obj, "numAssignedSpaces")}
              />
            </div>
            <div className={styles.md}>
              <NumberInput
                state={state.numAssignedSpacesWithCover}
                placeholder="Covered spaces"
                min={1}
                max={10}
                handleInput={(obj) =>
                  handleInput(obj, "numAssignedSpacesWithCover")
                }
              />
            </div>
          </div>
        ) : null}

        <YesNoBtns
          state={state.unassignedParkingAvailable}
          label="Unassigned parking available"
          handleSelected={(obj) =>
            handleInput(obj, "unassignedParkingAvailable")
          }
        />

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
        initialFormState={initCondo}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
