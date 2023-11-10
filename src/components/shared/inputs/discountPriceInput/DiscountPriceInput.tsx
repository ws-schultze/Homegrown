import React, { useEffect, useRef, useState } from "react";
import {
  formatCommaSeparatedWithDecimal,
  formatCompactCurrencyNoDecimal,
  formatPriceOnChange,
  formatUSDCommaSeparatedNoDecimal,
  getKeyDown,
  handleKeyDown,
  removeNonNumericChars,
  repositionCursor,
} from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps, PriceInputProps } from "../inputProps";
import useDiscountPriceErrorMessages from "./hooks/useDiscountPriceErrorMessages";
import useFormatDiscountPricePercentage from "./hooks/useFormatDiscountPricePercentage";
import useSetCursorPosition from "./hooks/useSetCursorPosition";

interface Props extends PriceInputProps {
  /**
   * The price that the discount price is being compared to
   */
  originalPrice: number;
}

export default function DiscountPriceInput(props: Props) {
  const [lastKeyDown, setLastKeyDown] = useState("");
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [formattedPercent, setFormattedPercent] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  // useSetCursorPosition(inputRef, cursorPosition);

  // TODO: Setting cursor position with setSelectionRange() causes the input
  // to be in focus, if it is the last component rendered that uses this hook.
  // Figure out how to have cursor position memory on render with inputs
  // that have dynamically formatted input.

  useFormatDiscountPricePercentage(
    props.state,
    props.originalPrice,
    setPriceChangePercent,
    setFormattedPercent
  );

  useDiscountPriceErrorMessages(
    props.state,
    props.originalPrice,
    props.handleInput
  );

  return (
    <div className={styles.container}>
      <label
        className={` ${props.state.number > 0 ? styles.show : styles.hide}`}
      >
        {props.placeholder}
      </label>
      <input
        placeholder={props.placeholder}
        ref={inputRef}
        type="text"
        value={props.state.formatted}
        onChange={(e) =>
          formatPriceOnChange({
            e,
            priceState: props.state,
            isDiscountPrice: props.isDiscountPrice,
            lastKeyDown,
            groupSeparators: props.groupSeparators,
            minPrice: props.minPrice,
            currency: props.currency,
            prefix: props.prefix,
            setCursorPosition,
            handleInput: props.handleInput,
          })
        }
        onKeyDown={(e) => handleKeyDown(e, setLastKeyDown)}
        disabled={props.state.readOnly}
      />
      {props.state.errorMsg.length === 0 ? (
        <div
          className={`${styles.price_change_percent} ${
            props.state.formatted.length > 0 ? styles.show : styles.hide
          } ${priceChangePercent < 0 ? styles.decrease : styles.increase}`}
        >
          {formattedPercent}%{" "}
          {priceChangePercent < 0
            ? "Decrease"
            : priceChangePercent === 0
            ? "Change"
            : priceChangePercent > 0
            ? "Increase"
            : ""}
        </div>
      ) : null}

      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
