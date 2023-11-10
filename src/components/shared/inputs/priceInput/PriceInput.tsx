import React, { useEffect, useRef, useState } from "react";
import {
  formatCompactCurrencyNoDecimal,
  formatUSDCommaSeparatedNoDecimal,
  getKeyDown,
  removeNonNumericChars,
  repositionCursor,
  validateNumber,
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
   * Minimum price that the input can be
   */
  minPrice: number;
  /**
   * For USD consider "$"
   */
  prefix?: string;
  /**
   * Is this price input being used to filter things?
   * If so, there will be no error messages when the input
   * is empty, and the value is always valid.
   */
  isPriceFilter: boolean;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function PriceInput(props: Props) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Prevent cursor jumping white editing input
   */
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const {
      target: { value, selectionStart },
    } = e;

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

    // validate the number and get an error message to display if needed
    const { valid, errorMsg } = validateNumber(
      numNoLeadingZeros,
      props.minPrice,
      undefined
    );

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
      valid: valid,
      errorMsg: errorMsg,
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
        htmlFor="price"
        className={` ${
          props.state.value.length > 0 ? styles.show : styles.hide
        }`}
      >
        {props.placeholder}
      </label>
      <input
        id="price"
        type="text"
        ref={inputRef}
        placeholder={props.placeholder}
        value={props.state.formatted}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
