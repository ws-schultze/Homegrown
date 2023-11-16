import {
  HeatingOption,
  Apartment,
  CoolingOption,
  WaterOption,
  PowerOption,
  ListingData,
} from "../../../../../types/index";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initApartment,
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

export default function ApartmentForRentForm(props: FormProps) {
  const stateName: keyof ListingData = "apartment";
  const {
    state,
    handleFormVerificationWrapper,
    handleInput,
    handleDropdown,
    handleAssignedParking,
  } = useCommonFormLogic<Apartment>({
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
        <header>Apartment Features</header>
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
              state={state.floorNumber}
              placeholder="Floor number"
              min={1}
              max={50}
              handleInput={(obj) => handleInput(obj, "floorNumber")}
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
        initialFormState={initApartment}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
