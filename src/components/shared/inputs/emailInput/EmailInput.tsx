import React, { useEffect, useState, useRef } from "react";

import ErrorMsg from "../../errorMsg/ErrorMsg";
import { ReactComponent as EnvelopeIcon } from "./envelopeIcon.svg";
import styles from "./emailInputStyles.module.scss";
import isEmail from "validator/lib/isEmail";

export interface Email {
  value: string;
  errorMsg: string;
  valid: boolean;
  readOnly: boolean;
  required: boolean;
}

export const initEmail = {
  value: "",
  errorMsg: "",
  valid: false,
  readOnly: false,
  required: true,
};

interface Props {
  value?: string;
  readonly?: boolean;
  emit: (object: Email) => void;
}

export default function EmailInput(props: Props) {
  const [state, setState] = useState<Email>({
    value: props.value || "",
    errorMsg: "",
    valid: false,
    readOnly: props.readonly || false,

    required: true,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  function validateEmail(value: string): {
    valid: boolean;
    errorMsg: string;
  } {
    if (isEmail(value)) {
      return { valid: true, errorMsg: "" };
    } else {
      return { valid: false, errorMsg: "Enter a valid email" };
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { valid } = validateEmail(e.target.value);
    setState((s) => ({
      ...s,
      value: e.target.value,
      valid: valid,
    }));
  }

  function handleBlur(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { valid, errorMsg } = validateEmail(e.target.value);

    setState((s) => ({
      ...s,
      value: e.target.value,
      valid: valid,
      errorMsg: errorMsg,
    }));

    props.emit(state);
  }

  return (
    <div className={`${styles.container}`}>
      <label
        htmlFor="email"
        className={`${styles.label} ${
          state.value.length > 0 ? styles.active : ""
        }`}
      >
        Email
      </label>

      <div className={`${styles["input-wrap"]}`}>
        <EnvelopeIcon className={styles.icon} />
        <input
          id="email"
          placeholder="Email"
          className={`${styles.input} ${
            state.errorMsg.length > 0 ? "error" : ""
          }`}
          ref={inputRef}
          type={"text"}
          value={state.value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={props.readonly}
          autoComplete="on"
        />
      </div>

      <ErrorMsg errorMsg={state.errorMsg} />
    </div>
  );
}
