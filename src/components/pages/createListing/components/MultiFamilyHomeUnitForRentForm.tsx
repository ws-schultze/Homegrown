import React, { useState, useEffect } from "react";
import {
  TypeStr,
  TypeHeatingOption,
  TypeAddressValidationApi_Response,
  TypeVerifyActionName,
  TypeListingData,
  TypeMultiFamilyHomeUnit,
} from "../../../../index";
import {
  initMultiFamilyHomeUnit,
  initTypeBoolReqNull,
  initTypeStrReq,
} from "../../../../initialValues";
import Dropdown from "../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
} from "../../../../initialValues";
import {
  TypeCoolingOption,
  TypeWaterOption,
  TypePowerOption,
} from "../../../../index";
import InputTypeStr from "../../../shared/inputs/inputTypeStr/InputTypeStr";
import TwoBtnRow, { TypeTwoBtnRowState } from "./TwoBtnRow";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import PageBtns from "./PageBtns";
import { Header } from "./styledComponents";

interface Props {
  parent: TypeListingData;
  prevPage: () => void;
  nextPage: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: TypeListingData) => void;
}

export default function MultiFamilyHomeUnitForRentForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypeMultiFamilyHomeUnit>(
    initMultiFamilyHomeUnit
  );

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.multiFamilyHomeUnit) {
      setState(parent.multiFamilyHomeUnit);
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
          garageNumCars: initTypeStrReq,
          garageSqFt: initTypeStrReq,
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

  function handleInputTypeStr(object: TypeStr, fieldName: keyof typeof state) {
    setState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  function handleVerify(
    actionName: TypeVerifyActionName,
    obj: typeof state,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        multiFamilyHomeUnit: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        multiFamilyHomeUnit: obj,
        page: 6,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        multiFamilyHomeUnit: obj,
        savedPages: [1, 2, 3, 4, 5],
      });
    }
  }
  return (
    <>
      {state.saved === true ? (
        <div className="listing-form__section">
          <EditFormSection<typeof state> parent={state} emit={handleVerify} />
        </div>
      ) : null}

      <div className="listing-form__section">
        <Header>Multi-Family Home Unit</Header>

        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="yearBuilt"
            placeholder="Year Built"
            formatType="year"
            min={1}
            max={new Date().getFullYear()}
            parent={state.yearBuilt}
            emit={handleInputTypeStr}
          />
          <InputTypeStr<typeof state>
            size="md"
            fieldName="bedrooms"
            placeholder="Bedrooms"
            formatType="number"
            min={1}
            max={50}
            parent={state.bedrooms}
            emit={handleInputTypeStr}
          />
        </div>

        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="fullBathrooms"
            placeholder="Full Baths"
            formatType="number"
            min={0}
            max={100}
            parent={state.fullBathrooms}
            emit={handleInputTypeStr}
          />
          <InputTypeStr<typeof state>
            size="md"
            fieldName="halfBathrooms"
            placeholder="Half Baths"
            formatType="number"
            min={0}
            max={100}
            parent={state.halfBathrooms}
            emit={handleInputTypeStr}
          />
        </div>

        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="stories"
            placeholder="Stories"
            formatType="number"
            min={1}
            max={10}
            parent={state.stories}
            emit={handleInputTypeStr}
          />
          <InputTypeStr<typeof state>
            size="md"
            fieldName="squareFeet"
            placeholder="Square Feet"
            groupSeparators={[","]}
            formatType="comma-separated-no-decimal"
            min={100}
            parent={state.squareFeet}
            emit={handleInputTypeStr}
          />
        </div>

        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="parkingSpaces"
            placeholder="Parking Spaces"
            groupSeparators={[","]}
            formatType="comma-separated-no-decimal"
            min={0}
            max={10}
            parent={state.parkingSpaces}
            emit={handleInputTypeStr}
          />
          <InputTypeStr<typeof state>
            size="md"
            fieldName="unitsInBuilding"
            placeholder="Units In Building"
            formatType="number"
            min={1}
            max={20}
            parent={state.unitsInBuilding}
            emit={handleInputTypeStr}
          />
        </div>
        <Dropdown<TypeHeatingOption>
          placeHolder={"Select Heating Option(s)"}
          parent={state.heating.value}
          menuItems={heatingOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.heating.errorMsg}
          label="Heating"
          emit={(options) =>
            handleOptions<TypeHeatingOption>(options, "heating")
          }
        />
        <Dropdown<TypeCoolingOption>
          placeHolder={"Select Cooling Option(s)"}
          menuItems={coolingOptions}
          isMulti={true}
          isSearchable={false}
          parent={state.cooling.value}
          disabled={state.readOnly}
          errorMsg={state.cooling.errorMsg}
          label="Cooling"
          emit={(options) =>
            handleOptions<TypeCoolingOption>(options, "cooling")
          }
        />
        <Dropdown<TypeWaterOption>
          placeHolder={"Select Water Option(s)"}
          parent={state.water.value}
          menuItems={waterOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.water.errorMsg}
          label="Water"
          emit={(options) => handleOptions<TypeWaterOption>(options, "water")}
        />
        <Dropdown<TypePowerOption>
          placeHolder={"Select Power Option(s)"}
          parent={state.power.value}
          menuItems={powerOptions}
          isMulti={true}
          isSearchable={false}
          disabled={state.readOnly}
          errorMsg={state.power.errorMsg}
          label="Power"
          emit={(options) => handleOptions<TypePowerOption>(options, "power")}
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
              parent={state.garageAttached}
              emit={handleTwoBtnRow}
            />
            <div className="listing-form__flex-row">
              <InputTypeStr<typeof state>
                size="md"
                fieldName="garageNumCars"
                placeholder="Cars"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={1}
                parent={state.garageNumCars}
                emit={handleInputTypeStr}
              />
              <InputTypeStr<typeof state>
                size="md"
                fieldName="garageSqFt"
                placeholder="Square Feet"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={1}
                parent={state.garageSqFt}
                emit={handleInputTypeStr}
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
          label="Street Parking"
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
          label="Fenced Yard"
          parent={state.fencedYard}
          emit={handleTwoBtnRow}
        />
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="sharedYard"
          formLayer="1"
          label="Shared Yard"
          parent={state.sharedYard}
          emit={handleTwoBtnRow}
        />
      </div>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initMultiFamilyHomeUnit}
          emit={handleVerify}
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
    </>
  );
}
