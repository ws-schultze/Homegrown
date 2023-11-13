import { useState, useEffect } from "react";
import {
  Str,
  HeatingOption,
  AddressValidationApi_Response,
  VerifyActionName,
  ListingData,
  MultiFamilyHome,
  CoolingOption,
  WaterOption,
  PowerOption,
} from "../../../../../types/index";
import { initMultiFamilyHome } from "../../../../../initialValues";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../../initialValues";

import InputStr from "../../../../shared/inputs/inputStr/InputStr";
import TwoBtnRow, { TypeTwoBtnRowState } from "../../shared/TwoBtnRow";
import EditFormSection from "../../shared/EditFormSection";
import SaveSection from "../../shared/SaveSection";
import VerifySection from "../../shared/VerifySection";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { handleDropdown, handleFormVerification } from "../../utils/formUtils";
import { setListing, setSavedPages } from "../../createListingPageSlice";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YesNoBtns from "../../shared/YesNoBtns";
import FormCheck from "../../shared/FormCheck";

export default function MultiFamilyHomeForSaleForm(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.multiFamilyHome!;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("multiFamilyHome is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<MultiFamilyHome>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            multiFamilyHome: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  function handleDropdownWrapper<T>(options: T[], key: keyof typeof state) {
    handleDropdown(options, state, key, (obj) =>
      dispatch(
        setListing({
          ...listing,
          multiFamilyHome: obj,
        })
      )
    );
  }

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
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: {
                      ...state,
                      yearBuilt: obj,
                    },
                  })
                )
              }
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.totalUnits}
              placeholder="Units"
              min={1}
              max={20}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: { ...state, totalUnits: obj },
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
                    multiFamilyHome: { ...state, stories: obj },
                  })
                )
              }
            />
          </div>
          <div className={styles.md}>
            <CommaSeparatedWholeNumberInput
              state={state.squareFeet}
              placeholder="Sqft"
              min={100}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: {
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
              state={state.fullBathrooms}
              placeholder="Full baths"
              min={1}
              max={15}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: {
                      ...state,
                      fullBathrooms: obj,
                    },
                  })
                )
              }
            />
          </div>
          <div className={styles.md}>
            <NumberInput
              state={state.halfBathrooms}
              placeholder="Half baths"
              min={0}
              max={15}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: {
                      ...state,
                      halfBathrooms: obj,
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
              state={state.unitsWithGarageSpace}
              placeholder="Units with garage"
              min={0}
              max={5}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: { ...state, unitsWithGarageSpace: obj },
                  })
                )
              }
            />
          </div>

          <div className={styles.md}>
            <NumberInput
              state={state.bedrooms}
              placeholder="Bedrooms"
              min={1}
              max={20}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    multiFamilyHome: { ...state, bedrooms: obj },
                  })
                )
              }
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
          label="Street parking"
          state={state.streetParking}
          handleSelected={(obj) =>
            dispatch(
              setListing({
                ...listing,
                multiFamilyHome: {
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
                multiFamilyHome: {
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
        initialFormState={initMultiFamilyHome}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
