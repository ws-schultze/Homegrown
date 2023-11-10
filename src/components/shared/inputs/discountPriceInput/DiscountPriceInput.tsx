import React, { useEffect, useRef, useState } from "react";
import {
  formatCommaSeparatedWithDecimal,
  formatCompactCurrencyNoDecimal,
  formatUSDCommaSeparatedNoDecimal,
  getKeyDown,
  removeNonNumericChars,
  repositionCursor,
} from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps } from "../inputProps";

interface Props extends InputProps {
  /**
   * Price object from that parent/redux
   */
  state: Str;
  /**
   * For money consider [",", "."]
   */
  groupSeparators?: string[];
  /**
   * Original price of the item getting a price change
   */
  originalPrice: number;
  /**
   * Must match the prefix of the original price
   *
   * For USD consider "$"
   */
  prefix: string;
}

export default function DiscountPriceInput(props: Props) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [formattedPercent, setFormattedPercent] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (props.originalPrice === undefined) {
    throw new Error("originalPrice must be defined if isPriceChange===true");
  }

  /**
   * Prevent cursor jumping white editing input
   */
  useEffect(() => {
    // Cursor position
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }

    // Discount price
    if (props.originalPrice && props.state.number) {
      const percent = (
        (props.state.number / props.originalPrice) * 100 -
        100
      ).toFixed(2);
      setPriceChangePercent(Number(percent));
      const cleanPercent = removeNonNumericChars(percent);
      const formattedPercent = formatCommaSeparatedWithDecimal(cleanPercent);
      setFormattedPercent(formattedPercent);
    }

    // original price is not set and the user tries entering a discount
    if (props.originalPrice === 0 && props.state.number >= 1) {
      const s: typeof props.state = {
        ...props.state,
        valid: false,
        errorMsg: "Listing price must be set first",
      };

      props.handleInput(s);
    }

    // user enters a discount price after the original price has been set
    if (props.originalPrice !== undefined && props.originalPrice > 0) {
      const s: typeof props.state = {
        ...props.state,
        errorMsg: "",
      };

      props.handleInput(s);
    }
  }, [cursorPosition]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value, selectionStart },
    } = e;

    if (props.originalPrice !== undefined && props.originalPrice === 0) {
      const s: typeof props.state = {
        ...props.state,
        errorMsg: "Listing price must be set first",
      };

      props.handleInput(s);
    }

    // Prevent cursor jumping on "Backspace" and "Delete"
    const { modifiedValue, modifiedCursorPosition } = repositionCursor({
      eventTargetValue: value,
      formattedValueFromState: props.state.formatted,
      lastKeyDown: lastKeyDown,
      selectionStart: selectionStart,
      groupSeparators: props.groupSeparators,
    });

    // Get rid of non numeric characters
    const numStr = removeNonNumericChars(modifiedValue);
    // Get rid of leading zero because this price does not have decimal values
    const numNoLeadingZeros = Number(numStr);
    // Make a string out of the number without leading zeros
    const numStrNoLeadingZeros = numNoLeadingZeros.toString();
    // Format the number into USD comma separated with no decimal
    const fmt = formatUSDCommaSeparatedNoDecimal(numNoLeadingZeros);
    // If the formatted value is zero dollars, clear the input field
    const _formatted = fmt === "$0" ? "" : fmt;
    // Create a short formatted version of the
    // number's string representation and avoid
    // formatting an empty string
    const _shortFormatted =
      numStrNoLeadingZeros === "" ? "" : formatCompactCurrencyNoDecimal(numStr);

    // Hide the prefix when no amount is present
    let _value = value;
    if (value === props.prefix) {
      _value = "";
    }

    // Store the cursor position to state, while taking
    // into account a groupSeparator and or prefix.
    if (
      modifiedCursorPosition !== undefined &&
      modifiedCursorPosition !== null
    ) {
      let newCursor =
        modifiedCursorPosition + (_formatted.length - value.length);

      newCursor =
        newCursor <= 0 ? (props.prefix ? props.prefix.length : 0) : newCursor;

      setCursorPosition(newCursor);
    }

    const s: Str = {
      ...props.state,
      value: _value,
      formatted: _formatted,
      number: numNoLeadingZeros,
      shortFormatted: _shortFormatted,
      numberStr: numStrNoLeadingZeros,
      valid: true,
      errorMsg: "",
      required: props.state.required,
      beingVerified: false,
      saved: false,
      readOnly: false,
    };

    props.handleInput(s);
  }

  /**
   * Set last key down to state.
   * Without this, the cursor will get stuck behind a group separator
   * because repositionCursor() won't work right.
   */
  function handleKeyDown(e: React.KeyboardEvent<Element>) {
    const lastKeyDown: string = getKeyDown(e);
    setLastKeyDown(lastKeyDown);
  }

  return (
    <div className={styles.container}>
      <label
        className={` ${
          props.state.value.length > 0 ? styles.show : styles.hide
        }`}
      >
        {props.placeholder}
      </label>
      <input
        placeholder={props.placeholder}
        ref={inputRef}
        type="text"
        value={props.state.formatted}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={props.state.readOnly}
      />

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

      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
