import React, { useEffect, useRef } from "react";
import {
  BedBathBtn,
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
  MenuSection,
  MenuSectionWrap,
} from "./styledComponents";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setBaths, setBeds, setShowMenu } from "./bedAndBathFilterSlice";
import { DropdownStyles } from "../../../../../types";

interface Props {
  styles: DropdownStyles;
}

export default function BedAndBathFilter({ styles }: Props) {
  const state = useAppSelector((state) => state.bedAndBathFilter);
  const dispatch = useDispatch();
  const menuWrapRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
        dispatch(setShowMenu());
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
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

  return (
    <Container
      ref={menuWrapRef}
      onClick={() => dispatch(setShowMenu())}
      $inUse={state.baths! > 0 || state.beds! > 0 ? true : false}
      styles={styles}
    >
      Beds & Baths
      <ContainerIconWrap>
        <ContainerIcon $flipped={state.showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <Menu
          styles={styles}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuSectionWrap>
            <header>Number of Bedrooms</header>
            <MenuSection>
              <BedBathBtn
                $isSelected={state.beds === 1 ? true : false}
                onClick={(e) => handleNumBeds(e, 1)}
              >
                1+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.beds === 2 ? true : false}
                onClick={(e) => handleNumBeds(e, 2)}
              >
                2+
              </BedBathBtn>{" "}
              <BedBathBtn
                $isSelected={state.beds === 3 ? true : false}
                onClick={(e) => handleNumBeds(e, 3)}
              >
                3+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.beds === 4 ? true : false}
                onClick={(e) => handleNumBeds(e, 4)}
              >
                4+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.beds === 5 ? true : false}
                onClick={(e) => handleNumBeds(e, 5)}
              >
                5+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.beds == null ? true : false}
                onClick={(e) => handleNumBeds(e, null)}
              >
                Any
              </BedBathBtn>
            </MenuSection>
          </MenuSectionWrap>
          <MenuSectionWrap>
            <header>Number of Bathrooms</header>
            <MenuSection>
              <BedBathBtn
                $isSelected={state.baths === 1 ? true : false}
                onClick={(e) => handleNumBaths(e, 1)}
              >
                1+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.baths === 1.5 ? true : false}
                onClick={(e) => handleNumBaths(e, 1.5)}
              >
                1.5+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.baths === 2 ? true : false}
                onClick={(e) => handleNumBaths(e, 2)}
              >
                2+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.baths === 2.5 ? true : false}
                onClick={(e) => handleNumBaths(e, 2.5)}
              >
                2.5+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.baths === 3 ? true : false}
                onClick={(e) => handleNumBaths(e, 3)}
              >
                3+
              </BedBathBtn>
              <BedBathBtn
                $isSelected={state.baths == null ? true : false}
                onClick={(e) => handleNumBaths(e, null)}
              >
                Any
              </BedBathBtn>
            </MenuSection>
          </MenuSectionWrap>
        </Menu>
      ) : null}
    </Container>
  );
}
