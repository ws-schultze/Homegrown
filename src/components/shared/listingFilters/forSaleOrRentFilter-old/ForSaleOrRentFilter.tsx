import React, { useRef } from "react";

import { DropdownStyles, ForSaleOrRentValue } from "../../../../types/index";
import { useAppSelector } from "../../../../redux/hooks";
import { setForSaleOrRent, setShowMenu } from "./forSaleOrRentFilterSlice";
import { useDispatch } from "react-redux";

import useCloseDropdown from "../hooks/useCloseDropdown";
import {
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_MENU,
  F_BTN,
  F_BTN_ICON,
  F_BTN_ICON_WRAP,
  F_CONTAINER,
  F_MENU,
  RADIO,
} from "./forSaleOrRentFilterStyledComponents";
import { A_CONTAINER_ICON } from "../listingTypeFilter/listingTypeFilterStyledComponents";

interface Props {
  menuKind: "absolute" | "flex";
  styles: DropdownStyles;
}

export default function ForSaleOrRentFilter({ menuKind, styles }: Props) {
  const state = useAppSelector((state) => state.forSaleOrRentFilter);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLInputElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    menuKind: menuKind,
    containerRef,
    menuRef,
    setShowMenu,
  });

  function handleSelectedItem(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ForSaleOrRentValue
  ) {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    dispatch(setForSaleOrRent(item));
  }

  if (menuKind === "absolute") {
    return (
      <A_CONTAINER
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        $inUse={state.selectedItem !== null ? true : false}
        styles={styles}
      >
        {state.selectedItem?.label || "For Sale/Rent"}
        <A_CONTAINER_ICON_WRAP>
          <A_CONTAINER_ICON $flipped={state.showMenu} />
        </A_CONTAINER_ICON_WRAP>
        {state.showMenu ? (
          <A_MENU ref={menuRef}>
            {state.menuItems.map((item, i) => {
              if (item !== null) {
                return (
                  <RADIO
                    key={i}
                    onClick={(e) => handleSelectedItem(e, item)}
                    className="listings-filter-btn"
                  >
                    <label>
                      <input
                        ref={menuItemRef}
                        type="radio"
                        checked={
                          state.selectedItem &&
                          state.selectedItem?.id === item.id
                            ? true
                            : false
                        }
                        readOnly
                      />

                      {item.label}
                    </label>
                  </RADIO>
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
      <F_CONTAINER
        ref={containerRef}
        inUse={state.selectedItem !== null ? true : false}
      >
        <F_BTN onClick={() => dispatch(setShowMenu())} styles={styles}>
          {state.selectedItem?.label || "For Sale/Rent"}
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
          {state.menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <RADIO
                  key={i}
                  onClick={(e) => handleSelectedItem(e, item)}
                  className="listings-filter-btn"
                >
                  <label>
                    <input
                      ref={menuItemRef}
                      type="radio"
                      checked={
                        state.selectedItem && state.selectedItem?.id === item.id
                          ? true
                          : false
                      }
                      readOnly
                    />

                    {item.label}
                  </label>
                </RADIO>
              );
            } else {
              return null;
            }
          })}
        </F_MENU>
      </F_CONTAINER>
    );
  }

  return <>Please enter a value for menuKind</>;
}
