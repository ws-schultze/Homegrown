import React, { useEffect, useState, useRef } from "react";
import { validatePassword } from "./utils";
import ErrorMsg from "../../pages/createListing/components/ErrorMsg";
import { ReactComponent as VisibilityIcon } from "./assets/visibilityIcon.svg";
import "./styles.css";

interface Props {
  emit: (object: Password) => void;
}

export interface Password {
  value: string;
  beingVerified: boolean;
  errorMsg: string;
  valid: boolean;
  saved: boolean;
  readOnly: boolean;
  required: boolean;
}

export const initPassword = {
  value: "",
  beingVerified: false,
  errorMsg: "",
  valid: false,
  saved: false,
  readOnly: false,
  required: true,
};

export default function PasswordInput(props: Props) {
  const [state, setState] = useState<Password>(initPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  /**
   * Prevent cursor jumping white editing input
   */
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      // inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    // if (formatType === "email") {
    //     // Email
    //     _formatted = value;
    //     const { valid, errorMsg } = validateEmail(value);
    //     _valid = valid;
    //     _errorMsg = errorMsg;
    //   } else

    const { valid, errorMsg } = validatePassword(e.target.value);
    const s: Password = {
      value: e.target.value,
      valid: valid,
      errorMsg: errorMsg,
      required: true,
      beingVerified: false,
      saved: false,
      readOnly: false,
    };
    setState(s);
  }

  function handleBlur(): void {
    props.emit(state);
  }

  return (
    <div className={`container`}>
      <label
        htmlFor="password"
        className={`${state.value.length > 0 ? "active" : ""}`}
      >
        Password
      </label>

      <div className={`input-wrap`}>
        <input
          id="password"
          placeholder="Password"
          className={`${state.errorMsg.length > 0 ? "error" : ""}`}
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          value={state.value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={false}
        />
        <VisibilityIcon
          className={`visibility-icon`}
          onClick={() => setShowPassword((sp) => !sp)}
        />
      </div>

      <ErrorMsg errorMsg={state.errorMsg} />
    </div>
  );
}
