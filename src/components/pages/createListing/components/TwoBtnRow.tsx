import React, { useState, useEffect } from "react";
import ErrorMsg from "./ErrorMsg";
import {
  TypeBool,
  TypeBoolValue,
  TypeForRentBy,
  TypeForRentByValue,
  TypeForSaleBy,
  TypeForSaleByValue,
  TypeForSaleOrRent,
  TypeForSaleOrRentValue,
} from "../../../../index";

export type TypeTwoBtnRowState =
  | TypeBool
  | TypeForSaleOrRent
  | TypeForRentBy
  | TypeForSaleBy;
export type BtnValue =
  | TypeBoolValue
  | TypeForSaleOrRentValue
  | TypeForRentByValue
  | TypeForSaleByValue;

interface Props<T> {
  /** Default value is "Yes" */
  leftBtnText: string;
  leftBtnValue: BtnValue;
  /** Default value is "No" */
  rightBtnText: string;
  rightBtnValue: BtnValue;
  fieldName: keyof T;
  parent: TypeTwoBtnRowState;
  /**
   * Layer 1 has larger btns than layer 2
   */
  formLayer: "1" | "2";
  label?: string;
  emit: (key: keyof T, obj: TypeTwoBtnRowState) => void;
}

export default function TwoBtnRow<T>({
  leftBtnText,
  leftBtnValue,
  rightBtnText,
  rightBtnValue,
  fieldName,
  parent,
  formLayer,
  label,
  emit,
}: Props<T>) {
  const [state, setState] = useState<TypeTwoBtnRowState>(parent);

  /**
   * Catch error msg passed down from parent
   */
  useEffect(() => {
    setState({
      ...parent,
    });
  }, [parent]);

  function handleClick(value: BtnValue): void {
    console.log("click");
    if (parent.value !== null) {
    }
    const s: typeof state = {
      ...state,
      value: value,
      valid: true,
      errorMsg: "",
    };

    setState(s);
    emit(fieldName, s);
  }

  function getBtnClass(btnValue: BtnValue): string {
    let btnClass = "";

    if (parent.value === null && btnValue === null) {
      btnClass = "";
    } else if (parent.value === true && btnValue === true) {
      btnClass = "active";
    } else if (parent.value === false && btnValue === false) {
      btnClass = "active";
    } else if (
      parent.value !== null &&
      parent.value !== true &&
      parent.value !== false &&
      btnValue !== null &&
      btnValue !== true &&
      btnValue !== false
    ) {
      if (parent.value.label === btnValue.label) {
        btnClass = "active";
      }
    }

    return btnClass;
  }

  return (
    <div>
      {state ? (
        <>
          {label !== undefined ? (
            <label
              className={`listing-form__label ${
                state.errorMsg.length > 0 ? "invalid" : ""
              }`}
            >
              {label}
            </label>
          ) : null}
          <div className="listing-form__btns-row">
            <button
              className={`
                ${
                  formLayer === "1"
                    ? "listing-form__btn"
                    : formLayer === "2"
                    ? "listing-form__section__btn"
                    : ""
                }
                ${getBtnClass(leftBtnValue)}
              `}
              type="button"
              onClick={() => {
                handleClick(leftBtnValue);
              }}
              disabled={state.readOnly}
            >
              {leftBtnText !== undefined ? leftBtnText : "Yes"}
            </button>
            <button
              className={`
                ${
                  formLayer === "1"
                    ? "listing-form__btn"
                    : formLayer === "2"
                    ? "listing-form__section__btn"
                    : ""
                }
                ${getBtnClass(rightBtnValue)}
              `}
              type="button"
              value="false"
              onClick={() => {
                handleClick(rightBtnValue);
              }}
              disabled={state.readOnly}
            >
              {rightBtnText !== undefined ? rightBtnText : "No"}
            </button>
          </div>
          <ErrorMsg errorMsg={state.errorMsg} />
        </>
      ) : null}
    </div>
  );
}
