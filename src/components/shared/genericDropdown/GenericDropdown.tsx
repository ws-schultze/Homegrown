import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
import useCloseDropdown from "./hooks/useCloseDropdown";
import { DropdownStyles } from "../../../types/index";

import {
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_CONTAINER_ICON,
  A_MENU,
} from "./styledComponents/absolute";

import {
  F_BTN,
  F_BTN_ICON,
  F_BTN_ICON_WRAP,
  F_CONTAINER,
  F_MENU,
} from "./styledComponents/flex";
import { initialState, setShowMenu } from "./slice";

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

export default function GenericDropdown({ menuKind, styles, label }: Props) {
  // const state = useAppSelector((state) => state.genericDropdown);

  // Just using useState to keep errors from happening while not using this dropdown for anything but demo
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  /**
   Set an inUse condition, depending on the menu, such as if a max price is set on a price range menu
   */
  const inUse = state.showMenu;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    containerRef,
    menuRef,
    setShowMenu,
  });

  /**
   * Any menu stuff the uses state needs to have its own slice action
   */

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
            {/* Menu stuff goes here */}
          </A_MENU>
        ) : null}
      </A_CONTAINER>
    );
  }

  if (menuKind === "flex") {
    return (
      <F_CONTAINER ref={containerRef} inUse={inUse}>
        <F_BTN
          onClick={() =>
            // Be sure to use the setShowMenu function that is defined
            // in the slice being used
            dispatch(setShowMenu())
          }
          styles={styles}
        >
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
          {/* Menu stuff goes here */}
        </F_MENU>
      </F_CONTAINER>
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
