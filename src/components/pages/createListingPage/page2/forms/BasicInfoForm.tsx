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
  BasicInfo,
  VerifyActionName,
  ApartmentBuilding,
  Apartment,
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
  initManufacturedHome,
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
import Dropdown from "../../../../shared/dropdown/Dropdown";
import EditFormSection from "../../shared/EditFormSection";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setListing, setSavedPages } from "../../createListingPageSlice";
import DescriptionInput from "../../../../shared/inputs/descriptionInput/DescriptionInput";
import PriceInput from "../../../../shared/inputs/priceInput/PriceInput";
import DiscountPriceInput from "../../../../shared/inputs/discountPriceInput/DiscountPriceInput";
import FormCheck from "../../shared/FormCheck";
import { useNavigate } from "react-router";
import { handleFormVerification } from "../../utils/formUtils";

export default function BasicInfoForm({
  thisPageNum,
}: {
  /**
   * Used by handleVerify to add this page number to the array of
   * saved pages in the createListingPage state
   */
  thisPageNum: number;
}) {
  const state = useAppSelector((s) => s.createListingPage);
  const basicInfo = state.listing.basicInfo;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleTwoBtnRow(
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
    const { company, privateOwner, ...p } = state.listing;
    const { forRentBy, ...rest } = state.listing.basicInfo;

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
    const { agent, owner, ...p } = state.listing;
    const { forSaleBy, ...rest } = state.listing.basicInfo;

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
    if (state.listing.basicInfo.forSaleBy !== undefined) {
      const { owner, company, privateOwner, ...o } = state.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...state.listing.basicInfo,
          forSaleBy: {
            ...state.listing.basicInfo.forSaleBy,
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

    if (state.listing.basicInfo.forSaleBy !== undefined) {
      const { agent, company, privateOwner, ...o } = state.listing;
      const s: ListingData = {
        ...o,
        basicInfo: {
          ...state.listing.basicInfo,
          forSaleBy: {
            ...state.listing.basicInfo.forSaleBy,
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
    if (state.listing.basicInfo.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, privateOwner, ...o } = state.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...state.listing.basicInfo,
          forRentBy: {
            ...state.listing.basicInfo.forRentBy,
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
    if (state.listing.basicInfo.forRentBy !== undefined) {
      // Remove other seller kinds from state
      const { agent, owner, company, ...o } = state.listing;
      const s: ListingData = {
        ...o,
        basicInfo: {
          ...state.listing.basicInfo,
          forRentBy: {
            ...state.listing.basicInfo.forRentBy,
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
      } = state.listing;

      const s: ListingData = {
        ...o,
        basicInfo: {
          ...state.listing.basicInfo,
          listingKind: {
            ...state.listing.basicInfo.listingKind,
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

  function handleFormVerificationWrapper(
    actionName: VerifyActionName,
    obj: BasicInfo
  ) {
    handleFormVerification<BasicInfo>({
      createListingPageState: state,
      actionName,
      obj,
      thisPageNum,
      handleFormState: (obj) =>
        dispatch(
          setListing({
            ...state.listing,
            basicInfo: obj,
          })
        ),
      handleSavedPageNumbers: (nums) => dispatch(setSavedPages(nums)),
      handleNavigate: (path) => navigate(path),
    });
  }

  return (
    <form>
      {basicInfo.saved === true ? (
        <section>
          <EditFormSection<typeof basicInfo>
            parent={basicInfo}
            emit={handleFormVerificationWrapper}
          />
        </section>
      ) : null}
      <section>
        <header>Basic Information</header>

        <DescriptionInput
          minDescriptionLength={20}
          maxDescriptionLength={280}
          state={state.listing.basicInfo.description}
          placeholder="Property description"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                basicInfo: {
                  ...basicInfo,
                  description: obj,
                },
              })
            )
          }
        />

        <TwoBtnRow<typeof basicInfo>
          leftBtnText="For Sale"
          leftBtnValue={{ id: "for-sale", label: "For Sale" }}
          rightBtnText="For Rent"
          rightBtnValue={{ id: "for-rent", label: "For Rent" }}
          label="For sale/rent"
          state={basicInfo.forSaleOrRent}
          handleSelected={handleTwoBtnRow}
        />

        {basicInfo.forSaleBy ? (
          <TwoBtnRow<typeof basicInfo>
            leftBtnText="Agent"
            leftBtnValue={{ id: "agent", label: "Agent" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "owner", label: "Owner" }}
            label="Listed by"
            state={basicInfo.forSaleBy}
            // fieldName="forSaleBy"
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {basicInfo.forRentBy ? (
          <TwoBtnRow<typeof basicInfo>
            leftBtnText="Company"
            leftBtnValue={{ id: "company", label: "Company" }}
            rightBtnText="Owner"
            rightBtnValue={{ id: "private-owner", label: "Private Owner" }}
            label="Listed by"
            state={basicInfo.forRentBy}
            // fieldName="forRentBy"
            handleSelected={handleTwoBtnRow}
          />
        ) : null}

        {basicInfo.forSaleOrRent.value?.id === "for-sale" ? (
          <Dropdown<ListingKindValue>
            placeHolder={"What are you selling?"}
            menuItems={listingKindValuesForSale}
            isMulti={false}
            isSearchable={false}
            parent={[basicInfo.listingKind.value]}
            disabled={basicInfo.listingKind.readOnly}
            errorMsg={basicInfo.listingKind.errorMsg}
            label={"Listing Kind"}
            emit={handleListingKind}
          />
        ) : null}

        {basicInfo.forSaleOrRent.value?.id === "for-rent" ? (
          <Dropdown<ListingKindValue>
            placeHolder={"What are you renting?"}
            menuItems={listingKindValuesForRent}
            isMulti={false}
            isSearchable={false}
            parent={[basicInfo.listingKind.value]}
            errorMsg={basicInfo.listingKind.errorMsg}
            label={"Listing Kind"}
            disabled={basicInfo.listingKind.readOnly}
            emit={handleListingKind}
          />
        ) : null}

        <PriceInput
          state={basicInfo.price}
          isPriceFilter={false}
          isDiscountPrice={false}
          minPrice={1}
          placeholder={
            basicInfo.forSaleOrRent &&
            basicInfo.forSaleOrRent.value?.id === "for-sale"
              ? "Price"
              : basicInfo.forSaleOrRent &&
                basicInfo.forSaleOrRent.value?.id === "for-rent"
              ? "Price/month"
              : "Price"
          }
          groupSeparators={[","]}
          currency="USD"
          prefix="$"
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                basicInfo: {
                  ...basicInfo,
                  price: obj,
                },
              })
            )
          }
        />

        <DiscountPriceInput
          state={basicInfo.priceChange}
          isPriceFilter={false}
          isDiscountPrice={true}
          groupSeparators={[","]}
          currency="USD"
          prefix="$"
          minPrice={0}
          originalPrice={basicInfo.price.number}
          placeholder={
            basicInfo.forSaleOrRent &&
            basicInfo.forSaleOrRent.value?.id === "for-sale"
              ? "New price*"
              : basicInfo.forSaleOrRent &&
                basicInfo.forSaleOrRent.value?.id === "for-rent"
              ? "New price/month*"
              : "New price*"
          }
          handleInput={(obj) =>
            dispatch(
              setListing({
                ...state.listing,
                basicInfo: {
                  ...basicInfo,
                  priceChange: obj,
                },
              })
            )
          }
        />
      </section>
      <FormCheck
        formState={basicInfo}
        initialFormState={initBasicInfo}
        handleFormVerification={handleFormVerificationWrapper}
      />
    </form>
  );
}
