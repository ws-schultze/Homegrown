import React, { useEffect, useRef } from "react";
import { DropdownStyles, ListingKindValue } from "../../../../../types/index";
import {
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
  MenuItem,
} from "./styledComponents";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setSelectedItems, setShowMenu } from "./listingTypeFilterSlice";

interface Props {
  styles: DropdownStyles;
}

export default function ListingsTypeFilter({ styles }: Props) {
  const state = useAppSelector((state) => state.listingTypeFilter);
  const dispatch = useDispatch();

  const menuWrapRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement | null>(null);

  /**
   * Close the menu when clicking outside of it
   */
  useEffect(() => {
    function handler({ target }: MouseEvent) {
      function assertIsNode(e: EventTarget | null): asserts e is Node {
        if (!e || !("nodeType" in e)) {
          throw new Error(`Node expected`);
        }
      }

      assertIsNode(target);

      // 1) Hide menu when clicking outside of the filter btn and menu div
      // 2) Emit listing kinds to parent
      if (
        menuWrapRef.current &&
        menuWrapRef.current.contains(target) === false &&
        menuRef.current &&
        menuRef.current.contains(target) === false
      ) {
        // setState((s) => ({ ...s, showMenu: false }));
        // emitSelectedItems(state.selectedItems);
        dispatch(setShowMenu());
        // dispatch(setSelectedItems())
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
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

    // setState((s) => ({ ...s, selectedItems: items }));
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

  return (
    <Container
      ref={menuWrapRef}
      onClick={() => dispatch(setShowMenu())}
      $inUse={
        state.selectedItems && state.selectedItems.length > 0 ? true : false
      }
      styles={styles}
    >
      Listing Type
      <ContainerIconWrap>
        <ContainerIcon $flipped={state.showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <Menu
          styles={styles}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.menuItems.map((item, index) => {
            if (item !== null) {
              return (
                <MenuItem
                  ref={menuItemRef}
                  key={index}
                  onClick={() => handleItemClick(item)}
                  $isSelected={isSelected(item)}
                >
                  {item.label}
                </MenuItem>
              );
            } else {
              return null;
            }
          })}
        </Menu>
      ) : null}
    </Container>
  );
}
