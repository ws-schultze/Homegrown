import React, { useEffect, useRef, useState } from "react";
import TwoBtnRow from "./TwoBtnRow";
import {
  AddressValidationApi_Response,
  TypeBool,
  Condo,
  ForRentBy,
  ForSaleBy,
  ForSaleOrRent,
  Land,
  ManufacturedHome,
  MultiFamilyHome,
  SingleFamilyHome,
  Townhouse,
  ListingKindValue,
  ListingData,
  BasicInfo,
  VerifyActionName,
  Str,
  ApartmentBuilding,
  Apartment,
} from "../../../../types/index";
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
  listingKindValuesForRent,
  listingKindValuesForSale,
} from "../../../../initialValues";
import compareObjects from "../../../utils/compareObjects";
import Dropdown from "../../../shared/dropdown/Dropdown";
import VerifySection from "./VerifySection";
import EditFormSection from "./EditFormSection";
import SaveSection from "./SaveSection";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import {
  setCurrentPageNumber,
  setListing,
  setSavedPages,
} from "../createListingPageSlice";
import DescriptionInput from "../../../shared/inputs/descriptionInput/DescriptionInput";
import PriceInput from "../../../shared/inputs/priceInput/PriceInput";
import DiscountPriceInput from "../../../shared/inputs/discountPriceInput/DiscountPriceInput";
import TestInput from "./TestInput";

