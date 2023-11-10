import React, { useRef } from "react";
import { validateRealEstateLicenseIdNumber } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";

interface Props {
  state: Str;
  placeholder: string;
  handleInput: (state: Str) => void;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function AgentLicenseIdInput(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const { valid, errorMsg } = validateRealEstateLicenseIdNumber(value);

    const s: Str = {
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
