import React, { useState, useEffect } from "react";
import {
  Str,
  SingleFamilyHome,
  HeatingOption,
  AddressValidationApi_Response,
  VerifyActionName,
  ListingData,
  CoolingOption,
  WaterOption,
  PowerOption,
} from "../../../../types/index";
import { initStrReq, initTypeBoolReqNull } from "../../../../initialValues";
import Dropdown from "../../../shared/dropdown/Dropdown";
import {
  initSingleFamilyHome,
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../initialValues";

import InputStr from "../../../shared/inputs/inputStr/InputStr";
import TwoBtnRow, { TypeTwoBtnRowState } from "./TwoBtnRow";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import PageBtns from "./PageBtns-old";
import styles from "../styles.module.scss";

interface Props {
  parent: ListingData;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
}

export default function SingleFamilyHomeForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<SingleFamilyHome>(
    parent.singleFamilyHome!
  );

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.singleFamilyHome) {
      setState(parent.singleFamilyHome);
    } else {
      throw new Error("Single family home object not found in parent");
    }
  }, [parent]);

  /**
   * Given an array of options of type T, set them to state.
   * @param options T[] (e.g. {id: string, label: string}[] )
   * @param key keyof typeof state
   */
  function handleOptions<T>(options: T[], key: keyof typeof state) {
    if (options.length === 0) {
      setState((s) => ({
        ...s,
        [key]: {
          valid: false,
          value: options,
          errorMsg: "Required",
          required: true,
        },
      }));
    } else if (options.length > 0) {
      setState((s) => ({
        ...s,
        [key]: {
          valid: true,
          value: options,
          errorMsg: "",
          required: true,
        },
      }));
    } else {
      throw new Error("Something went wrong");
    }
  }

  function handleTwoBtnRow(
    fieldName: keyof typeof state,
    obj: TypeTwoBtnRowState
  ) {
    const value = obj.value;

    if (value !== true && value !== false) {
      throw new Error(`Must have a value of "true" or "false"`);
    }

    if (fieldName === "garage") {
      // Garage

      const { garageAttached, garageNumCars, garageSqFt, ...rest } = state;

      if (value === true) {
        // Has garage --> Add garage props to state

        setState((s) => ({
          ...s,
          garage: obj,
          garageAttached: initTypeBoolReqNull,
          garageNumCars: initStrReq,
          garageSqFt: initStrReq,
        }));
      } else if (value === false) {
        // No garage --> remove garage props from state

        setState({
          ...rest,
          garage: obj,
        });
      }
    } else {
      // Btns that do not add/subtract state props

      setState((s) => ({
        ...s,
        [fieldName]: obj,
      }));
    }
  }

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
    setState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  function handleVerify(
    actionName: VerifyActionName,
    obj: SingleFamilyHome,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        singleFamilyHome: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        singleFamilyHome: obj,
        currentPage: 6,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        singleFamilyHome: obj,
        savedPages: [1, 2, 3, 4, 5],
      });
    } else {
      throw new Error("Whoops");
    }
  }

  return (
    <form tabIndex={0}>
      {state.saved === true ? (
        <section>
          <EditFormSection parent={state} emit={handleVerify} />
        </section>
      ) : null}

      <section>
        <header>House Features</header>
        <div className={styles.flex_row}>
          <InputStr<typeof state>
            size="md"
            fieldName="yearBuilt"
            placeholder="Year Built"
            formatType="year"
            min={1}
            max={new Date().getFullYear()}
            parent={state.yearBuilt}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="squareFeet"
            placeholder="Square Feet"
            groupSeparators={[","]}
            formatType="comma-separated-no-decimal"
            min={100}
            parent={state.squareFeet}
            emit={handleInputStr}
          />
        </div>
        <div className={styles.flex_row}>
          <InputStr<typeof state>
            size="md"
            fieldName="stories"
            placeholder="Stories"
            formatType="number"
            min={1}
            max={10}
            parent={state.stories}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="acres"
            placeholder="Acres"
            groupSeparators={[",", "."]}
            formatType="comma-separated-with-decimal"
            min={0.01}
            parent={state.acres}
            emit={handleInputStr}
          />
        </div>
        <div className={styles.flex_row}>
          <InputStr<typeof state>
            size="sm"
            fieldName="bedrooms"
            placeholder="Bedrooms"
            formatType="number"
            min={1}
            max={50}
            parent={state.bedrooms}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="sm"
            fieldName="fullBathrooms"
            placeholder="Full Baths"
            formatType="number"
            min={0}
            max={100}
            parent={state.fullBathrooms}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="sm"
            fieldName="halfBathrooms"
            placeholder="Half Baths"
            formatType="number"
            min={0}
            max={100}
            parent={state.halfBathrooms}
            emit={handleInputStr}
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

        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="furnished"
          formLayer="1"
          label="Furnished"
          parent={state.furnished}
          emit={handleTwoBtnRow}
        />
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="garage"
          formLayer="1"
          label="Garage"
          parent={state.garage}
          emit={handleTwoBtnRow}
        />
        {state.garage.value === true &&
        state.garageAttached &&
        state.garageNumCars &&
        state.garageSqFt ? (
          <>
            <TwoBtnRow<typeof state>
              leftBtnText="Attached"
              leftBtnValue={true}
              rightBtnText="Detached"
              rightBtnValue={false}
              fieldName="garageAttached"
              formLayer="1"
              label=""
              parent={state.garageAttached}
              emit={handleTwoBtnRow}
            />
            <div className={styles.flex_row}>
              <InputStr<typeof state>
                size="md"
                fieldName="garageNumCars"
                placeholder="Cars"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={1}
                parent={state.garageNumCars}
                emit={handleInputStr}
              />
              <InputStr<typeof state>
                size="md"
                fieldName="garageSqFt"
                placeholder="Square Feet"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={1}
                parent={state.garageSqFt}
                emit={handleInputStr}
              />
            </div>
          </>
        ) : null}
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="streetParking"
          formLayer="1"
          label="Street parking"
          parent={state.streetParking}
          emit={handleTwoBtnRow}
        />
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="fencedYard"
          formLayer="1"
          label="Fenced yard"
          parent={state.fencedYard}
          emit={handleTwoBtnRow}
        />
      </section>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initSingleFamilyHome}
          emit={handleVerify}
          deleteListing={deleteListing}
        />
      ) : null}

      {state.beingVerified === true ? (
        <VerifySection parentName="House" parent={state} emit={handleVerify} />
      ) : null}

      {state.saved === true ? (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      ) : (
        <PageBtns
          deleteListing={deleteListing}
          prevPage={prevPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
        />
      )}
    </form>
  );
}