export default function BasicInfoForm() {
  // const [state, setState] = useState<BasicInfo>(parent.basicInfo);

  const pageState = useAppSelector((s) => s.createListingPage);
  const dispatch = useDispatch();

  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headerRef.current?.focus();
  }, [headerRef.current]);

  function handleTwoBtnRow(
    fieldName: keyof typeof pageState.listing.basicInfo,
    obj: TypeBool | ForSaleOrRent | ForRentBy | ForSaleBy
  ) {
    const object = obj as ForSaleOrRent | ForRentBy | ForSaleBy;
    switch (object.value?.id) {
      case "for-sale":
        console.log("SALE");
        handleForSale();
        break;
      case "for-rent":
        handleForRent();
        break;
      case "agent":
        handleForSaleByAgent();
        break;
      case "owner":
        handleForSaleByOwner();
        break;
      case "company":
        handleForRentByCompany();
        break;
      case "private-owner":
        handleForRentByPrivateOwner();
        break;

      default:
        throw new Error("Escaped");
    }
  }

  function handleForSale(): void {
    const { company, privateOwner, ...p } = pageState.listing;
    const { forRentBy, ...rest } = pageState.listing.basicInfo;

    // Create new form state object
    const s: ListingData = {
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
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);

      // Private owner is not empty --> prompt user, erase private owner and forRentBy
    } else if (
      privateOwner &&
      compareObjects(privateOwner, initPrivateOwner) === false &&
      window.confirm(
        "Selecting FOR SALE will delete the rental's PRIVATE OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);

      // Company and private owner are either both undefined and/or empty
    } else if (
      (!company ||
        (company && compareObjects(company, initCompany) === true)) &&
      (!privateOwner ||
        (privateOwner &&
          compareObjects(privateOwner, initPrivateOwner) === true))
    ) {
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);
    } else {
      throw new Error("Escaped");
    }
  }

  function handleForRent(): void {
    const { agent, owner, ...p } = pageState.listing;
    const { forSaleBy, ...rest } = pageState.listing.basicInfo;

    const s: ListingData = {
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
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);

      // Sale's owner is not empty --> prompt user, erase owner
    } else if (
      owner &&
      compareObjects(owner, initOwner) === false &&
      window.confirm(
        "Selecting FOR RENT will delete the sales' OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);

      //Sale's agent and owner are either both undefined and/or empty
    } else if (
      (!agent || (agent && compareObjects(agent, initAgent) === true)) &&
      (!owner || (owner && compareObjects(owner, initOwner) === true))
    ) {
      dispatch(setListing(s));
      // setState(s.basicInfo);
      // emit(s);
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
  function handleForSaleByAgent(): void {
    if (pageState.listing.basicInfo.forSaleBy !== undefined) {
      const { owner, company, privateOwner, ...o } = pageState.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...pageState.listing.basicInfo,
          forSaleBy: {
            ...pageState.listing.basicInfo.forSaleBy,
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
        dispatch(setListing(s));
        // setState(s.basicInfo);
        // emit(s);
      } else if (!owner || compareObjects(owner, initOwner) === true) {
        dispatch(setListing(s));

        // setState(s.basicInfo);
        // emit(s);
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
  function handleForSaleByOwner(): void {
    // If for sale by owner, make sure agent is not in state

    if (pageState.listing.basicInfo.forSaleBy !== undefined) {
      const { agent, company, privateOwner, ...o } = pageState.listing;
      const s: ListingData = {
        ...o,
        basicInfo: {
          ...pageState.listing.basicInfo,
          forSaleBy: {
            ...pageState.listing.basicInfo.forSaleBy,
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
        dispatch(setListing(s));
        // setState(s.basicInfo);
        // emit(s);
      } else if (!agent || compareObjects(agent, initAgent) === true) {
        dispatch(setListing(s));

        // setState(s.basicInfo);
        // emit(s);
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
  function handleForRentByCompany(): void {
    if (pageState.listing.basicInfo.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, privateOwner, ...o } = pageState.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...pageState.listing.basicInfo,
          forRentBy: {
            ...pageState.listing.basicInfo.forRentBy,
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
        dispatch(setListing(s));
      } else if (
        !privateOwner ||
        compareObjects(privateOwner, initPrivateOwner) === true
      ) {
        dispatch(setListing(s));
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
  function handleForRentByPrivateOwner(): void {
    if (pageState.listing.basicInfo.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, company, ...o } = pageState.listing;
      const s: ListingData = {
        ...o,
        basicInfo: {
          ...pageState.listing.basicInfo,
          forRentBy: {
            ...pageState.listing.basicInfo.forRentBy,
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
        dispatch(setListing(s));
      } else if (!company || compareObjects(company, initCompany) === true) {
        dispatch(setListing(s));
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
  function handleListingKind(options: ListingKindValue[]): void {
    if (options && options.length === 1 && options[0] !== null) {
      let init:
        | SingleFamilyHome
        | MultiFamilyHome
        | Condo
        | Townhouse
        | ApartmentBuilding
        | Apartment
        | ManufacturedHome
        | Land = initLand;

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
      } = pageState.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...pageState.listing.basicInfo,
          listingKind: {
            ...pageState.listing.basicInfo.listingKind,
            value: kind,
            valid: true,
            errorMsg: "",
          },
        },
        [kind.name]: init,
      };
      dispatch(setListing(s));

      // Either no options found or more than one found
    } else {
      throw new Error(
        "A listing must have exactly one home type! Make sure that isMulti=false on Dropdown"
      );
    }
  }

  function handleVerify(actionName: VerifyActionName, obj: BasicInfo) {
    if (actionName === "save" || actionName === "edit") {
      dispatch(
        setListing({
          ...pageState.listing,
          basicInfo: obj,
        })
      );
    } else if (actionName === "verify" && obj.saved === true) {
      // Cleanup undefined listing objects
      let key: keyof typeof pageState.listing;
      for (key in pageState.listing) {
        if (pageState.listing[key] === undefined) {
          delete pageState.listing[key];
        }
      }
      dispatch(
        setListing({
          ...pageState.listing,
          basicInfo: obj,
        })
      );
      dispatch(setSavedPages([1, 2, 3]));
      dispatch(setCurrentPageNumber(3));
      // nextPage();
    } else if (actionName === "verify" && obj.saved === false) {
      dispatch(
        setListing({
          ...pageState.listing,
          basicInfo: obj,
        })
      );
      dispatch(setSavedPages([1, 2, 3]));
    } else {
      throw new Error("Whoops");
    }
  }

  const state = pageState.listing.basicInfo;

  setTimeout(() => {}, 200);
  return (
    <form>
      {state.saved === true ? (
        <section>
          <EditFormSection<typeof state> parent={state} emit={handleVerify} />
        </section>
      ) : null}
      <section>
        <header ref={headerRef}>Basic Information</header>

        <DescriptionInput
          minDescriptionLength={20}
          maxDescriptionLength={280}
          state={pageState.listing.basicInfo.description}
          placeholder="Property description"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...pageState.listing,
                basicInfo: {
                  ...pageState.listing.basicInfo,
                  description: obj,
                },
              })
            )
          }
        />

        <TwoBtnRow<typeof pageState.listing.basicInfo>
          leftBtnText="For Sale"
          leftBtnValue={{ id: "for-sale", label: "For Sale" }}
          rightBtnText="For Rent"
          rightBtnValue={{ id: "for-rent", label: "For Rent" }}
          label="For sale/rent"
          state={state.forSaleOrRent}
          fieldName="forSaleOrRent"
          handleSelected={handleTwoBtnRow}
        />

        {state.forSaleBy ? (
          <TwoBtnRow<typeof pageState.listing.basicInfo>
            leftBtnText="Agent"
            leftBtnValue={{ id: "agent", label: "Agent" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "owner", label: "Owner" }}
            label="Listed by"
            state={state.forSaleBy}
            fieldName="forSaleBy"
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {state.forRentBy ? (
          <TwoBtnRow<typeof pageState.listing.basicInfo>
            leftBtnText="Company"
            leftBtnValue={{ id: "company", label: "Company" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "private-owner", label: "Private Owner" }}
            label="Listed by"
            state={state.forRentBy}
            fieldName="forRentBy"
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {state.forSaleOrRent.value?.id === "for-sale" ? (
          <Dropdown<ListingKindValue>
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
          <Dropdown<ListingKindValue>
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

        <PriceInput
          state={state.price}
          isPriceFilter={false}
          minPrice={1}
          placeholder={
            state.forSaleOrRent && state.forSaleOrRent.value?.id === "for-sale"
              ? "Price"
              : state.forSaleOrRent &&
                state.forSaleOrRent.value?.id === "for-rent"
              ? "Price/month"
              : "Price"
          }
          groupSeparators={[","]}
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...pageState.listing,
                basicInfo: {
                  ...pageState.listing.basicInfo,
                  price: obj,
                },
              })
            )
          }
        />

        {/* <DiscountPriceInput
          state={state.priceChange}
          groupSeparators={[","]}
          originalPrice={state.price.number}
          prefix="$"
          placeholder={
            state.forSaleOrRent && state.forSaleOrRent.value?.id === "for-sale"
              ? "New price*"
              : state.forSaleOrRent &&
                state.forSaleOrRent.value?.id === "for-rent"
              ? "New price/month*"
              : "New price*"
          }
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...pageState.listing,
                basicInfo: {
                  ...pageState.listing.basicInfo,
                  priceChange: obj,
                },
              })
            )
          }
        /> */}

        <TestInput
          state={state.price}
          placeholder="Stop It Safari!"
          handleInput={(obj) => console.log(obj)}
        />

        {/* <InputStr<typeof state>
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
          parent={state.priceChange || initStrOpt}
          emit={handleInputStr}
        /> */}
        {/* End Basic Info */}
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
      </section>
    </form>
  );
}
