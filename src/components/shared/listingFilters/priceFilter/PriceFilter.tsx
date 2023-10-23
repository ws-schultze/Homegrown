import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles, Str } from "../../../../types/index";

import {
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_CONTAINER_ICON,
  A_MENU,
} from "./styledComponents/absolute";

import {
  F_BTN,
  F_BTN_ICON,
  F_BTN_ICON_WRAP,
  F_CONTAINER,
  F_MENU,
} from "./styledComponents/flex";
import { setShowMenu, setPriceRange } from "./slice";
import { initStrOpt } from "../../../../initialValues";
import InputStr from "../../inputs/inputStr/InputStr";
import { APPLY_FILTER_BTN } from "./styledComponents/applyFilterBtn";

interface Props {
  menuKind: "absolute" | "flex";
  styles: DropdownStyles;
  label: string;
}

interface LocalState {
  lowPrice: Str;
  highPrice: Str;
}

const initialLocalState: LocalState = {
  lowPrice: initStrOpt,
  highPrice: initStrOpt,
};

export default function PriceFilter({ menuKind, styles, label }: Props) {
  const state = useAppSelector((state) => state.priceFilter);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // local state gets dispatched when the filter is applied
  // this prevents excessive updates to redux store
  const [localState, setLocalState] = useState<LocalState>(initialLocalState);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    menuKind: menuKind,
    containerRef,
    menuRef,
    setShowMenu,
    reducers: [
      setPriceRange({
        lowPrice: localState.lowPrice,
        highPrice: localState.highPrice,
      }),
    ],
  });

  function handleInputStr(object: Str, fieldName: keyof typeof state) {
    setLocalState((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

  if (menuKind === "absolute") {
    return (
      <A_CONTAINER
        ref={containerRef}
        onClick={() =>
          // Be sure to use the setShowMenu function that is defined
          // in the slice being used
          dispatch(setShowMenu())
        }
        inUse={
          state.highPrice?.value === "" && state.lowPrice?.value === ""
            ? false
            : true
        }
        styles={styles}
      >
        {(state.lowPrice && state.lowPrice.number >= 1) ||
        (state.highPrice && state.highPrice.number >= 1) ? (
          <>
            {state.lowPrice?.shortFormatted} {" - "}{" "}
            {state.highPrice?.shortFormatted}
          </>
        ) : (
          label
        )}
        <A_CONTAINER_ICON_WRAP>
          <A_CONTAINER_ICON flipped={state.showMenu} />
        </A_CONTAINER_ICON_WRAP>
        {state.showMenu ? (
          <A_MENU ref={menuRef} onClick={(e) => e.stopPropagation()}>
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

            <APPLY_FILTER_BTN
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
            </APPLY_FILTER_BTN>
          </A_MENU>
        ) : null}
      </A_CONTAINER>
    );
  }

  if (menuKind === "flex") {
    return (
      <F_CONTAINER ref={containerRef} inUse={state.inUse}>
        <F_BTN
          onClick={() =>
            // Be sure to use the setShowMenu function that is defined
            // in the slice being used
            dispatch(setShowMenu())
          }
          styles={styles}
        >
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

          <APPLY_FILTER_BTN
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
          </APPLY_FILTER_BTN>
        </F_MENU>
      </F_CONTAINER>
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
