import { useRef, useState } from "react";
import { formatPriceOnChange, handleKeyDown } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { PriceInputProps } from "../inputProps";

/**
 * Notice that this component only formats objects of Str
 */
export default function PriceInput(props: PriceInputProps) {
  const [lastKeyDown, setLastKeyDown] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  // useSetCursorPosition(inputRef, cursorPosition);

  // TODO: Setting cursor position with setSelectionRange() causes the input
  // to be in focus, if it is the last component rendered that uses this hook.
  // Figure out how to have cursor position memory on render with inputs
  // that have dynamically formatted input.

  return (
    <div className={styles.container}>
      <label
        htmlFor="price"
        className={` ${props.state.number > 0 ? styles.show : styles.hide}`}
      >
        {props.placeholder}
      </label>
      <input
        id="price"
        type="text"
        ref={inputRef}
        placeholder={props.placeholder}
        value={props.state.formatted}
        onChange={(e) =>
          formatPriceOnChange({
            e,
            priceState: props.state,
            isDiscountPrice: props.isDiscountPrice,
            lastKeyDown,
            groupSeparators: props.groupSeparators,
            minPrice: props.minPrice,
            currency: props.currency,
            prefix: props.prefix,
            setCursorPosition,
            handleInput: props.handleInput,
          })
        }
        onKeyDown={(e) => handleKeyDown(e, setLastKeyDown)}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
