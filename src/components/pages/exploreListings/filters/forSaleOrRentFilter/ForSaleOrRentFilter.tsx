import React, { useEffect, useRef } from "react";

import assertIsNode from "../../../../utils/assertIsNode";
import { ForSaleOrRentValue } from "../../../../../types/index";
import { useAppSelector } from "../../../../../redux/hooks";
import { setForSaleOrRent, setShowMenu } from "./forSaleOrRentSlice";
import { useDispatch } from "react-redux";
import {
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
  Radio,
} from "./styledComponents";

interface Props {
  styles: {
    width: string;
  };
}

export default function ForSaleOrRentFilter({ styles }: Props) {
  const state = useAppSelector((state) => state.forSaleOrRentFilter);
  const dispatch = useDispatch();
  const menuBtnRef = useRef<HTMLDivElement | null>(null);
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
        dispatch(setShowMenu());
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  function handleSelectedItem(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ForSaleOrRentValue
  ) {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    dispatch(setForSaleOrRent(item));
  }

  return (
    <Container
      ref={menuBtnRef}
      onClick={() => dispatch(setShowMenu())}
      $inUse={state.selectedItem !== null ? true : false}
      $styles={{ width: styles.width }}
    >
      {state.selectedItem?.label || "For Sale/Rent"}
      <ContainerIconWrap>
        <ContainerIcon $flipped={state.showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <Menu ref={menuRef}>
          {state.menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <Radio
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
                </Radio>
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
