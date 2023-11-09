import React, { useRef } from "react";
import { validateName } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import styles from "./inputStr.module.scss";

interface Props<T> {
  /**
   * If this is used for a first name input, the state will be the first name object of type str
   */
  state: T;
  //   fieldName: keyof T;
  placeholder?: string;
  //   emit: (name: Types.Str, key: keyof T) => void;
  handleInput: (state: T) => void;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function NameInput<T extends Types.Str>(props: Props<T>) {
  //   const [state, setState] = useState<Types.Str>(props.state);
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
