import TwoBtnRow from "../../shared/TwoBtnRow";
import {
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
  ApartmentBuilding,
  Apartment,
  BasicInfo,
} from "../../../../../types/index";
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
  initMultiFamilyHome,
  initMultiFamilyHomeUnit,
  initOwner,
  initPrivateOwner,
  initSingleFamilyHome,
  initTownhouse,
  listingKindValuesForRent,
  listingKindValuesForSale,
} from "../../../../../initialValues";
import compareObjects from "../../../../utils/compareObjects";
import EditFormSection from "../../shared/EditFormSection";
import { setListing } from "../../createListingPageSlice";
import DescriptionInput from "../../../../shared/inputs/descriptionInput/DescriptionInput";
import PriceInput from "../../../../shared/inputs/priceInput/PriceInput";
import DiscountPriceInput from "../../../../shared/inputs/discountPriceInput/DiscountPriceInput";
import FormCheck from "../../shared/FormCheck";
import { FormProps } from "../../types/formProps";
import useCommonFormLogic from "../../hooks/useCommonFormLogic";
import ExpandingDropdown from "../../../../shared/dropdownWrappers/expandingDropdown/ExpandingDropdown";

export default function BasicInfoForm(props: FormProps) {
  const stateName: keyof ListingData = "basicInfo";
  const {
    pageState,
    listing,
    state,
    dispatch,
    handleFormVerificationWrapper,
    handleInput,
  } = useCommonFormLogic<BasicInfo>({
    pageNumber: props.thisPageNum,
    stateName: stateName,
  });

  function handleTwoBtnRow(
    obj: TypeBool | ForSaleOrRent | ForRentBy | ForSaleBy
  ) {
    const object = obj as ForSaleOrRent | ForRentBy | ForSaleBy;
    switch (object.value?.id) {
      case "for-sale":
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
    const { company, privateOwner, ...p } = listing;
    const { forRentBy, ...rest } = state;

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

      // Private owner is not empty --> prompt user, erase private owner and forRentBy
    } else if (
      privateOwner &&
      compareObjects(privateOwner, initPrivateOwner) === false &&
      window.confirm(
        "Selecting FOR SALE will delete the rental's OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      dispatch(setListing(s));

      // Company and private owner are either both undefined and/or empty
    } else if (
      (!company ||
        (company && compareObjects(company, initCompany) === true)) &&
      (!privateOwner ||
        (privateOwner &&
          compareObjects(privateOwner, initPrivateOwner) === true))
    ) {
      dispatch(setListing(s));
    } else {
      throw new Error("Escaped");
    }
  }

  function handleForRent(): void {
    const { agent, owner, ...p } = listing;
    const { forSaleBy, ...rest } = state;

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

      // Sale's owner is not empty --> prompt user, erase owner
    } else if (
      owner &&
      compareObjects(owner, initOwner) === false &&
      window.confirm(
        "Selecting FOR RENT will delete the sales' OWNER information you have already entered. Do you wish to proceed?"
      )
    ) {
      dispatch(setListing(s));

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
    if (state.forSaleBy !== undefined) {
      const { owner, company, privateOwner, ...o } = listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...listing.basicInfo,
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
        dispatch(setListing(s));
      } else if (!owner || compareObjects(owner, initOwner) === true) {
        dispatch(setListing(s));
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

    if (state.forSaleBy !== undefined) {
      const { agent, company, privateOwner, ...o } = listing;
      const s: ListingData = {
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
        dispatch(setListing(s));
      } else if (!agent || compareObjects(agent, initAgent) === true) {
        dispatch(setListing(s));
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
    if (state.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, privateOwner, ...o } = listing;

      const s: ListingData = {
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
          "Choosing COMPANY will erase all OWNER data, are you sure you want to proceed?"
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
    if (state.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, company, ...o } = listing;
      const s: ListingData = {
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
          "Choosing OWNER will erase all COMPANY data, are you sure you want to proceed?"
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
  function handleListingKind(options: ListingKindValue[] | null): void {
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
        // case "manufactured-home":
        //   init = initManufacturedHome;
        //   break;
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
      } = listing;

      const s: ListingData = {
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
      dispatch(setListing(s));

      // Either no options found or more than one found
    } else {
      // dispatch(
      //   setListing({
      //     ...listing,
      //     basicInfo: {
      //       ...state,
      //       listingKind: {
      //         ...state.listingKind,
      //         value: null,
      //         errorMsg: "Listing type is required",
      //       },
      //     },
      //   })
      // );
      // throw new Error(
      //   "A listing must have exactly one home type! Make sure that isMulti=false on Dropdown"
      // );
    }
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
        <header>Basic Information</header>

        <DescriptionInput
          minDescriptionLength={20}
          maxDescriptionLength={280}
          state={state.description}
          placeholder="Property description"
          handleInput={(obj) => handleInput(obj, "description")}
        />

        <TwoBtnRow<typeof state>
          leftBtnText="For Sale"
          leftBtnValue={{ id: "for-sale", label: "For Sale" }}
          rightBtnText="For Rent"
          rightBtnValue={{ id: "for-rent", label: "For Rent" }}
          label="For sale/rent"
          state={state.forSaleOrRent}
          handleSelected={handleTwoBtnRow}
        />

        {state.forSaleBy ? (
          <TwoBtnRow<typeof state>
            leftBtnText="Agent"
            leftBtnValue={{ id: "agent", label: "Agent" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "owner", label: "Owner" }}
            label="Listed by"
            state={state.forSaleBy}
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {state.forRentBy ? (
          <TwoBtnRow<typeof state>
            leftBtnText="Company"
            leftBtnValue={{ id: "company", label: "Company" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "private-owner", label: "Private Owner" }}
            label="Listed by"
            state={state.forRentBy}
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {state.forSaleOrRent.value?.id === "for-sale" ? (
          <ExpandingDropdown<ListingKindValue>
            menuItems={listingKindValuesForSale}
            isMulti={false}
            isSearchable={false}
            selectedItems={[state.listingKind.value]}
            errorMsg={state.listingKind.errorMsg}
            label={"Listing Kind"}
            placeHolder={"What are you selling?"}
            disabled={state.listingKind.readOnly}
            handleSelectedItems={handleListingKind}
          />
        ) : null}

        {state.forSaleOrRent.value?.id === "for-rent" ? (
          <ExpandingDropdown<ListingKindValue>
            menuItems={listingKindValuesForRent}
            isMulti={false}
            isSearchable={false}
            selectedItems={[state.listingKind.value]}
            errorMsg={state.listingKind.errorMsg}
            label={"Listing Kind"}
            placeHolder={"What are you renting?"}
            disabled={state.listingKind.readOnly}
            handleSelectedItems={handleListingKind}
          />
        ) : null}

        <PriceInput
          state={state.price}
          isPriceFilter={false}
          isDiscountPrice={false}
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
          currency="USD"
          prefix="$"
          handleInput={(obj) => handleInput(obj, "price")}
        />

        {pageState.editingListing ? (
          <DiscountPriceInput
            state={state.priceChange}
            isPriceFilter={false}
            isDiscountPrice={true}
            groupSeparators={[","]}
            currency="USD"
            prefix="$"
            minPrice={0}
            originalPrice={state.price.number}
            placeholder={
              state.forSaleOrRent &&
              state.forSaleOrRent.value?.id === "for-sale"
                ? "New price*"
                : state.forSaleOrRent &&
                  state.forSaleOrRent.value?.id === "for-rent"
                ? "New price/month*"
                : "New price*"
            }
            handleInput={(obj) => handleInput(obj, "priceChange")}
          />
        ) : null}
      </section>

      <FormCheck
        formState={state}
        initialFormState={initBasicInfo}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
