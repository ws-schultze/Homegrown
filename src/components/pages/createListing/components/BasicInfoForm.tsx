import React, { useEffect, useState } from "react";
import TwoBtnRow from "./TwoBtnRow";
import {
  TypeAddressValidationApi_Response,
  TypeBool,
  TypeCondo,
  TypeForRentBy,
  TypeForSaleBy,
  TypeForSaleOrRent,
  TypeLand,
  TypeManufacturedHome,
  TypeMultiFamilyHome,
  TypeSingleFamilyHome,
  TypeTownhouse,
  ListingTypeValue,
  TypeListingData,
  TypeBasicInfo,
  TypeVerifyActionName,
  TypeStr,
  TypeApartmentBuilding,
  TypeApartment,
} from "../../../..";
import {
  initAgent,
  initApartment,
  initApartmentBuilding,
  initBasicInfo,
  initCompany,
  initCondo,
  initForRentBy,
  initForSaleBy,
  initLand,
  initManufacturedHome,
  initMultiFamilyHome,
  initMultiFamilyHomeUnit,
  initOwner,
  initPrivateOwner,
  initSingleFamilyHome,
  initTownhouse,
  initTypeStrOpt,
  listingKindValuesForRent,
  listingKindValuesForSale,
} from "../../../../initialValues";
import compareObjects from "../../../utils/compareObjects";
import Dropdown from "../../../shared/dropdown/Dropdown";
import VerifySection from "./VerifySection";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import PageBtns from "./PageBtns";
import InputTypeStr from "../../../shared/inputs/inputTypeStr/InputTypeStr";
import { Header } from "./styledComponents";

interface Props {
  parent: TypeListingData;
  nextPage: () => void;
  prevPage?: () => void;
  toPageNumber?: (number: number) => void;
  deleteListing: () => void;
  pageNumbers?: number[];
  currentPage?: number;
  emit: (
    obj: TypeListingData,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) => void;
}

