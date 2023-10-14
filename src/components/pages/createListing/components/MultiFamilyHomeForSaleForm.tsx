import React, { useState, useEffect } from "react";
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
} from "../../../../types/index";
import { initMultiFamilyHome } from "../../../../initialValues";
import Dropdown from "../../../shared/dropdown/Dropdown";
import {
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
import PageBtns from "./PageBtns";
import { Header } from "./styledComponents";

interface Props {
  parent: ListingData;
  prevPage: () => void;
  nextPage: () => void;
  deleteListing: () => void;
  toPageNumber?: (number: number) => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (obj: ListingData) => void;
}

export default function MultiFamilyHomeForSaleForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<MultiFamilyHome>(initMultiFamilyHome);

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.multiFamilyHome) {
      setState(parent.multiFamilyHome);
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

    setState((s) => ({
      ...s,
      [fieldName]: obj,
    }));
  }

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
    setState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  function handleVerify(
    actionName: VerifyActionName,
    obj: typeof state,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        multiFamilyHome: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        multiFamilyHome: obj,
        page: 6,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        multiFamilyHome: obj,
        savedPages: [1, 2, 3, 4, 5],
      });
    } else {
      throw new Error("Whoops");
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
        <Header>Multi-Family Home Features</Header>

        <div className="listing-form__flex-row">
          <InputStr<typeof state>
            size="md"
            fieldName="totalUnits"
            placeholder="Units"
            formatType="number"
            min={1}
            max={20}
            parent={state.totalUnits}
            emit={handleInputStr}
          />
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
        </div>

        <div className="listing-form__flex-row">
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
            fieldName="squareFeet"
            placeholder="Square Feet"
            groupSeparators={[","]}
            formatType="comma-separated-no-decimal"
            min={100}
            parent={state.squareFeet}
            emit={handleInputStr}
          />
        </div>

        <div className="listing-form__flex-row">
          <InputStr<typeof state>
            size="md"
            fieldName="unitsWithGarageSpace"
            placeholder="Units With Garage"
            groupSeparators={[","]}
            formatType="comma-separated-no-decimal"
            min={0}
            parent={state.unitsWithGarageSpace}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="bedrooms"
            placeholder="Bedrooms"
            formatType="number"
            min={1}
            max={50}
            parent={state.bedrooms}
            emit={handleInputStr}
          />
        </div>

        <div className="listing-form__flex-row">
          <InputStr<typeof state>
            size="md"
            fieldName="fullBathrooms"
            placeholder="Full Baths"
            formatType="number"
            min={0}
            max={100}
            parent={state.fullBathrooms}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
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
          label="Heating"
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
          label="Cooling"
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
          label="Water"
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
          label="Power"
          emit={(options) => handleOptions<PowerOption>(options, "power")}
        />

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

        {/* End Unit Features */}
      </div>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initMultiFamilyHome}
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
