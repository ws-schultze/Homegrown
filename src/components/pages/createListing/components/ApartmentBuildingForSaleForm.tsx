import React, { useState, useEffect } from "react";
import {
  TypeStr,
  TypeHeatingOption,
  TypeAddressValidationApi_Response,
  TypeVerifyActionName,
  TypeListingData,
  TypeApartmentBuilding,
} from "../../../../index";
import { initApartmentBuilding } from "../../../../initialValues";
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
// import { TypeTwoBtnRowState } from "./TwoBtnRow";
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

export default function ApartmentBuildingForSaleForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypeApartmentBuilding>(
    initApartmentBuilding
  );

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.apartmentBuilding) {
      setState(parent.apartmentBuilding);
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

  // function handleTwoBtnRow(fieldName: keyof typeof state, obj: TypeTwoBtnRowState) {
  //   const value = obj.value;

  //   if (value !== true && value !== false) {
  //     throw new Error(`Must have a value of "true" or "false"`);
  //   }

  //   setState((s) => ({
  //     ...s,
  //     [fieldName]: obj,
  //   }));
  // }

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
        apartmentBuilding: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        apartmentBuilding: obj,
        page: 6,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        apartmentBuilding: obj,
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
        <Header>Apartment Building Features</Header>

        <div className="listing-form__flex-row">
          <InputTypeStr<typeof state>
            size="md"
            fieldName="totalUnits"
            placeholder="Units"
            formatType="number"
            min={1}
            max={20}
            parent={state.totalUnits}
            emit={handleInputTypeStr}
          />
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
            fieldName="acres"
            placeholder="Lot Size (Acres)"
            groupSeparators={[","]}
            formatType="comma-separated-with-decimal"
            min={0.01}
            parent={state.acres}
            emit={handleInputTypeStr}
          />
        </div>

        <div className="listing-form__flex-row">
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

        {/* End features */}
      </div>

      {/* Save */}
      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initApartmentBuilding}
          emit={handleVerify}
        />
      ) : null}

      {/* Verify */}
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
