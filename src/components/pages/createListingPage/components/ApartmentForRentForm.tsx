import { useState, useEffect } from "react";
import {
  Str,
  HeatingOption,
  AddressValidationApi_Response,
  VerifyActionName,
  ListingData,
  Apartment,
  CoolingOption,
  WaterOption,
  PowerOption,
} from "../../../../types/index";
import Dropdown from "../../../shared/dropdown/Dropdown";
import {
  heatingOptions,
  coolingOptions,
  waterOptions,
  powerOptions,
  initStrReq,
  initApartment,
} from "../../../../initialValues";
import InputStr from "../../../shared/inputs/inputStr/InputStr";
import TwoBtnRow, { TypeTwoBtnRowState } from "./TwoBtnRow";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import VerifySection from "./VerifySection";
import PageBtns from "./PageBtns";
import { Header } from "./styledComponents";
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

export default function ApartmentForRentForm({
  parent,
  nextPage,
  prevPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<Apartment>(initApartment);

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  useEffect(() => {
    if (parent.apartment) {
      setState(parent.apartment);
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

    if (fieldName === "assignedParking") {
      // Garage

      const { numAssignedSpaces, numAssignedSpacesWithCover, ...rest } = state;

      if (value === true) {
        // Has assigned parking --> Add assigned parking props to state

        setState((s) => ({
          ...s,
          assignedParking: obj,
          numAssignedSpaces: initStrReq,
          numAssignedSpacesWithCover: initStrReq,
        }));
      } else if (value === false) {
        // No assigned parking --> remove assigned parking props from state

        setState({
          ...rest,
          assignedParking: obj,
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
    obj: typeof state,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        apartment: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      emit({
        ...parent,
        apartment: obj,
        page: 6,
        savedPages: [1, 2, 3, 4, 5, 6],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        apartment: obj,
        savedPages: [1, 2, 3, 4, 5],
      });
    } else {
      throw new Error("Whoops");
    }
  }
  return (
    <>
      {state.saved === true ? (
        <div className={styles.section}>
          <EditFormSection<typeof state> parent={state} emit={handleVerify} />
        </div>
      ) : null}

      <div className={styles.section}>
        <Header>Apartment Features</Header>
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
            fieldName="floorNumber"
            placeholder="Floor"
            formatType="number"
            min={1}
            max={100}
            parent={state.floorNumber}
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

        <div className={styles.flex_row}>
          <InputStr<typeof state>
            size="md"
            fieldName="fullBathrooms"
            placeholder="Full Baths"
            formatType="number"
            min={1}
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
          fieldName="stairAccess"
          formLayer="1"
          label="Stair Access"
          parent={state.stairAccess}
          emit={handleTwoBtnRow}
        />
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="elevatorAccess"
          formLayer="1"
          label="Elevator Access"
          parent={state.elevatorAccess}
          emit={handleTwoBtnRow}
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
          fieldName="assignedParking"
          formLayer="1"
          label="Assigned Parking"
          parent={state.assignedParking}
          emit={handleTwoBtnRow}
        />
        {state.assignedParking.value === true &&
        state.numAssignedSpaces &&
        state.numAssignedSpacesWithCover ? (
          <>
            <div className={styles.flex_row}>
              <InputStr<typeof state>
                size="md"
                fieldName="numAssignedSpaces"
                placeholder="Spaces"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={1}
                parent={state.numAssignedSpaces}
                emit={handleInputStr}
              />
              <InputStr<typeof state>
                size="md"
                fieldName="numAssignedSpacesWithCover"
                placeholder="Covered Spaces"
                groupSeparators={[","]}
                formatType="comma-separated-no-decimal"
                min={0}
                parent={state.numAssignedSpacesWithCover}
                emit={handleInputStr}
              />
            </div>
          </>
        ) : null}

        {/* Unassigned Parking */}
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="unassignedParkingAvailable"
          formLayer="1"
          label="Unassigned Parking Available"
          parent={state.unassignedParkingAvailable}
          emit={handleTwoBtnRow}
        />

        {/* Street Parking */}
        <TwoBtnRow<typeof state>
          leftBtnText="Yes"
          leftBtnValue={true}
          rightBtnText="No"
          rightBtnValue={false}
          fieldName="streetParking"
          formLayer="1"
          label="Street Parking Available"
          parent={state.streetParking}
          emit={handleTwoBtnRow}
        />

        {/* Fenced Yard */}
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
          parentInitialState={initApartment}
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
