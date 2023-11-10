import React, { useRef, useState } from "react";
import { validateDescription } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps } from "../inputProps";
import { initStrReq } from "../../../../initialValues";

interface Props extends InputProps {
  /**
   * Minimum length a description input must have
   */
  minDescriptionLength: number;
  /**
   * Maximum length a description input must have
   */
  maxDescriptionLength: number;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function DescriptionInput(props: Props) {
  const [localState, setLocalState] = useState<Str>(initStrReq);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const { valid, errorMsg } = validateDescription(
      value,
      props.minDescriptionLength,
      props.maxDescriptionLength
    );

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
      <textarea
        placeholder={props.placeholder}
        ref={textareaRef}
        value={props.state.value}
        onChange={handleChange}
        disabled={props.state.readOnly}
        maxLength={props.maxDescriptionLength}
      />
      <div>
        {props.minDescriptionLength !== undefined ? (
          <div className={styles.subtext}>
            <small>Min {props.minDescriptionLength} characters</small>
            <small>
              {props.minDescriptionLength - props.state.value.length >= 0
                ? props.minDescriptionLength - props.state.value.length
                : 0}{" "}
              needed.
            </small>
          </div>
        ) : null}
      </div>
      <div>
        {props.maxDescriptionLength !== undefined ? (
          <div className={styles.subtext}>
            <small>Max {props.maxDescriptionLength} characters</small>
            <small>
              {props.maxDescriptionLength - props.state.value.length} remaining.
            </small>
          </div>
        ) : null}
      </div>
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
