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

interface Props {
  /**
   * absolute menus have absolute position an don't respect padding of the  *   parent and appear above siblings
   *
   * flex menus display a flex column that will respect parent padding and
   will appear next to siblings
   */
  menuKind: "absolute" | "flex";
  styles: DropdownStyles;
  label: string;
}

export default function BedAndBathFilter({ menuKind, styles, label }: Props) {
  const state = useAppSelector((state) => state.bedAndBathFilter);
  const dispatch = useDispatch();

  /**
   Set an inUse condition, depending on the menu, such as if a max price is set on a price range menu
   */
  const inUse = state.baths! > 0 || state.beds! > 0 ? true : false;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    menuKind: menuKind,
    containerRef,
    menuRef,
    setShowMenu,
  });

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

  if (menuKind === "absolute") {
    return (
      <A_CONTAINER
        ref={containerRef}
        onClick={() =>
          // Be sure to use the setShowMenu function that is defined
          // in the slice being used
          dispatch(setShowMenu())
        }
        inUse={inUse}
        styles={styles}
      >
        {label || "Dropdown"}
        <A_CONTAINER_ICON_WRAP>
          <A_CONTAINER_ICON flipped={state.showMenu} />
        </A_CONTAINER_ICON_WRAP>
        {state.showMenu ? (
          <A_MENU ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <MENU_SECTION_WRAP>
              <header>Number of Bedrooms</header>
              <MENU_SECTION>
                <BED_BATH_BTN
                  $isSelected={state.beds === 1 ? true : false}
                  onClick={(e) => handleNumBeds(e, 1)}
                >
                  1+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.beds === 2 ? true : false}
                  onClick={(e) => handleNumBeds(e, 2)}
                >
                  2+
                </BED_BATH_BTN>{" "}
                <BED_BATH_BTN
                  $isSelected={state.beds === 3 ? true : false}
                  onClick={(e) => handleNumBeds(e, 3)}
                >
                  3+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.beds === 4 ? true : false}
                  onClick={(e) => handleNumBeds(e, 4)}
                >
                  4+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.beds === 5 ? true : false}
                  onClick={(e) => handleNumBeds(e, 5)}
                >
                  5+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.beds == null ? true : false}
                  onClick={(e) => handleNumBeds(e, null)}
                >
                  Any
                </BED_BATH_BTN>
              </MENU_SECTION>
            </MENU_SECTION_WRAP>
            <MENU_SECTION_WRAP>
              <header>Number of Bathrooms</header>
              <MENU_SECTION>
                <BED_BATH_BTN
                  $isSelected={state.baths === 1 ? true : false}
                  onClick={(e) => handleNumBaths(e, 1)}
                >
                  1+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.baths === 1.5 ? true : false}
                  onClick={(e) => handleNumBaths(e, 1.5)}
                >
                  1.5+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.baths === 2 ? true : false}
                  onClick={(e) => handleNumBaths(e, 2)}
                >
                  2+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.baths === 2.5 ? true : false}
                  onClick={(e) => handleNumBaths(e, 2.5)}
                >
                  2.5+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.baths === 3 ? true : false}
                  onClick={(e) => handleNumBaths(e, 3)}
                >
                  3+
                </BED_BATH_BTN>
                <BED_BATH_BTN
                  $isSelected={state.baths == null ? true : false}
                  onClick={(e) => handleNumBaths(e, null)}
                >
                  Any
                </BED_BATH_BTN>
              </MENU_SECTION>
            </MENU_SECTION_WRAP>
          </A_MENU>
        ) : null}
      </A_CONTAINER>
    );
  }

  if (menuKind === "flex") {
    return (
      <F_CONTAINER ref={containerRef} inUse={inUse}>
        <F_BTN onClick={() => dispatch(setShowMenu())} styles={styles}>
          {label || "Dropdown"}
          <F_BTN_ICON_WRAP>
            <F_BTN_ICON flipped={state.showMenu} />
          </F_BTN_ICON_WRAP>
        </F_BTN>

        <F_MENU
          className={state.showMenu ? "open" : "closed"}
          styles={styles}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <MENU_SECTION_WRAP>
            <header>Number of Bedrooms</header>
            <MENU_SECTION>
              <BED_BATH_BTN
                $isSelected={state.beds === 1 ? true : false}
                onClick={(e) => handleNumBeds(e, 1)}
              >
                1+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.beds === 2 ? true : false}
                onClick={(e) => handleNumBeds(e, 2)}
              >
                2+
              </BED_BATH_BTN>{" "}
              <BED_BATH_BTN
                $isSelected={state.beds === 3 ? true : false}
                onClick={(e) => handleNumBeds(e, 3)}
              >
                3+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.beds === 4 ? true : false}
                onClick={(e) => handleNumBeds(e, 4)}
              >
                4+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.beds === 5 ? true : false}
                onClick={(e) => handleNumBeds(e, 5)}
              >
                5+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.beds == null ? true : false}
                onClick={(e) => handleNumBeds(e, null)}
              >
                Any
              </BED_BATH_BTN>
            </MENU_SECTION>
          </MENU_SECTION_WRAP>
          <MENU_SECTION_WRAP>
            <header>Number of Bathrooms</header>
            <MENU_SECTION>
              <BED_BATH_BTN
                $isSelected={state.baths === 1 ? true : false}
                onClick={(e) => handleNumBaths(e, 1)}
              >
                1+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.baths === 1.5 ? true : false}
                onClick={(e) => handleNumBaths(e, 1.5)}
              >
                1.5+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.baths === 2 ? true : false}
                onClick={(e) => handleNumBaths(e, 2)}
              >
                2+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.baths === 2.5 ? true : false}
                onClick={(e) => handleNumBaths(e, 2.5)}
              >
                2.5+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.baths === 3 ? true : false}
                onClick={(e) => handleNumBaths(e, 3)}
              >
                3+
              </BED_BATH_BTN>
              <BED_BATH_BTN
                $isSelected={state.baths == null ? true : false}
                onClick={(e) => handleNumBaths(e, null)}
              >
                Any
              </BED_BATH_BTN>
            </MENU_SECTION>
          </MENU_SECTION_WRAP>
        </F_MENU>
      </F_CONTAINER>
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
