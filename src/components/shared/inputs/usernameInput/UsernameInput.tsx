import React, { useState, useRef } from "react";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "./usernameInput.module.scss";
import { ReactComponent as PersonIcon } from "./personIcon.svg";

export interface Username {
  value: string;
  errorMsg: string;
  valid: boolean;
  readOnly: boolean;
  required: boolean;
}

export const initUsername: Username = {
  value: "",
  errorMsg: "",
  valid: false,
  readOnly: false,
  required: true,
};

interface Props {
  value?: string;
  readonly?: boolean;
  emit: (object: Username) => void;
}

export default function UsernameInput(props: Props) {
  const [state, setState] = useState<Username>({
    value: props.value || "",
    errorMsg: "",
    valid: false,
    readOnly: props.readonly || false,
    required: true,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  function validateUsername(value: string): {
    valid: boolean;
    errorMsg: string;
  } {
    //TODO: Define some rules for what a valid username is and check if the username is already being used by another user
    if (value.length >= 1) {
      return { valid: true, errorMsg: "" };
    } else {
      return { valid: false, errorMsg: "Username is too short" };
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { valid } = validateUsername(e.target.value);
    setState((s) => ({
      ...s,
      value: e.target.value,
      valid: valid,
    }));
  }

  function handleBlur(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { valid, errorMsg } = validateUsername(e.target.value);

    const s: typeof state = {
      ...state,
      value: e.target.value,
      readOnly: false, // Make sure to keep the field enabled
      valid: valid,
      errorMsg: errorMsg,
    };

    setState((s) => ({
      ...s,
      value: e.target.value,
      valid: valid,
      errorMsg: errorMsg,
    }));

    console.log("emitting state ", s);

    props.emit(s);
  }

  return (
    <div className={`${styles.container}`}>
      <label
        htmlFor="username"
        className={`${styles.label} ${
          state.value.length > 0 ? styles.active : ""
        }`}
      >
        Username
      </label>

      <div className={`${styles["input-wrap"]}`}>
        <PersonIcon className={styles.icon} />
        <input
          id="username"
          placeholder="Username"
          className={`${styles.input} ${
            state.errorMsg.length > 0 ? "error" : ""
          }`}
          ref={inputRef}
          type={"text"}
          value={state.value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={props.readonly}
          autoComplete="off"
        />
      </div>

      <ErrorMsg errorMsg={state.errorMsg} />
    </div>
  );
}
