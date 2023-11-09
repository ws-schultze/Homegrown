import React, { useRef } from "react";
import { validateEmail } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import styles from "./inputStr.module.scss";

interface Props<T> {
  state: T;
  placeholder: string;
  handleInput: (state: T) => void;
}

export default function EmailStrInput<T extends Types.Str>(props: Props<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const { valid, errorMsg } = validateEmail(value);

    const s: T = {
      ...props.state,
      value: value,
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
