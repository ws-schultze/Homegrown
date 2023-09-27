import React, { useEffect, useRef, useState } from "react";
import assertIsNode from "../../utils/assertIsNode";
import {
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
  RadioBtn,
} from "./styledComponents";

interface State {
  showMenu: boolean;
  selectedItem: MapType;
}

export type MapType =
  | "roadmap"
  | "satellite"
  | "hybrid"
  | "terrain"
  | "stylish"
  | "dark"
  | "desert";

export default function MapTypeDropdown({
  menuItems,
  defaultMapType,
  map,
}: {
  menuItems: MapType[];
  defaultMapType: MapType;
  map: google.maps.Map;
}) {
  const [state, setState] = useState<State>({
    showMenu: false,
    selectedItem: defaultMapType,
  });
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLInputElement | null>(null);

  /**
   * Close the menu when clicking outside of it
   */
  useEffect(() => {
    function handler({ target }: MouseEvent) {
      assertIsNode(target);

      if (
        menuBtnRef.current &&
        menuRef.current &&
        menuBtnRef.current.contains(target) === false &&
        menuRef.current.contains(target) === false
      ) {
        setState((s) => ({ ...s, showMenu: false }));
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  /**
   * Set selected item to state and pass it to parent
   */
  function onItemClick(
    e: React.MouseEvent | React.ChangeEvent,
    item: MapType
  ): void {
    console.log("forSaleOrRent filter clicked");
    // Keep menu from closing when an item is clicked
    e.stopPropagation();

    setState((s) => ({ ...s, selectedItem: item }));

    // =======>>> Change the mapTypeId <<<=======
    map.setMapTypeId(item);
  }

  return (
    <Container
      ref={menuBtnRef}
      onClick={() => setState((s) => ({ ...s, showMenu: !state.showMenu }))}
      $inUse={state.selectedItem !== null ? true : false}
    >
      {state.selectedItem[0].toLocaleUpperCase() +
        state.selectedItem.substring(1) || "Map"}
      <ContainerIconWrap>
        <ContainerIcon $flipped={state.showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <Menu ref={menuRef}>
          {menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <RadioBtn key={i} onClick={(e) => onItemClick(e, item)}>
                  <label>
                    <input
                      ref={menuItemRef}
                      type="radio"
                      checked={
                        state.selectedItem && state.selectedItem === item
                          ? true
                          : false
                      }
                      readOnly
                    />

                    {item[0].toLocaleUpperCase() + item.substring(1)}
                  </label>
                </RadioBtn>
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
