import React, { useEffect, useRef, useState } from "react";
import styles from "../../../shared/inputs/scss/inputs.module.scss";
import { InputProps } from "../../../shared/inputs/inputProps";
import { Str } from "../../../../types";
import { getKeyDown } from "../../../shared/inputs/utils";
import ErrorMsg from "../../../shared/errorMsg/ErrorMsg";

export default function TestInput(props: InputProps) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Prevent cursor jumping white editing input
   * ================== WARNING ===================================
   * THIS EFFECT MAKES SAFARI FOCUS ON THIS COMPONENT ON RENDER !!!
   */
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    const obj: Str = {
      ...props.state,
      value: value,
    };

    props.handleInput(obj);
  }

  function handleKeyDown(e: React.KeyboardEvent<Element>) {
    const lastKeyDown: string = getKeyDown(e);
    setLastKeyDown(lastKeyDown);
  }

  return (
    <div className={styles.container}>
      <label
        htmlFor="test-input"
        className={` ${
          props.state.value.length > 0 ? styles.show : styles.hide
        }`}
      >
        {props.placeholder}
      </label>
      <input
        id="test-input"
        type="text"
        ref={inputRef}
        placeholder={props.placeholder}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
