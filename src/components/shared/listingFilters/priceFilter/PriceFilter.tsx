import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import mod from "./priceFilter.module.scss";
import { setShowMenu, setPriceRange } from "./slice";
import { initStrOpt } from "../../../../initialValues";
import InputStr from "../../inputs/inputStr/InputStr";
import AbsoluteDropdownWrapper from "../../dropdownWrappers/absoluteDropdownWrapper/AbsoluteDropdownWrapper";
import FlexDropdownWrapper from "../../dropdownWrappers/flexDropdownWrapper/FlexDropdownWrapper";
import { Str } from "../../../../types";
import { AbsDropdownMenu, FlxDropdownMenu } from "../../dropdownWrappers/types";

interface LocalState {
  lowPrice: Str;
  highPrice: Str;
}

const initialLocalState: LocalState = {
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export default function PriceFilter<
  T extends AbsDropdownMenu | FlxDropdownMenu
>({ menuKind, menuStyles, btnStyles, label }: T) {
  const state = useAppSelector((state) => state.priceFilter);
  const dispatch = useDispatch();

  // local state gets dispatched when the filter is applied
  // this prevents excessive updates to redux store
  const [localState, setLocalState] = useState<LocalState>(initialLocalState);

  const inUse =
    state.highPrice?.formatted === "" && state.lowPrice?.formatted === ""
      ? false
      : true;

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

  const dropdownLabel =
    (state.lowPrice && state.lowPrice.number >= 1) ||
    (state.highPrice && state.highPrice.number >= 1) ? (
      <>
        {state.lowPrice?.shortFormatted} {" - "}{" "}
        {state.highPrice?.shortFormatted}
      </>
    ) : (
      label
    );

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
        menuStyles={menuStyles}
        label={dropdownLabel}
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
        label={dropdownLabel}
        handleShowMenu={handleShowMenu}
      />
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
