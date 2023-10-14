// https://react.dev/reference/react/memo#troubleshooting
// https://react.dev/reference/react/memo#minimizing-props-changes
/**
 * Note that Object.is(3, 3) is true, but Object.is({}, {}) is false.
 *
 * Similarly Object.is(["-"], ["-"]) is false.
 *
 * This makes <InputStr /> re-render even if
 * it is wrapped in memo and the groupSeparators prop doesn't change.
 *
 */

import React, {
  useEffect,
  useState,
  useRef,
  ReactNode,
  forwardRef,
} from "react";
import { repositionCursor, validatePassword } from "./utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import * as Types from "../../../../types/index";
import {
  removeNonNumericChars,
  formatPhoneNumber,
  formatCompactCurrencyNoDecimal,
  formatUSDCommaSeparatedNoDecimal,
  formatCommaSeparatedWithDecimal,
  formatCompactCommaSeparatedWithDecimal,
  formatCommaSeparatedNoDecimal,
  formatRealEstateLicenseId,
  formatYear,
  validatePhoneNumber,
  validateDescription,
  validateEmail,
  validateName,
  validateNumber,
  validateRealEstateLicenseIdNumber,
} from "./utils";
import { getKeyDown } from "./utils";
import { ReactComponent as VisibilityIcon } from "./assets/visibilityIcon.svg";
import styles from "./styles.module.scss";

interface Props<T> {
  /**
   * fieldName is passed back to parent with the emit function. By doing this, there will only need
   * to be one handler function in each parent component, even if this component is use
   * on multiple fields.
   */
  fieldName: keyof T;
  /**
   * Input's placeholder that also becomes the label
   */
  placeholder?: string;
  /**
   * Consider the formatted number "1,234.56" with groupSeparators: [ ",", "." ]
   * or a phone number "123-456-7890" with groupSeparators: [ "-" ]
   */
  groupSeparators?: string[];
  /**
   * For USD consider "$"
   */
  prefix?: string;
  /**
   * Icon that will be placed to the left of the input field
   */
  prefixIcon?: ReactNode;
  /**
   * Determines the width of the input field
   */
  size: "sm" | "md" | "lg";
  /**
   * Price change will either be a discount or increase
   */
  isPriceChange?: boolean;
  /**
   * Original price of the item getting a price change
   */
  originalPrice?: number;
  /**
   * Desired format type
   */
  formatType:
    | "USD-no-decimal"
    | "USD-no-decimal-filter"
    | "comma-separated-no-decimal"
    | "comma-separated-with-decimal"
    | "phone-number"
    | "email"
    | "password"
    | "real-estate-license-id"
    | "name"
    | "description"
    | "year"
    | "number";
  min?: number;
  max?: number;
  /**
   * State from the parent that this component emits
   */
  parent: Types.Str;

  emit: (object: Types.Str, key: keyof T) => void;
}

// Redeclare forwardRef for this specific use case: being able to keep this this module generic but also use forwardRef
// to pass back the ref when being used by some input that requires a ref, like streetAddress needs if for making
// the autocomplete address menu work
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

/**
 * Notice that this component only formats objects of Str
 */
