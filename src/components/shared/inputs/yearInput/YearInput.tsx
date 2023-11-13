import React, { useRef } from "react";
import { formatYear, removeNonNumericChars, validateNumber } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Str } from "../../../../types";
import { InputProps } from "../inputProps";

interface Props extends InputProps {
  min?: number;
  max: number;
}

export default function YearInput(props: Props) {
  //   const [cursorPosition, setCursorPosition] = useState(0);
  //   const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const numberStr = removeNonNumericChars(value);
    const num = Number(numberStr);
    const formatted = formatYear(numberStr, 4);
    const { valid, errorMsg } = validateNumber(num, props.min, props.max);

    const s: Str = {
      ...props.state,
      value: value,
      formatted: formatted,
      number: num,
      numberStr: numberStr,
      valid: valid,
      errorMsg: num <= 0 ? "Required" : errorMsg,
      //   required: props.state.required,
      //   beingVerified: false,
      //   saved: false,
      //   readOnly: false,
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
        // onKeyDown={(e) => handleKeyDown(e, setLastKeyDown)}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
