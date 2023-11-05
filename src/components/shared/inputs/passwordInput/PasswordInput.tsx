import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import { ReactComponent as VisibilityIcon } from "./assets/visibilityIcon.svg";
import styles from "./passwordInput.module.scss";
import { ReactComponent as LockIcon } from "./assets/lockIcon.svg";
import { ref } from "firebase/storage";

interface Props {
  emit: (object: Password) => void;
}

export interface Password {
  value: string;
  errorMsg: string;
  valid: boolean;
  readOnly: boolean;
  required: boolean;
}

export const initPassword = {
  value: "",
  errorMsg: "",
  valid: false,
  readOnly: false,
  required: true,
};

export default function PasswordInput(props: Props) {
  const [state, setState] = useState<Password>(initPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [cursorPosition, setCursorPosition] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const visBtnRef = useRef<HTMLButtonElement | null>(null);

  function validatePassword(value: string): {
    valid: boolean;
    errorMsg: string;
  } {
    //TODO: Decide what constraints and requirements a password should have
    if (value.length < 12) {
      return { valid: false, errorMsg: "Must be at least 12 characters" };
    }
    return { valid: false, errorMsg: "" };
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { valid, errorMsg } = validatePassword(e.target.value);
    setState((s) => ({
      ...s,
      value: e.target.value,
      valid: valid,
      errorMsg: errorMsg,
    }));

    // setCursorPosition(e.target.selectionStart);
  }

  function handleVisibilityClick() {
    setShowPassword(!showPassword);

    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <div className={`${styles.container}`}>
      <label
        htmlFor="password"
        className={`${styles.label} ${
          state.value.length > 0 ? styles.active : ""
        }`}
      >
        Password
      </label>

      <div className={`${styles["input-wrap"]}`}>
        <LockIcon className={styles.icon} />
        <input
          id="password"
          placeholder="Password"
          className={`${styles.input} ${
            state.errorMsg.length > 0 ? "error" : ""
          }`}
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          value={state.value}
          onChange={handleChange}
          onBlur={() => props.emit(state)}
          disabled={false}
        />
        <button
          type="button"
          ref={visBtnRef}
          className={styles.visibility_icon_container}
          onClick={handleVisibilityClick}
        >
          <VisibilityIcon className={`${styles["visibility-icon"]}`} />
        </button>
      </div>

      <ErrorMsg errorMsg={state.errorMsg} />
    </div>
  );
}
