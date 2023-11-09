import React, { useEffect, useRef, useState } from "react";
import {
  formatPhoneNumber,
  removeNonNumericChars,
  repositionCursor,
  validateRealEstateLicenseIdNumber,
} from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import styles from "./inputStr.module.scss";

interface Props<T> {
  state: T;
  placeholder: string;
  groupSeparators: string[];
  handleInput: (state: T) => void;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function PhoneNumberInput<T extends Types.Str>(props: Props<T>) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

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
  }, [cursorPosition]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value, selectionStart },
    } = e;

    //Prevent cursor jumping on "Backspace" and "Delete"
    const { modifiedValue, modifiedCursorPosition } = repositionCursor({
      eventTargetValue: value, // <------ must be e.target.value
      formattedValueFromState: props.state.formatted, // <---- must be state.formatted
      lastKeyDown: lastKeyDown,
      selectionStart: selectionStart,
      groupSeparators: props.groupSeparators,
    });

    const numberStr = removeNonNumericChars(modifiedValue);
    const number = Number(numberStr); // Becomes 123
    const formatted = formatPhoneNumber(numberStr);
    const { valid, errorMsg } = validateRealEstateLicenseIdNumber(value);

    // Prevent cursor jumping when formatting applies a groupSeparator and or prefix
    if (
      modifiedCursorPosition !== undefined &&
      modifiedCursorPosition !== null
    ) {
      const newCursor =
        modifiedCursorPosition + (formatted.length - value.length);

      setCursorPosition(newCursor);
    }

    const s: T = {
      ...props.state,
      value: value,
      formatted: formatted,
      number: number,
      numberStr: numberStr,
      valid: valid,
      errorMsg: errorMsg,
      required: props.state.required,
      beingVerified: false,
      saved: false,
      readOnly: false,
    };

    props.handleInput(s);
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
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
