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
import { useAppSelector } from "../../../../redux/hooks";

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

// interface Props<T> {
//   /** Default value is "Yes" */
//   leftBtnText: string;
//   leftBtnValue: BtnValue;
//   /** Default value is "No" */
//   rightBtnText: string;
//   rightBtnValue: BtnValue;
//   fieldName: keyof T;
//   parent: T;
//   /**
//    * Layer 1 has larger btns than layer 2
//    */
//   formLayer: "1" | "2";
//   label?: string;
//   handleSelected: (obj: T) => void;
// }

export default function TwoBtnRow<T>({
  leftBtnText,
  leftBtnValue,
  rightBtnText,
  rightBtnValue,
  state,
  // fieldName,
  label,
  handleSelected,
}: {
  /** Default value is "Yes" */
  leftBtnText: string;
  leftBtnValue: BtnValue;
  /** Default value is "No" */
  rightBtnText: string;
  rightBtnValue: BtnValue;
  state: TypeTwoBtnRowState;
  // fieldName: keyof T;
  label?: string;
  handleSelected: (obj: TypeTwoBtnRowState) => void;
}) {
  // const [state, setState] = useState<TypeTwoBtnRowState>(parent);

  /**
   * Catch error msg passed down from parent
   */
  // useEffect(() => {
  //   setState({
  //     ...parent,
  //   });
  // }, [parent]);

  function handleClick(value: BtnValue): void {
    const s: typeof state = {
      ...state,
      value: value,
      valid: true,
      errorMsg: "",
    };

    // setState(s);
    // emit(fieldName, s);
    handleSelected(s);
  }

  function getBtnClass(btnValue: BtnValue): string {
    let btnClass = "";

    if (state.value === null && btnValue === null) {
      btnClass = "";
    } else if (state.value === true && btnValue === true) {
      btnClass = "active";
    } else if (state.value === false && btnValue === false) {
      btnClass = "active";
    } else if (
      state.value !== null &&
      state.value !== true &&
      state.value !== false &&
      btnValue !== null &&
      btnValue !== true &&
      btnValue !== false
    ) {
      if (state.value.label === btnValue.label) {
        btnClass = "active";
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
              className={`btn ${styles.btn} ${getBtnClass(leftBtnValue)} `}
              type="button"
              onClick={() => {
                handleClick(leftBtnValue);
              }}
              disabled={state.readOnly}
            >
              {leftBtnText !== undefined ? leftBtnText : "Yes"}
            </button>
            <button
              className={`btn ${styles.btn} ${getBtnClass(rightBtnValue)} `}
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
