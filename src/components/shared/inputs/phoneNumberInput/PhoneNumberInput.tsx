import React, { useEffect, useRef, useState } from "react";
import {
  formatPhoneNumber,
  handleKeyDown,
  removeNonNumericChars,
  repositionCursor,
  validatePhoneNumber,
  validateRealEstateLicenseIdNumber,
} from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps } from "../inputProps";

interface Props extends InputProps {
  /**
   * For inputs such as phone number, consider [")", "-"]
   *
   * For money consider [",", "."]
   */
  groupSeparators: string[];
}

/**
 * Notice that this component only formats objects of Str
 */
export default function PhoneNumberInput(props: Props) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Prevent cursor jumping white editing input
   */
  // useEffect(() => {
  //   // Cursor position
  //   if (inputRef === null) return;
  //   if (inputRef.current === null) return;
  //   if (inputRef && inputRef.current) {
  //     inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
  //   }
  // }, [cursorPosition]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value, selectionStart },
    } = e;

    //Prevent cursor jumping on "Backspace" and "Delete"
    const { modifiedValue, modifiedCursorPosition } = repositionCursor({
      eventTargetValue: value,
      formattedValueFromState: props.state.formatted,
      lastKeyDown: lastKeyDown,
      selectionStart: selectionStart,
      groupSeparators: props.groupSeparators,
    });

    const numberStr = removeNonNumericChars(modifiedValue);
    const num = Number(numberStr); // Becomes 123
    const formatted = formatPhoneNumber(numberStr);
    const { valid, errorMsg } = validatePhoneNumber(numberStr);

    // Prevent cursor jumping when formatting applies a groupSeparator and or prefix
    if (
      modifiedCursorPosition !== undefined &&
      modifiedCursorPosition !== null
    ) {
      const newCursor =
        modifiedCursorPosition + (formatted.length - value.length);

      setCursorPosition(newCursor);
    }

    const s: Str = {
      ...props.state,
      value: value,
      formatted: formatted,
      number: num,
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
        onKeyDown={(e) => handleKeyDown(e, setLastKeyDown)}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
