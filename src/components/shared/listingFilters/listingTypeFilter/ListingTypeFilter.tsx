import { useEffect, useRef } from "react";
import { DropdownStyles, ListingKindValue } from "../../../../types/index";
import {
  F_CONTAINER,
  F_BTN,
  F_BTN_ICON_WRAP,
  F_BTN_ICON,
  F_MENU,
  A_MENU,
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_MENU_ITEM,
  F_MENU_ITEM,
  A_CONTAINER_ICON,
} from "./listingTypeFilterStyledComponents";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setSelectedItems, setShowMenu } from "./listingTypeFilterSlice";
import useCloseDropdown from "../hooks/useCloseDropdown";

interface Props {
  menuKind: "absolute" | "flex";
  styles: DropdownStyles;
}

export default function ListingTypeFilter({ menuKind, styles }: Props) {
  const state = useAppSelector((state) => state.listingTypeFilter);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    menuKind: menuKind,
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
      state.selectedItems.findIndex((i) =>
        i && item ? i.id === item.id : undefined
      ) >= 0
    ) {
      // Remove selected item if it's the item being clicked (clicking an active item will inactivate it)
      items = removeSelectedItem(item);
    } else {
      // Add inactive item to selected items
      items = [...state.selectedItems, item];
    }

    dispatch(setSelectedItems(items));
  }

  /**
   * Remove item from selected item
   * @returns remaining selected items
   */
  function removeSelectedItem(item: ListingKindValue): ListingKindValue[] {
    if (state.selectedItems.length >= 1) {
      const copy = { ...state };
      return copy.selectedItems.filter((itm) => {
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
    if (state.selectedItems.length >= 1) {
      const copy = { ...state };
      return (
        copy.selectedItems?.filter((i) =>
          i && item ? i.id === item.id : undefined
        ).length > 0
      );
    } else {
      return false;
    }
  }

  if (menuKind === "flex") {
    return (
      <F_CONTAINER
        ref={containerRef}
        inUse={
          state.selectedItems && state.selectedItems.length > 0 ? true : false
        }
      >
        <F_BTN onClick={() => dispatch(setShowMenu())} styles={styles}>
          Listing Type
          <F_BTN_ICON_WRAP>
            <F_BTN_ICON $flipped={state.showMenu} />
          </F_BTN_ICON_WRAP>
        </F_BTN>

        <F_MENU
          className={state.showMenu ? "open" : "closed"}
          styles={styles}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.menuItems.map((item, index) => {
            if (item !== null) {
              return (
                <F_MENU_ITEM
                  ref={menuItemRef}
                  key={index}
                  onClick={() => handleItemClick(item)}
                  $isSelected={isSelected(item)}
                >
                  {item.label}
                </F_MENU_ITEM>
              );
            } else {
              return null;
            }
          })}
        </F_MENU>
      </F_CONTAINER>
    );
  }

  if (menuKind === "absolute") {
    return (
      <A_CONTAINER
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        $inUse={
          state.selectedItems && state.selectedItems.length > 0 ? true : false
        }
        styles={styles}
      >
        Listing Type
        <A_CONTAINER_ICON_WRAP>
          <A_CONTAINER_ICON $flipped={state.showMenu} />
        </A_CONTAINER_ICON_WRAP>
        {state.showMenu ? (
          <A_MENU
            styles={styles}
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            {state.menuItems.map((item, index) => {
              if (item !== null) {
                return (
                  <A_MENU_ITEM
                    ref={menuItemRef}
                    key={index}
                    onClick={() => handleItemClick(item)}
                    $isSelected={isSelected(item)}
                  >
                    {item.label}
                  </A_MENU_ITEM>
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

  return (
    <>
      <p>Please specify menuKind</p>
    </>
  );
}
