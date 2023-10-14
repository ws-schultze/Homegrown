import { useEffect, useRef, useState } from "react";
import InputStr from "../../../../shared/inputs/inputStr/InputStr";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setPriceRange, setShowMenu } from "./priceFilterSlice";

import {
  ApplyFilterBtn,
  Container,
  ContainerIcon,
  ContainerIconWrap,
  Menu,
} from "./styledComponents";
import { initStrOpt } from "../../../../../initialValues";
import { Str } from "../../../../../types/index";

interface LocalState {
  lowPrice: Str;
  highPrice: Str;
}

const initialLocalState: LocalState = {
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export default function PriceFilter(): JSX.Element {
  const state = useAppSelector((state) => state.priceFilter);
  const dispatch = useDispatch();

  // local state gets dispatched when the filter is applied
  // this prevents excessive updates to redux store
  const [localState, setLocalState] = useState<LocalState>(initialLocalState);

  const containerRef = useRef<HTMLDivElement | null>(null);
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

      // Hide menu when clicking outside of the filter btn and menu div
      if (
        containerRef.current &&
        menuRef.current &&
        containerRef.current.contains(target) === false &&
        menuRef.current.contains(target) === false
      ) {
        dispatch(
          setPriceRange({
            lowPrice: localState.lowPrice,
            highPrice: localState.highPrice,
          })
        );
        dispatch(setShowMenu());
      }
    }

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
    setLocalState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  return (
    <Container
      ref={containerRef}
      onClick={() => dispatch(setShowMenu())}
      $inUse={
        state.highPrice?.value === "" && state.lowPrice?.value === ""
          ? false
          : true
      }
    >
      {(state.lowPrice && state.lowPrice.number >= 1) ||
      (state.highPrice && state.highPrice.number >= 1) ? (
        <>
          {state.lowPrice?.shortFormatted} {" - "}{" "}
          {state.highPrice?.shortFormatted}
        </>
      ) : (
        "Price Range"
      )}

      <ContainerIconWrap>
        <ContainerIcon $flipped={state.showMenu} />
      </ContainerIconWrap>
      {state.showMenu ? (
        <>
          <Menu ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <InputStr<typeof state>
              size="lg"
              fieldName="lowPrice"
              groupSeparators={[","]}
              formatType="USD-no-decimal-filter"
              prefix="$"
              min={1}
              isPriceChange={false}
              placeholder={"Low Price"}
              parent={state.lowPrice}
              emit={handleInputStr}
            />

            <InputStr<typeof state>
              size="lg"
              fieldName="highPrice"
              groupSeparators={[","]}
              formatType="USD-no-decimal-filter"
              prefix="$"
              min={1}
              isPriceChange={false}
              placeholder={"High Price"}
              parent={state.highPrice || initStrOpt}
              emit={handleInputStr}
            />

            <ApplyFilterBtn
              onClick={() => {
                dispatch(
                  setPriceRange({
                    lowPrice: localState.lowPrice,
                    highPrice: localState.highPrice,
                  })
                );
                dispatch(setShowMenu());
              }}
            >
              Apply
            </ApplyFilterBtn>
          </Menu>
        </>
      ) : null}
    </Container>
  );
}
