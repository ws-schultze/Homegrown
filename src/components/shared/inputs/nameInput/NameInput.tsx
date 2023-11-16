import React, { useRef } from "react";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps } from "../inputProps";
import { validateName } from "../utils";

/**
 * Notice that this component only formats objects of Str
 */
export default function NameInput(props: InputProps) {
  // const [state, setState] = useState<Types.Str>(props.state);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Handle component state and emit state to parent component when changes to input are made.
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const { valid, errorMsg } = validateName(value, props.state.required);

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
        value={props.state.value}
        onChange={handleChange}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
