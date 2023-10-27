import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";

import mod from "./priceFilter.module.scss";

import { setShowMenu, setPriceRange } from "./slice";
import { initStrOpt } from "../../../../initialValues";
import InputStr from "../../inputs/inputStr/InputStr";

import AbsoluteDropdownWrapper from "../../dropdownWrappers/absoluteDropdownWrapper/AbsoluteDropdownWrapper";

import FlexDropdownWrapper, {
  FlexDropdownBtnStyles,
  FlexDropdownMenuStyles,
} from "../../dropdownWrappers/flexDropdownWrapper/FlexDropdownWrapper";

import { Str } from "../../../../types";

interface Props {
  menuKind: "absolute" | "flex";
  btnStyles: FlexDropdownBtnStyles;
  menuStyles: FlexDropdownMenuStyles;
  label: string;
  /**
   * Menu closes when user clicks outside of container.
   * Default is true
   */
  closeOnOutsideClick?: boolean;
}

interface LocalState {
  lowPrice: Str;
  highPrice: Str;
}

const initialLocalState: LocalState = {
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export default function PriceFilter({
  menuKind,
  menuStyles,
  btnStyles,
  label,
  closeOnOutsideClick = true,
}: Props) {
  const state = useAppSelector((state) => state.priceFilter);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // local state gets dispatched when the filter is applied
  // this prevents excessive updates to redux store
  const [localState, setLocalState] = useState<LocalState>(initialLocalState);

  const inUse =
    state.highPrice?.formatted === "" && state.lowPrice?.formatted === ""
      ? false
      : true;

  // useCloseDropdown({
  //   menuIsOpen: state.showMenu,
  //   closeOnOutsideClick,
  //   containerRef,
  //   menuRef,
  //   setShowMenu,
  //   reducers: [
  //     setPriceRange({
  //       lowPrice: localState.lowPrice,
  //       highPrice: localState.highPrice,
  //     }),
  //   ],
  // });

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
    setLocalState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  function handleShowMenu() {
    dispatch(setShowMenu());
  }

  function handleStateOnMenuClose() {
    dispatch(
      setPriceRange({
        lowPrice: localState.lowPrice,
        highPrice: localState.highPrice,
      })
    );
  }

  const menuContent: JSX.Element = (
    <>
      <InputStr<typeof state>
        size="lg"
        fieldName="lowPrice"
        groupSeparators={[","]}
        formatType="USD-no-decimal-filter"
        prefix="$"
        min={1}
        isPriceChange={false}
        placeholder={"Low Price"}
        parent={state.lowPrice}
        emit={handleInputStr}
      />

      <InputStr<typeof state>
        size="lg"
        fieldName="highPrice"
        groupSeparators={[","]}
        formatType="USD-no-decimal-filter"
        prefix="$"
        min={1}
        isPriceChange={false}
        placeholder={"High Price"}
        parent={state.highPrice || initStrOpt}
        emit={handleInputStr}
      />

      <div
        className={mod["apply-filter-btn"]}
        onClick={() => {
          dispatch(
            setPriceRange({
              lowPrice: localState.lowPrice,
              highPrice: localState.highPrice,
            })
          );
          dispatch(setShowMenu());
        }}
      >
        Apply
      </div>
    </>
  );

  if (menuKind === "absolute") {
    return (
      <AbsoluteDropdownWrapper
        menuContent={menuContent}
        showMenu={state.showMenu}
        inUse={inUse}
        btnStyles={btnStyles}
        label={
          (state.lowPrice && state.lowPrice.number >= 1) ||
          (state.highPrice && state.highPrice.number >= 1) ? (
            <>
              {state.lowPrice?.shortFormatted} {" - "}{" "}
              {state.highPrice?.shortFormatted}
            </>
          ) : (
            label
          )
        }
        handleShowMenu={handleShowMenu}
        handleStateOnMenuClose={handleStateOnMenuClose}
      />
    );
  }

  if (menuKind === "flex") {
    return (
      <FlexDropdownWrapper
        menuContent={menuContent}
        showMenu={state.showMenu}
        inUse={inUse}
        btnStyles={btnStyles}
        menuStyles={menuStyles}
        label={
          (state.lowPrice && state.lowPrice.number >= 1) ||
          (state.highPrice && state.highPrice.number >= 1) ? (
            <>
              {state.lowPrice?.shortFormatted} {" - "}{" "}
              {state.highPrice?.shortFormatted}
            </>
          ) : (
            label
          )
        }
        handleShowMenu={handleShowMenu}
      />
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
