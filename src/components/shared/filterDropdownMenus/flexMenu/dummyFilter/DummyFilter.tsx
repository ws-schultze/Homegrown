import React, { useEffect, useRef } from "react";
import { DropdownStyles, ListingKindValue } from "../../../../../types/index";
import {
  Container,
  Btn,
  BtnIcon,
  BtnIconWrap,
  Menu,
  MenuItem,
} from "./styledComponents";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { ref } from "firebase/storage";
import {
  setSelectedItems,
  setShowMenu,
} from "../../../../pages/exploreListingsPage/filters/listingTypeFilter/listingTypeFilterSlice";

interface Props {
  styles: DropdownStyles;
}

export default function DummyFilter({ styles }: Props) {
  const state = useAppSelector((state) => state.listingTypeFilter);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement | null>(null);

  /**
   * Close the menu when clicking outside of the container
   */
  useEffect(() => {
    function handler({ target }: MouseEvent) {
      const t = target as Node;

      // container exists
      if (containerRef.current) {
        // the click is not inside the container
        if (containerRef.current.contains(t) === false) {
          // the menu exists
          if (menuRef.current) {
            // the click is not inside the menu
            if (menuRef.current.contains(t) === false) {
              // the menu must be open for it to be closed, otherwise clicking outside the container will just toggle the menu on any click!!
              if (state.showMenu) {
                dispatch(setShowMenu());
              } else
                console.log(
                  "ignoring the urge to close an already closed menu!!"
                );
            } else console.log("menuRef.current.contains(t) !== false");
          } else console.log("menuRef.current is undefined");
        } else console.log("containerRef.current.contains(t) !== false");
      } else console.log("containerRef.current is undefined");
    } // end handler

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
      ref={containerRef}
      inUse={
        state.selectedItems && state.selectedItems.length > 0 ? true : false
      }
    >
      <Btn onClick={() => dispatch(setShowMenu())} styles={styles}>
        Listing Type
        <BtnIconWrap>
          <BtnIcon $flipped={state.showMenu} />
        </BtnIconWrap>
      </Btn>

      <Menu
        className={state.showMenu ? "open" : "closed"}
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
    </Container>
  );
}
