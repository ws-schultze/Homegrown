import React, { useState, useEffect } from "react";
import ErrorMsg from "../../../shared/errorMsg/ErrorMsg";
import {
  TypeBool,
  TypeBoolValue,
  ForRentBy,
  ForRentByValue,
  ForSaleBy,
  ForSaleByValue,
  ForSaleOrRent,
  ForSaleOrRentValue,
} from "../../../../types/index";
import styles from "../styles.module.scss";

export type TypeTwoBtnRowState =
  | TypeBool
  | ForSaleOrRent
  | ForRentBy
  | ForSaleBy;
export type BtnValue =
  | TypeBoolValue
  | ForSaleOrRentValue
  | ForRentByValue
  | ForSaleByValue;

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
      btnClass = styles.active;
    } else if (parent.value === false && btnValue === false) {
      btnClass = styles.active;
    } else if (
      parent.value !== null &&
      parent.value !== true &&
      parent.value !== false &&
      btnValue !== null &&
      btnValue !== true &&
      btnValue !== false
    ) {
      if (parent.value.label === btnValue.label) {
        btnClass = styles.active;
      }
    }

    return btnClass;
  }

  return (
    <div className={styles.labeled}>
      {state ? (
        <>
          {label !== undefined ? <label>{label}</label> : null}
          <div className={styles.two_btn_row}>
            <button
              className={`
                ${
                  formLayer === "1"
                    ? styles.btn
                    : formLayer === "2"
                    ? styles.btn
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
                    ? styles.btn
                    : formLayer === "2"
                    ? styles.btn
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
