import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles, ListingKindValue } from "../../../../types/index";

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

import { setSelectedTypes, setShowMenu } from "./slice";
import { MENU_ITEM } from "./styledComponents/common";

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
  /**
   * Menu closes when user clicks outside of container.
   * Default is true
   */
  closeOnOutsideClick?: boolean;
}

export default function ListingTypeFilter({
  menuKind,
  styles,
  label,
  closeOnOutsideClick = true,
}: Props) {
  const state = useAppSelector((state) => state.listingTypeFilter);
  const dispatch = useDispatch();

  /**
   Set an inUse condition, depending on the menu, such as if a max price is set on a price range menu
   */
  const inUse =
    state.selectedTypes && state.selectedTypes.length > 0 ? true : false;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    closeOnOutsideClick,
    containerRef,
    menuRef,
    setShowMenu,
  });

  /**
   * Set selected items to state and pass them to parent (Multi-select Menu)
   */
  function handleItemClick(item: ListingKindValue): void {
    let items: ListingKindValue[] = [];

    if (
      state.selectedTypes.findIndex((i) =>
        i && item ? i.id === item.id : undefined
      ) >= 0
    ) {
      // Remove selected item if it's the item being clicked (clicking an active item will inactivate it)
      items = removeSelectedItem(item);
    } else {
      // Add inactive item to selected items
      items = [...state.selectedTypes, item];
    }

    dispatch(setSelectedTypes(items));
  }

  /**
   * Remove item from selected item
   * @returns remaining selected items
   */
  function removeSelectedItem(item: ListingKindValue): ListingKindValue[] {
    if (state.selectedTypes.length >= 1) {
      const copy = { ...state };
      return copy.selectedTypes.filter((itm) => {
        if (itm !== null && item !== null) {
          return itm.id !== item.id;
        } else {
          return undefined;
        }
      });
    } else {
      throw new Error(
        "No options have been selected yet. Cannot remove an option from an empty list!"
      );
    }
  }

  function isSelected(item: ListingKindValue): boolean {
    if (state.selectedTypes.length >= 1) {
      const copy = { ...state };
      return (
        copy.selectedTypes?.filter((i) =>
          i && item ? i.id === item.id : undefined
        ).length > 0
      );
    } else {
      return false;
    }
  }

  if (menuKind === "absolute") {
    return (
      <A_CONTAINER
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        inUse={inUse}
        styles={styles}
      >
        {label || "Dropdown"}
        <A_CONTAINER_ICON_WRAP>
          <A_CONTAINER_ICON flipped={state.showMenu} />
        </A_CONTAINER_ICON_WRAP>
        {state.showMenu && state.types ? (
          <A_MENU ref={menuRef} onClick={(e) => e.stopPropagation()}>
            {state.types.map((type, index) => {
              if (type !== null) {
                return (
                  <MENU_ITEM
                    key={index}
                    onClick={() => handleItemClick(type)}
                    isSelected={isSelected(type)}
                  >
                    {type.label}
                  </MENU_ITEM>
                );
              } else {
                return null;
              }
            })}
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
          {state.types.map((type, index) => {
            if (type !== null) {
              return (
                <MENU_ITEM
                  key={index}
                  onClick={() => handleItemClick(type)}
                  isSelected={isSelected(type)}
                >
                  {type.label}
                </MENU_ITEM>
              );
            } else {
              return null;
            }
          })}
        </F_MENU>
      </F_CONTAINER>
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
