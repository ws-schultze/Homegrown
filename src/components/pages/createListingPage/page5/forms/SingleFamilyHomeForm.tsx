import {
  SingleFamilyHome,
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
import { handleFormVerification } from "../../utils/formUtils";
import { setListing, setSavedPages } from "../../createListingPageSlice";
import FormCheck from "../../shared/FormCheck";
import YesNoBtns from "../../shared/YesNoBtns";
import CommaSeparatedWholeNumber from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";

export default function SingleFamilyHomeForm(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.singleFamilyHome!;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("singleFamilyHome is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<SingleFamilyHome>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            singleFamilyHome: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  /**
   * Given an array of options of type T, set them to state.
   * @param options T[] (e.g. {id: string, label: string}[] )
   * @param key keyof typeof state
   */
  function handleOptions<T>(options: T[], key: keyof typeof state) {
    if (options.length === 0) {
      dispatch(
        setListing({
          ...listing,
          singleFamilyHome: {
            ...state,
            [key]: {
              valid: false,
              value: options,
              errorMsg: "Required",
              required: true,
            },
          },
        })
      );
    } else if (options.length > 0) {
      dispatch(
        setListing({
          ...listing,
          singleFamilyHome: {
            ...state,
            [key]: {
              valid: true,
              value: options,
              errorMsg: "",
              required: true,
            },
          },
        })
      );
    } else {
      throw new Error("Something went wrong");
    }
  }

  function handleGarage(obj: typeof state.garage) {
    const { garageAttached, garageNumCars, garageSqFt, ...rest } = state;

    // Has garage --> Add garage props to state
    if (obj.value === true) {
      dispatch(
        setListing({
          ...listing,
          singleFamilyHome: {
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
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      yearBuilt: obj,
                    },
                  })
                )
              }
            />
          </div>

          <div className={styles.md}>
            <CommaSeparatedWholeNumber
              state={state.squareFeet}
              placeholder="Sqft"
              min={100}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      squareFeet: obj,
                    },
                  })
                )
              }
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
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: { ...state, stories: obj },
                  })
                )
              }
            />
          </div>

          <div className={styles.md}>
            <CommaSeparatedWithDecimalInput
              placeholder="Acres"
              state={state.acres}
              min={0}
              max={1000000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      acres: obj,
                    },
                  })
                )
              }
            />
          </div>
        </div>
        <div className={styles.flex_row}>
          <div className={styles.md}>
            <CommaSeparatedWholeNumber
              state={state.bedrooms}
              placeholder="Bedrooms"
              min={1}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      bedrooms: obj,
                    },
                  })
                )
              }
            />
          </div>

          <div className={styles.md}>
            <CommaSeparatedWholeNumber
              state={state.fullBathrooms}
              placeholder="Full baths"
              min={1}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      fullBathrooms: obj,
                    },
                  })
                )
              }
            />
          </div>
        </div>

        <div>
          <CommaSeparatedWholeNumber
            state={state.halfBathrooms}
            placeholder="Half baths"
            min={0}
            handleInput={(obj) =>
              dispatch(
                setListing({
                  ...listing,
                  singleFamilyHome: {
                    ...state,
                    halfBathrooms: obj,
                  },
                })
              )
            }
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
          emit={(options) => handleOptions<HeatingOption>(options, "heating")}
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
          emit={(options) => handleOptions<CoolingOption>(options, "cooling")}
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
          emit={(options) => handleOptions<WaterOption>(options, "water")}
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
          emit={(options) => handleOptions<PowerOption>(options, "power")}
        />

        <YesNoBtns
          state={state.furnished}
          label="Furnished"
          handleSelected={(obj: TypeBool) =>
            dispatch(
              setListing({
                ...listing,
                singleFamilyHome: {
                  ...state,
                  furnished: obj,
                },
              })
            )
          }
        />

        <YesNoBtns
          state={state.garage}
          label="Garage"
          handleSelected={handleGarage}
        />

        {state.garage.value === true &&
        state.garageAttached &&
        state.garageNumCars &&
        state.garageSqFt ? (
          <>
            <YesNoBtns
              state={state.garageAttached}
              leftBtnText="Attached"
              rightBtnText="Detached"
              handleSelected={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    singleFamilyHome: {
                      ...state,
                      garageAttached: obj,
                    },
                  })
                )
              }
            />

            <div className={styles.flex_row}>
              <div className={styles.md}>
                <CommaSeparatedWholeNumber
                  state={state.garageNumCars}
                  placeholder="Cars"
                  min={1}
                  handleInput={(obj) =>
                    dispatch(
                      setListing({
                        ...listing,
                        singleFamilyHome: {
                          ...state,
                          garageNumCars: obj,
                        },
                      })
                    )
                  }
                />
              </div>
              <div className={styles.md}>
                <CommaSeparatedWholeNumber
                  state={state.garageSqFt}
                  placeholder="Sqft"
                  min={100}
                  handleInput={(obj) =>
                    dispatch(
                      setListing({
                        ...listing,
                        singleFamilyHome: {
                          ...state,
                          garageSqFt: obj,
                        },
                      })
                    )
                  }
                />
              </div>
            </div>
          </>
        ) : null}

        <YesNoBtns
          label="Street parking"
          state={state.streetParking}
          handleSelected={(obj) =>
            dispatch(
              setListing({
                ...listing,
                singleFamilyHome: {
                  ...state,
                  streetParking: obj,
                },
              })
            )
          }
        />
        <YesNoBtns
          label="Fenced yard"
          state={state.fencedYard}
          handleSelected={(obj) =>
            dispatch(
              setListing({
                ...listing,
                singleFamilyHome: {
                  ...state,
                  fencedYard: obj,
                },
              })
            )
          }
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