function InputStrInner<T>(
  props: Props<T>,
  ref?: React.ForwardedRef<HTMLInputElement>
) {
  const {
    fieldName,
    placeholder,
    groupSeparators,
    prefix,
    prefixIcon,
    size,
    isPriceChange,
    originalPrice,
    formatType,
    min,
    max,
    parent,
    emit,
  } = props;

  const [state, setState] = useState<Types.Str>(parent);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [formattedPercent, setFormattedPercent] = useState("");
  const [showInputText, setShowInputText] = useState<boolean>(true);

  useEffect(() => {
    if (formatType === "password") {
      setShowInputText(false);
    }
  }, [formatType]);

  /**
   * This ref is used to make cursorPosition work, because the ref that gets passed in with props
   * is a function and hence cannot be used like ref.current as current only exists on an object.
   */
  const localRef = useRef<HTMLInputElement | null>(null);
  /**
  // ====> SAVE THIS <====
  // To better understand using ref as a function or object use this listener example.
  // For more info on whats happening here:
  // https://stackoverflow.com/questions/62238716/using-ref-current-in-react-forwardref
  useEffect(() => {
    const node = localRef.current;
    const listen = (): void => console.log("foo");

    if (node) {
      node.addEventListener("mouseover", listen);
      return () => {
        node.removeEventListener("mouseover", listen);
      };
    }
  }, [ref]);
   */

  if (isPriceChange && isPriceChange === true && originalPrice === undefined) {
    throw new Error("originalPrice must be defined if isPriceChange===true");
  }

  useEffect(() => {
    setState(parent);
  }, [parent]);

  /**
   * Prevent cursor jumping white editing input
   */
  useEffect(() => {
    // Cursor position
    if (localRef === null) return;
    if (localRef.current === null) return;
    if (localRef && localRef.current) {
      // console.log("setting cursor pos to: ", cursorPosition);
      localRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }

    // Discount price
    if (originalPrice && state.number) {
      const percent = ((state.number / originalPrice) * 100 - 100).toFixed(2);
      setPriceChangePercent(Number(percent));
      const cleanPercent = removeNonNumericChars(percent);
      const formattedPercent = formatCommaSeparatedWithDecimal(cleanPercent);
      setFormattedPercent(formattedPercent);
    }

    if (isPriceChange === true) {
      if (originalPrice === 0 && state.number >= 1) {
        // original price is not set

        setState((s) => ({
          ...s,
          valid: false,
          errorMsg: "Listing price must be at least $1",
        }));
      } else if (originalPrice !== undefined && originalPrice > 0) {
        // original price is set

        setState((s) => ({
          ...s,
          errorMsg: "",
        }));
      }
    }
  }, [cursorPosition, originalPrice, state.number, isPriceChange]);

  /**
   * Handle component state and emit state to parent component when changes to input are made.
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value, selectionStart },
    } = e;

    if (originalPrice !== undefined && originalPrice === 0) {
      setState((s) => ({
        ...s,
        errorMsg: "Listing price must be set first",
      }));
      throw new Error("Listing price must be defined first");
    }

    //Prevent cursor jumping on "Backspace" and "Delete"
    const { modifiedValue, modifiedCursorPosition } = repositionCursor({
      eventTargetValue: value, // <------ must be e.target.value
      formattedValueFromState: state.formatted, // <---- must be state.formatted
      lastKeyDown: lastKeyDown,
      selectionStart: selectionStart,
      groupSeparators: groupSeparators,
    });

    const _numberStr = removeNonNumericChars(modifiedValue); // Can look like "00123" when decimal separated.
    const _number = Number(_numberStr); // Becomes 123
    const _numStrNoLeadingZeros = _number.toString(); // Turns into "123"
    let _value = value;
    let _formatted = "";
    let _shortFormatted = "";
    let _valid = false;
    let _errorMsg = "";

    if (!formatType) {
      throw new Error("formatType must be defined");

      // Comma separated with decimal
    } else if (formatType === "comma-separated-with-decimal") {
      if (min || min === 0) {
        const fmt = formatCommaSeparatedWithDecimal(_numStrNoLeadingZeros);
        // const noCommas = removeCommas(fmt);
        const noCommas = fmt.replace(",", "");
        const shortFmt = formatCompactCommaSeparatedWithDecimal(
          parseFloat(noCommas)
        );
        const { valid, errorMsg } = validateNumber(parseFloat(fmt), min);

        _formatted = fmt === "0.00" ? "" : fmt;
        _shortFormatted = shortFmt;
        _valid = valid;
        _errorMsg = errorMsg;
      } else {
        throw new Error(
          "Min must be defined when formatType='comma-separated-with-decimal'."
        );
      }

      // Comma separated without a decimal
    } else if (formatType === "comma-separated-no-decimal") {
      if (min || min === 0) {
        const fmt = formatCommaSeparatedNoDecimal(_numberStr);
        // const noCommas = removeCommas(fmt);
        const noCommas = fmt.replace(",", "");
        const shortFmt = formatCompactCommaSeparatedWithDecimal(
          parseInt(noCommas)
        );
        const { valid, errorMsg } = validateNumber(_number, min);
        // _formatted = fmt === "0" ? "" : fmt;
        // _shortFormatted = shortFmt === "0" ? "" : shortFmt;
        _formatted = fmt;
        _shortFormatted = shortFmt;
        _valid = valid;
        _errorMsg = errorMsg;
      } else {
        console.log(min);
        throw new Error(
          "Min must be defined when formatType='comma-separated-no-decimal'."
        );
      }

      // Phone Number
    } else if (formatType === "phone-number") {
      _formatted = formatPhoneNumber(_numberStr);
      const { valid, errorMsg } = validatePhoneNumber(_numberStr, 10);
      _valid = valid;
      _errorMsg = errorMsg;
    } else if (formatType === "USD-no-decimal") {
      // US Dollars
      if (min) {
        const fmt = formatUSDCommaSeparatedNoDecimal(_number);
        const { valid, errorMsg } = validateNumber(_number, min, max);

        if (_value === prefix) {
          _value = "";
        }

        _formatted = fmt === "$0" ? "" : fmt;
        _shortFormatted = formatCompactCurrencyNoDecimal(_numberStr);
        _valid = valid;
        _errorMsg = errorMsg;
      } else {
        throw new Error(
          "Min must be defined when formatType is USD-no-decimal"
        );
      }
    } else if (formatType === "USD-no-decimal-filter") {
      // US Dollars filter
      if (min) {
        const fmt = formatUSDCommaSeparatedNoDecimal(_number);
        // const { valid, errorMsg } = validateNumber(_number, min, max);

        if (_value === prefix) {
          _value = "";
        }

        _formatted = fmt === "$0" ? "" : fmt;
        _shortFormatted = formatCompactCurrencyNoDecimal(_numberStr);
        _valid = true;
        _errorMsg = "";
      } else {
        throw new Error(
          "Min must be defined when formatType is USD-no-decimal"
        );
      }
    } else if (formatType === "email") {
      // Email
      _formatted = value;
      const { valid, errorMsg } = validateEmail(value);
      _valid = valid;
      _errorMsg = errorMsg;
    } else if (formatType === "password") {
      //TODO: make validatePassword()
      // Password
      _formatted = value;
      const { valid, errorMsg } = validatePassword(value);
      _valid = valid;
      _errorMsg = errorMsg;
    } else if (formatType === "real-estate-license-id") {
      // Real estate license ID
      _formatted = formatRealEstateLicenseId(_numberStr);
      const { valid, errorMsg } = validateRealEstateLicenseIdNumber(_numberStr);
      _valid = valid;
      _errorMsg = errorMsg;

      // Name
    } else if (formatType === "name") {
      _formatted = _value;
      const { valid, errorMsg } = validateName(value, parent.required);
      _valid = valid;
      _errorMsg = errorMsg;

      // Description
    } else if (formatType === "description") {
      if (min !== undefined && max !== undefined) {
        _formatted = _value;
        const { valid, errorMsg } = validateDescription(value, min, max);
        _valid = valid;
        _errorMsg = errorMsg;
      } else {
        throw new Error(
          "Min and Max must be defined if formatType='description'."
        );
      }

      // Number
    } else if (formatType === "number") {
      _formatted = Number(_numberStr).toString();
      const { valid, errorMsg } = validateNumber(_number, min, max);
      _valid = valid;
      _errorMsg = errorMsg;
    }

    // Year
    else if (formatType === "year") {
      if (max) {
        _formatted = formatYear(_numberStr, 4);
        const { valid, errorMsg } = validateNumber(_number, min, max);
        console.log(valid, errorMsg);
        _valid = valid;
        _errorMsg = errorMsg;
      } else {
        throw new Error("max must be defined when formatType='year'.");
      }
      _formatted = _numberStr;
      const { valid, errorMsg } = validateNumber(_number, min, max);
      _valid = valid;
      _errorMsg = errorMsg;
    }

    // Prevent cursor jumping when formatting applies a groupSeparator and or prefix
    if (
      modifiedCursorPosition !== undefined &&
      modifiedCursorPosition !== null
    ) {
      let newCursor =
        modifiedCursorPosition + (_formatted.length - value.length);
      newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;
      console.log("new cursor: ", newCursor);
      setCursorPosition(newCursor);
    }

    const s: Types.Str = {
      value: _value,
      numberStr: _numStrNoLeadingZeros,
      number: _number,
      formatted: _formatted,
      shortFormatted: _numStrNoLeadingZeros === "" ? "" : _shortFormatted,
      valid: _valid,
      errorMsg: _errorMsg,
      required: parent.required,
      beingVerified: false,
      saved: false,
      readOnly: false,
    };
    setState(s);
    emit(s, fieldName);
  }

  /**
   * Emit state to parent
   */
  function handleBlur(): void {
    console.log("state: ", state);
    // const s: ListingData = {
    //   ...listingFormState,
    //   [fieldName]: state,
    // };
    // localStorage.setItem("listing-form-state", JSON.stringify(s));
  }

  /**
   * Set last key down to state
   */
  function handleKeyDown(e: React.KeyboardEvent<Element>) {
    const lastKeyDown: string = getKeyDown(e);
    setLastKeyDown(lastKeyDown);
  }

  return (
    <div className={`hg-input-field-wrap ${size}`}>
      {prefixIcon ? <i className="hg-input-field-icon">{prefixIcon}</i> : null}

      {formatType !== "description" ? (
        <div className="hg-input-field">
          <label
            className={`hg-input-label ${
              state.value.length > 0 ? "show" : "hide"
            }`}
          >
            {placeholder}
          </label>

          <div className={styles["input-container"]}>
            <input
              placeholder={placeholder}
              className={`${styles["hg-input"]} ${
                state.errorMsg && state.errorMsg.length > 0 ? "error" : ""
              }`}
              onKeyDown={handleKeyDown}
              ref={(node) => {
                localRef.current = node;
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              type={showInputText ? "text" : "password"}
              value={state.formatted}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={parent.readOnly}
            />

            {formatType === "password" ? (
              <VisibilityIcon
                className={styles["visibility-icon"]}
                onClick={() => setShowInputText((prev) => !prev)}
              />
            ) : null}
          </div>

          {isPriceChange && state.valid === true ? (
            <div
              className={`listing-form__price-change-percent ${
                priceChangePercent < 0 ? "decrease" : "increase"
              }`}
            >
              {formattedPercent}%{" "}
              {priceChangePercent < 0
                ? "Decrease"
                : priceChangePercent === 0
                ? "Change"
                : priceChangePercent > 0
                ? "Increase"
                : ""}
            </div>
          ) : null}

          <ErrorMsg errorMsg={state.errorMsg} />
        </div>
      ) : (
        <div className="hg-input-field">
          <label
            className={`hg-input-label ${
              state.value.length > 0 ? "show" : "hide"
            }`}
          >
            {placeholder}
          </label>
          <textarea
            placeholder={placeholder}
            className={`hg-textarea ${
              state.errorMsg && state.errorMsg.length > 0 ? "invalid" : ""
            }`}
            onKeyDown={handleKeyDown}
            value={state.formatted}
            onChange={handleChange}
            onBlur={handleBlur}
            spellCheck="true"
            disabled={parent.readOnly}
            maxLength={max ? max : undefined}
          />
          <div>
            {min !== undefined ? (
              <div className="hg-textarea__subtext">
                <small>Min {min} characters</small>
                <small>
                  {min - state.formatted.length >= 0
                    ? min - state.formatted.length
                    : 0}{" "}
                  needed.
                </small>
              </div>
            ) : null}
          </div>
          <div>
            {max !== undefined ? (
              <div className="hg-textarea__subtext">
                <small>Max {max} characters</small>
                <small>{max - state.formatted.length} remaining.</small>
              </div>
            ) : null}
          </div>
          <ErrorMsg errorMsg={state.errorMsg} />
        </div>
      )}
    </div>
  );
}

const InputStr = forwardRef(InputStrInner);
export default InputStr;

/**
 * ==========================================================================
 *                        ** NOTICE **
 *         ALL PROPS MUST BE TAKEN INTO ACCOUNT HERE!!
 * ==========================================================================
 *
 * The groupSeparators prop will cause a re-render even if it hasn't changed,
 * that is the motivation for this function.
 *
 * Check if the old props are the same as the new props.
 * If true --> InputStr will not re-render.
 * If false --> InputStr will re-render.
 * @returns true/false
 */
function arePropsEqual<T>(oldProps: Props<T>, newProps: Props<T>): boolean {
  /**
   * Check if two arrays of strings are equal. Order matters.
   * @param a string[] | undefined
   * @param b string[] | undefined
   * @returns boolean
   */
  function strArraysEqual(a: string[] | undefined, b: string[] | undefined) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    /*
     * If you don't care about the order of the elements inside
     * the array, you should sort both arrays here.
     * Please note that calling sort on an array will modify that array.
     * you might want to clone your array first.
     */
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  if (
    oldProps.fieldName === newProps.fieldName &&
    // compareObjects(oldProps.initialFieldObject, newProps.initialFieldObject) &&
    // oldProps.containerLabel === newProps.containerLabel &&
    // oldProps.className === newProps.className &&
    oldProps.placeholder === newProps.placeholder &&
    strArraysEqual(oldProps.groupSeparators, newProps.groupSeparators) &&
    oldProps.prefix === newProps.prefix &&
    oldProps.isPriceChange === newProps.isPriceChange &&
    oldProps.originalPrice === newProps.originalPrice &&
    oldProps.formatType === newProps.formatType &&
    oldProps.min === newProps.min &&
    oldProps.max === newProps.max &&
    JSON.stringify(oldProps.parent) === JSON.stringify(newProps.parent) &&
    // compareObjects(oldProps.parent, newProps.parent) &&
    oldProps.emit === newProps.emit // useCallback in the parent should make this true/false
  ) {
    console.log("All props are the same...");
    return true;
  } else {
    console.log("All props are NOT the same...");
    return false;
  }
}
