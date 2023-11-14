import {
  HeatingOption,
  VerifyActionName,
  CoolingOption,
  WaterOption,
  PowerOption,
  TypeBool,
} from "../../../../../types/index";
import { initStrReq, initTypeBoolReqNull } from "../../../../../initialValues";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  initSingleFamilyHome,
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../../initialValues";
import EditFormSection from "../../shared/EditFormSection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { handleDropdown, handleFormVerification } from "../../utils/formUtils";
import {
  setListing,
  setSavedPages,
  setUnsavedPages,
} from "../../createListingPageSlice";
import FormCheck from "../../shared/FormCheck";
import YesNoBtns from "../../shared/YesNoBtns";
import CommaSeparatedWholeNumber from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";

export default function SingleFamilyHomeForm(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.singleFamilyHome!;
  const stateName: keyof typeof listing = "singleFamilyHome";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("state is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<typeof state>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            [stateName]: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleUnsavedPageNumbers: (nums) => dispatch(setUnsavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  function handleInput<T>(obj: T, key: keyof typeof state) {
    dispatch(
      setListing({
        ...listing,
        [stateName]: {
          ...state,
          [key]: obj,
        },
      })
    );
  }

  function handleDropdownWrapper<T>(options: T[], key: keyof typeof state) {
    handleDropdown(options, state, key, (obj) =>
      dispatch(
        setListing({
          ...listing,
          [stateName]: obj,
        })
      )
    );
  }

  function handleGarage(obj: typeof state.garage) {
    const { garageAttached, garageNumCars, garageSqFt, ...rest } = state;

    // Has garage
    if (obj.value === true) {
      dispatch(
        setListing({
          ...listing,
          [stateName]: {
            ...state,
            garage: obj,
            garageAttached: initTypeBoolReqNull,
            garageNumCars: initStrReq,
            garageSqFt: initStrReq,
          },
        })
      );
      return;
    }

    // No garage --> remove garage props from state
    if (obj.value === false) {
      dispatch(
        setListing({
          ...listing,
          singleFamilyHome: {
            ...rest,
            garage: obj,
          },
        })
      );
      return;
    }
  }

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
        <header>House Features</header>
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
            <CommaSeparatedWholeNumber
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

        <div className={styles.md}>
          <CommaSeparatedWithDecimalInput
            placeholder="Acres"
            state={state.acres}
            min={0}
            max={1000000}
            handleInput={(obj) => handleInput(obj, "acres")}
          />
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
          emit={(options) =>
            handleDropdownWrapper<HeatingOption>(options, "heating")
          }
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
          emit={(options) =>
            handleDropdownWrapper<CoolingOption>(options, "cooling")
          }
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
          emit={(options) =>
            handleDropdownWrapper<WaterOption>(options, "water")
          }
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
          emit={(options) =>
            handleDropdownWrapper<PowerOption>(options, "power")
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
          handleSelected={(obj) => handleGarage(obj)}
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
      </section>

      <FormCheck
        formState={state}
        initialFormState={initSingleFamilyHome}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
