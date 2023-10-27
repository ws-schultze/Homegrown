import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles } from "../../../../types/index";

import {
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_CONTAINER_ICON,
  A_MENU,
} from "../styledComponents/absolute";

import {
  F_BTN,
  F_BTN_ICON,
  F_BTN_ICON_WRAP,
  F_CONTAINER,
  F_MENU,
} from "../styledComponents/flex";

import {
  MENU_SECTION_WRAP,
  MENU_SECTION,
  BED_BATH_BTN,
} from "./styledComponents/common";

import { setShowMenu, setBeds, setBaths } from "./slice";
import {
  FilterProps,
  AbsDropdownMenu,
  FlxDropdownMenu,
} from "../../dropdownWrappers/types";

import scss from "./benAndBathFilter.module.scss";
import AbsoluteDropdownWrapper from "../../dropdownWrappers/absoluteDropdownWrapper/AbsoluteDropdownWrapper";
import FlexDropdownWrapper from "../../dropdownWrappers/flexDropdownWrapper/FlexDropdownWrapper";

export default function BedAndBathFilter<
  T extends AbsDropdownMenu | FlxDropdownMenu
>({ menuKind, menuStyles, btnStyles, label }: T) {
  const state = useAppSelector((state) => state.bedAndBathFilter);
  const dispatch = useDispatch();
  const inUse = state.baths! > 0 || state.beds! > 0 ? true : false;

  function handleShowMenu() {
    dispatch(setShowMenu());
  }

  /**
   * Set number of baths to state
   */
  function handleNumBaths(
    e: React.MouseEvent | React.ChangeEvent,
    num: number | null
  ): void {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    if (state.baths == null || state.baths !== num) {
      dispatch(setBaths(num));
    } else if (state.baths === num) {
      dispatch(setBaths(null));
    }
  }

  /**
   * Set number of beds to state
   */
  function handleNumBeds(
    e: React.MouseEvent | React.ChangeEvent,
    num: number | null
  ): void {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    if (state.beds == null || state.beds !== num) {
      dispatch(setBeds(num));
    } else if (state.beds === num) {
      dispatch(setBeds(null));
    }
  }

  const menuContent = (
    <>
      <div className={scss["menu-section-wrap"]}>
        <header>Number of Bedrooms</header>
        <div className={scss["menu-section"]}>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === 1 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, 1)}
          >
            1+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === 2 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, 2)}
          >
            2+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === 3 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, 3)}
          >
            3+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === 4 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, 4)}
          >
            4+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === 5 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, 5)}
          >
            5+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.beds === null ? scss.active : ""
            }`}
            onClick={(e) => handleNumBeds(e, null)}
          >
            Any
          </button>
        </div>
      </div>
      <div className={scss["menu-section-wrap"]}>
        <header>Number of Bathrooms</header>
        <div className={scss["menu-section"]}>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === 1 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, 1)}
          >
            1+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === 1.5 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, 1.5)}
          >
            1.5+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === 2 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, 2)}
          >
            2+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === 2.5 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, 2.5)}
          >
            2.5+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === 3 ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, 3)}
          >
            3+
          </button>
          <button
            className={`${scss["num-btn"]} ${
              state.baths === null ? scss.active : ""
            }`}
            onClick={(e) => handleNumBaths(e, null)}
          >
            Any
          </button>
        </div>
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
        label={label}
        handleShowMenu={handleShowMenu}
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
        label={label}
        handleShowMenu={handleShowMenu}
      />
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
