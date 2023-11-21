import React, { useEffect, useRef, useState } from "react";
import assertIsNode from "../../utils/assertIsNode";
import {
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
  RadioBtn,
} from "./styledComponents";
import { MapType, MapTypeMenuState } from "./mapTypeMenuSlice";

export default function MapTypeMenu({
  map,
  showMenu,
  menuItems,
  selectedItem,
  emitShowMenu,
  emitSelectedItem,
}: {
  map: google.maps.Map;
  showMenu: boolean;
  menuItems: MapType[];
  selectedItem: MapType;
  emitShowMenu: (showMenu: boolean) => void;
  emitSelectedItem: (item: MapType) => void;
}) {
  const [state, setState] = useState<MapTypeMenuState>({
    showMenu: showMenu,
    menuItems: menuItems,
    selectedItem: selectedItem,
  });
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setState({
      showMenu: showMenu,
      menuItems: menuItems,
      selectedItem: selectedItem,
    });
  }, [map, showMenu, menuItems, selectedItem]);

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
        // setState((s) => ({ ...s, showMenu: false }));
        emitShowMenu(!showMenu);
        // dispatch(setShowMapTypeMenu());
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
    // Keep menu from closing when an item is clicked
    e.stopPropagation();

    // setState((s) => ({ ...s, selectedItem: item }));
    // dispatch(setMapType(item));
    emitSelectedItem(item);
    map.setMapTypeId(item);
  }

  return (
    <Container
      id="map-type-menu"
      ref={menuBtnRef}
      // onClick={() => setState((s) => ({ ...s, showMenu: !state.showMenu }))}
      // onClick={() => dispatch(setShowMapTypeMenu())}
      onClick={() => emitShowMenu(!showMenu)}
      // $inUse={state.selectedItem !== null ? true : false}
      $inUse={selectedItem !== null ? true : false}
    >
      {state.selectedItem[0].toLocaleUpperCase() + selectedItem.substring(1) ||
        "Map"}
      <ContainerIconWrap>
        <ContainerIcon $flipped={showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <Menu ref={menuRef}>
          {state.menuItems.map((item, i) => {
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