export default function BasicInfoForm({
  parent,
  prevPage,
  nextPage,
  toPageNumber,
  deleteListing,
  pageNumbers,
  currentPage,
  emit,
}: Props) {
  const [state, setState] = useState<TypeBasicInfo>(parent.basicInfo);

  useEffect(() => {
    setState(parent.basicInfo);
  }, [parent]);

  function handleTwoBtnRow(
    fieldName: keyof typeof state,
    obj: TypeBool | TypeForSaleOrRent | TypeForRentBy | TypeForSaleBy
  ) {
    const object = obj as TypeForSaleOrRent | TypeForRentBy | TypeForSaleBy;
    switch (object.value?.id) {
      case "for-sale":
        console.log("SALE");
        forSale();
        break;
      case "for-rent":
        forRent();
        break;
      case "agent":
        forSaleByAgent();
        break;
      case "owner":
        forSaleByOwner();
        break;
      case "company":
        forRentByCompany();
        break;
      case "private-owner":
        forRentByPrivateOwner();
        break;

      default:
        throw new Error("Escaped");
    }
  }

  function forSale(): void {
    const { company, privateOwner, ...p } = parent;
    const { forRentBy, ...rest } = state;

    // Create new form state object
    const s: TypeListingData = {
      ...p,
      basicInfo: {
        ...rest,
        forSaleOrRent: {
          ...rest.forSaleOrRent,
          value: { id: "for-sale", label: "For Sale" },
          valid: true,
          errorMsg: "",
        },
        forSaleBy: initForSaleBy,
      },
    };

    // Company is not empty --> prompt user, erase company and forRentBy
    if (
      company &&
      compareObjects(company, initCompany) === false &&
      window.confirm(
        "Selecting FOR SALE will delete the rental COMPANY information you have already entered. Do you wish to proceed?"
      )
    ) {
      setState(s.basicInfo);
      emit(s);

      // Private owner is not empty --> prompt user, erase private owner and forRentBy
    } else if (
      privateOwner &&
      compareObjects(privateOwner, initPrivateOwner) === false &&
      window.confirm(
        "Selecting FOR SALE will delete the rental's PRIVATE OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      setState(s.basicInfo);
      emit(s);

      // Company and private owner are either both undefined and/or empty
    } else if (
      (!company ||
        (company && compareObjects(company, initCompany) === true)) &&
      (!privateOwner ||
        (privateOwner &&
          compareObjects(privateOwner, initPrivateOwner) === true))
    ) {
      setState(s.basicInfo);
      emit(s);
    } else {
      throw new Error("Escaped");
    }
  }

  function forRent(): void {
    const { agent, owner, ...p } = parent;
    const { forSaleBy, ...rest } = state;

    const s: TypeListingData = {
      ...p,
      basicInfo: {
        ...rest,
        forSaleOrRent: {
          ...rest.forSaleOrRent,
          value: { id: "for-rent", label: "For Rent" },
          valid: true,
          errorMsg: "",
        },
        forRentBy: initForRentBy,
      },
    };

    // Sale's agent is not empty --> prompt user, erase agent
    if (
      agent &&
      compareObjects(agent, initAgent) === false &&
      window.confirm(
        "Selecting FOR RENT will delete the AGENT information you have already entered. Do you wish to proceed?"
      )
    ) {
      setState(s.basicInfo);
      emit(s);

      // Sale's owner is not empty --> prompt user, erase owner
    } else if (
      owner &&
      compareObjects(owner, initOwner) === false &&
      window.confirm(
        "Selecting FOR RENT will delete the sales' OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      setState(s.basicInfo);
      emit(s);

      //Sale's agent and owner are either both undefined and/or empty
    } else if (
      (!agent || (agent && compareObjects(agent, initAgent) === true)) &&
      (!owner || (owner && compareObjects(owner, initOwner) === true))
    ) {
      setState(s.basicInfo);
      emit(s);
    } else {
      throw new Error("Escaped");
    }
  }

  /**
   * Handle the selection of For Sale by "Agent"
   * There are two conditions to consider here:
   * 1) Select "Agent" initially --> no "Owner" cleanup needed.
   * 2) Select "Agent" after "Owner" has been selected and information has been filled out --> "Owner" cleanup needed.
   */
  function forSaleByAgent(): void {
    if (state.forSaleBy !== undefined) {
      const { owner, company, privateOwner, ...o } = parent;

      const s: TypeListingData = {
        ...o,
        basicInfo: {
          ...state,
          forSaleBy: {
            ...state.forSaleBy,
            value: { id: "agent", label: "Agent" },
            valid: true,
            errorMsg: "",
          },
        },
        agent: initAgent,
      };

      if (
        owner &&
        compareObjects(owner, initOwner) === false &&
        window.confirm(
          "Choosing AGENT will erase all OWNER data, are you sure you want to proceed?"
        )
      ) {
        setState(s.basicInfo);
        emit(s);
      } else if (!owner || compareObjects(owner, initOwner) === true) {
        setState(s.basicInfo);
        emit(s);
      } else {
        throw new Error("Escaped");
      }
    } else {
      throw new Error("Escaped");
    }
  }

  /**
   * Handle the selection of For Sale by "Owner"
   * There are two conditions to consider here:
   * 1) Select "Owner" initially --> no "Agent" cleanup needed.
   * 2) Select "Owner" after "Agent" has been selected and information has been filled out --> "Agent" cleanup needed.
   */
  function forSaleByOwner(): void {
    // If for sale by owner, make sure agent is not in state

    if (state.forSaleBy !== undefined) {
      const { agent, company, privateOwner, ...o } = parent;
      const s: TypeListingData = {
        ...o,
        basicInfo: {
          ...state,
          forSaleBy: {
            ...state.forSaleBy,
            value: { id: "owner", label: "Owner" },

            valid: true,
            errorMsg: "",
          },
        },
        owner: initOwner,
      };

      if (
        agent &&
        compareObjects(agent, initAgent) === false &&
        window.confirm(
          "Choosing OWNER will erase all AGENT data, are you sure you want to proceed?"
        ) === true
      ) {
        setState(s.basicInfo);
        emit(s);
      } else if (!agent || compareObjects(agent, initAgent) === true) {
        setState(s.basicInfo);
        emit(s);
      } else {
        throw new Error("Escaped");
      }
    } else {
      throw new Error("Escaped");
    }
  }

  /**
   * Handle the selection of For Rent by "Company"
   * There are two conditions to consider here:
   * 1) Select "Company" initially --> no "Private Party" cleanup needed.
   * 2) Select "Company" after "Private Party" has been selected and information has been filled out --> cleanup "Private Party"
   */
  function forRentByCompany(): void {
    if (state.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, privateOwner, ...o } = parent;

      const s: TypeListingData = {
        ...o,
        basicInfo: {
          ...state,
          forRentBy: {
            ...state.forRentBy,
            value: { id: "company", label: "Company" },

            valid: true,
            errorMsg: "",
          },
        },
        company: initCompany,
      };

      if (
        privateOwner &&
        compareObjects(privateOwner, initPrivateOwner) === false &&
        window.confirm(
          "Choosing COMPANY will erase all PRIVATE OWNER data, are you sure you want to proceed?"
        )
      ) {
        setState(s.basicInfo);
        emit(s);
      } else if (
        !privateOwner ||
        compareObjects(privateOwner, initPrivateOwner) === true
      ) {
        setState(s.basicInfo);
        emit(s);
      } else {
        throw new Error("Escaped");
      }
    } else {
      throw new Error("Escaped");
    }
  }

  /**
   * Handle the selection of For Rent by "Private Party"
   * There are two conditions to consider here:
   * 1) Select "Private Party" initially --> no "Company" cleanup needed.
   * 2) Select "Private Party" after "Company" has been selected and information has been filled out --> cleanup "Company"
   */
  function forRentByPrivateOwner(): void {
    if (state.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, company, ...o } = parent;

      const s: TypeListingData = {
        ...o,
        basicInfo: {
          ...state,
          forRentBy: {
            ...state.forRentBy,
            value: { id: "private-owner", label: "Private Owner" },
            valid: true,
            errorMsg: "",
          },
        },
        privateOwner: initPrivateOwner,
      };

      if (
        company &&
        compareObjects(company, initCompany) === false &&
        window.confirm(
          "Choosing PRIVATE OWNER will erase all COMPANY data, are you sure you want to proceed?"
        )
      ) {
        setState(s.basicInfo);
        emit(s);
      } else if (!company || compareObjects(company, initCompany) === true) {
        setState(s.basicInfo);
        emit(s);
      } else {
        throw new Error("Escaped");
      }
    } else {
      throw new Error("Escaped");
    }
  }

  /**
   * Set the home type to state
   * @param options List of home type items: [{id: multi-family-home, label: Multi-Family Home}, ...]
   */
  function handleListingKind(options: ListingTypeValue[]): void {
    if (options && options.length === 1 && options[0] !== null) {
      let init:
        | TypeSingleFamilyHome
        | TypeMultiFamilyHome
        | TypeCondo
        | TypeTownhouse
        | TypeApartmentBuilding
        | TypeApartment
        | TypeManufacturedHome
        | TypeLand = initLand;

      const id = options[0].id;

      switch (id) {
        case null:
          break;
        case "single-family-home":
          init = initSingleFamilyHome;
          break;
        case "multi-family-home":
          init = initMultiFamilyHome;
          break;
        case "multi-family-home-unit":
          init = initMultiFamilyHomeUnit;
          break;
        case "apartment-building":
          init = initApartmentBuilding;
          break;
        case "apartment":
          init = initApartment;
          break;
        case "condo":
          init = initCondo;
          break;
        case "townhouse":
          init = initTownhouse;
          break;
        case "manufactured-home":
          init = initManufacturedHome;
          break;
        case "land":
          init = initLand;
          break;

        default:
          // throw new Error("Escaped");
          console.log("Fell through switch stmt here...");
      }

      const kind = options[0];

      const {
        singleFamilyHome,
        multiFamilyHome,
        multiFamilyHomeUnit,
        apartment,
        apartmentBuilding,
        townhouse,
        condo,
        manufacturedHome,
        land,
        ...o
      } = parent;

      const s: TypeListingData = {
        ...o,
        basicInfo: {
          ...state,
          listingKind: {
            ...state.listingKind,
            value: kind,
            valid: true,
            errorMsg: "",
          },
        },
        [kind.name]: init,
      };

      setState(s.basicInfo);
      emit(s);

      // Either no options found or more than one found
    } else {
      throw new Error(
        "A listing must have exactly one home type! Make sure that isMulti=false on Dropdown"
      );
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
    obj: TypeBasicInfo,
    addressValidationApiResponse?: TypeAddressValidationApi_Response
  ) {
    if (actionName === "save" || actionName === "edit") {
      emit({
        ...parent,
        basicInfo: obj,
      });
    } else if (actionName === "verify" && obj.saved === true) {
      // Cleanup undefined parent objects
      let key: keyof typeof parent;
      for (key in parent) {
        if (parent[key] === undefined) {
          delete parent[key];
        }
      }

      emit({
        ...parent,
        basicInfo: obj,
        page: 3,
        savedPages: [1, 2, 3],
      });
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      emit({
        ...parent,
        basicInfo: obj,
        savedPages: [1, 2],
      });
    } else {
      throw new Error("Whoops");
    }
  }

  return (
    <>
      {/* Edit */}
      {state.saved === true ? (
        <div className="listing-form__section">
          <EditFormSection<typeof state> parent={state} emit={handleVerify} />
        </div>
      ) : null}

      <div className="listing-form__section">
        <Header>Basic Information</Header>
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="description"
          placeholder="Listing Description"
          formatType="description"
          min={20}
          max={120}
          parent={state.description}
          emit={handleInputTypeStr}
        />
        <TwoBtnRow<typeof state>
          leftBtnText="For Sale"
          leftBtnValue={{ id: "for-sale", label: "For Sale" }}
          rightBtnText="For Rent"
          rightBtnValue={{ id: "for-rent", label: "For Rent" }}
          fieldName="forSaleOrRent"
          formLayer="1"
          label="Sell/Rent"
          parent={state.forSaleOrRent}
          emit={handleTwoBtnRow}
        />
        {state.forSaleBy !== undefined ? (
          <div>
            <TwoBtnRow<typeof state>
              leftBtnText="Agent"
              leftBtnValue={{ id: "agent", label: "Agent" }}
              rightBtnText="Owner"
              rightBtnValue={{ id: "owner", label: "Owner" }}
              fieldName="forSaleBy"
              formLayer="1"
              label="Listed by"
              parent={state.forSaleBy}
              emit={handleTwoBtnRow}
            />
          </div>
        ) : null}
        {state.forRentBy !== undefined ? (
          <TwoBtnRow<typeof state>
            leftBtnText="Company"
            leftBtnValue={{ id: "company", label: "Company" }}
            rightBtnText="Private Owner"
            rightBtnValue={{ id: "private-owner", label: "Private Owner" }}
            fieldName="forRentBy"
            formLayer="1"
            label="Listed by"
            parent={state.forRentBy}
            emit={handleTwoBtnRow}
          />
        ) : null}

        {state.forSaleOrRent.value?.id === "for-sale" ? (
          <Dropdown<ListingTypeValue>
            placeHolder={"What are you selling?"}
            menuItems={listingKindValuesForSale}
            isMulti={false}
            isSearchable={false}
            parent={[state.listingKind.value]}
            disabled={state.listingKind.readOnly}
            errorMsg={state.listingKind.errorMsg}
            label={"Listing Kind"}
            emit={handleListingKind}
          />
        ) : null}

        {state.forSaleOrRent.value?.id === "for-rent" ? (
          <Dropdown<ListingTypeValue>
            placeHolder={"What are you renting?"}
            menuItems={listingKindValuesForRent}
            isMulti={false}
            isSearchable={false}
            parent={[state.listingKind.value]}
            errorMsg={state.listingKind.errorMsg}
            label={"Listing Kind"}
            disabled={state.listingKind.readOnly}
            emit={handleListingKind}
          />
        ) : null}

        <InputTypeStr<typeof state>
          size="lg"
          fieldName="price"
          placeholder={
            state.forSaleOrRent && state.forSaleOrRent.value?.id === "for-sale"
              ? "Price"
              : state.forSaleOrRent &&
                state.forSaleOrRent.value?.id === "for-rent"
              ? "Price/month"
              : "Price"
          }
          groupSeparators={[","]}
          prefix="$"
          formatType="USD-no-decimal"
          min={1}
          parent={state.price}
          emit={handleInputTypeStr}
        />
        <InputTypeStr<typeof state>
          size="lg"
          fieldName="priceChange"
          groupSeparators={[","]}
          formatType="USD-no-decimal"
          prefix="$"
          min={1}
          isPriceChange={true}
          placeholder={
            state.forSaleOrRent && state.forSaleOrRent.value?.id === "for-sale"
              ? "New Price*"
              : state.forSaleOrRent &&
                state.forSaleOrRent.value?.id === "for-rent"
              ? "New Price/Month*"
              : "New Price*"
          }
          originalPrice={state.price.number || 0}
          parent={state.priceChange || initTypeStrOpt}
          emit={handleInputTypeStr}
        />

        {/* End Basic Info */}
      </div>

      {state.saved === false && state.beingVerified === false ? (
        <SaveSection<typeof state>
          needsAddressValidation={false}
          parent={state}
          parentInitialState={initBasicInfo}
          emit={handleVerify}
        />
      ) : null}

      {state.beingVerified === true ? (
        <VerifySection<typeof state>
          parentName="Basic Information"
          parent={state}
          emit={handleVerify}
        />
      ) : null}

      {state.saved === true ? (
        <PageBtns
          prevPage={prevPage}
          nextPage={nextPage}
          toPageNumber={toPageNumber}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          deleteListing={deleteListing}
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
