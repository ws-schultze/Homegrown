import { useState, useEffect } from "react";
import {
  Str,
  HeatingOption,
  AddressValidationApi_Response,
  VerifyActionName,
  ListingData,
  ApartmentBuilding,
  CoolingOption,
  WaterOption,
  PowerOption,
} from "../../../../../types/index";
import {} from "../../../../../initialValues";
import Dropdown from "../../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initApartmentBuilding,
} from "../../../../../initialValues";
import InputStr from "../../../../shared/inputs/inputStr/InputStr";
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
import CommaSeparatedWholeNumberInput from "../../../../shared/inputs/commaSeparatedWholeNumberInput/CommaSeparatedWholeNumberInput";
import YearInput from "../../../../shared/inputs/yearInput/YearInput";
import NumberInput from "../../../../shared/inputs/numberInput/NumberInput";
import CommaSeparatedWithDecimalInput from "../../../../shared/inputs/commaSeparatedNumberWithDecimalInput/CommaSeparatedNumberWithDecimalInput";
import FormCheck from "../../shared/FormCheck";

export default function ApartmentBuildingForSaleForm(props: FormProps) {
  const pageState = useAppSelector((s) => s.createListingPage);
  const listing = pageState.listing;
  const state = pageState.listing.apartmentBuilding!;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!state) throw new Error("state is undefined");

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: typeof state
  ) {
    handleFormVerification<ApartmentBuilding>({
      createListingPageState: pageState,
      actionName,
      obj,
      thisPageNum: props.thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...pageState.listing,
            apartmentBuilding: obj,
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
          apartmentBuilding: obj,
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
        <header>Apartment Building Features</header>

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
                    apartmentBuilding: {
                      ...state,
                      yearBuilt: obj,
                    },
                  })
                )
              }
            />
          </div>
          <div className={styles.md}>
            <CommaSeparatedWholeNumberInput
              state={state.totalUnits}
              placeholder="Units"
              min={5}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
                      ...state,
                      totalUnits: obj,
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
              max={50}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: { ...state, stories: obj },
                  })
                )
              }
            />
          </div>

          <div className={styles.md}>
            <CommaSeparatedWholeNumberInput
              state={state.squareFeet}
              placeholder="Sqft"
              min={2000}
              max={10000000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
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
            <CommaSeparatedWithDecimalInput
              placeholder="Acres"
              state={state.acres}
              min={0}
              max={1000000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
                      ...state,
                      acres: obj,
                    },
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
              max={2000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
                      ...state,
                      bedrooms: obj,
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
              max={1000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
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
              max={1000}
              handleInput={(obj) =>
                dispatch(
                  setListing({
                    ...listing,
                    apartmentBuilding: {
                      ...state,
                      halfBathrooms: obj,
                    },
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
      </section>

      <FormCheck
        formState={state}
        initialFormState={initApartmentBuilding}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
