import { TypeBool } from "../../../../types";
import ErrorMsg from "../../../shared/errorMsg/ErrorMsg";
import styles from "../styles.module.scss";

export default function YesNoBtns({
  state,
  label,
  leftBtnText,
  rightBtnText,
  handleSelected,
}: {
  state: TypeBool;
  label?: string;
  leftBtnText?: string;
  rightBtnText?: string;
  handleSelected: (obj: TypeBool) => void;
}) {
  return (
    <div className={styles.labeled}>
      <label htmlFor={label}>{label}</label>
      <div id={label} className={styles.two_btn_row}>
        <button
          className={`${styles.btn} ${
            state.value === true ? styles.active : null
          } `}
          type="button"
          onClick={() =>
            handleSelected({
              ...state,
              value: true,
              valid: true,
              errorMsg: "",
            })
          }
          disabled={state.readOnly}
        >
          {leftBtnText ? leftBtnText : "Yes"}
        </button>
        <button
          className={`${styles.btn} ${
            state.value === false ? styles.active : null
          } `}
          type="button"
          value="false"
          onClick={() =>
            handleSelected({
              ...state,
              value: false,
              valid: true,
              errorMsg: "",
            })
          }
          disabled={state.readOnly}
        >
          {rightBtnText ? rightBtnText : "No"}
        </button>
      </div>
      <ErrorMsg errorMsg={state.errorMsg} />
    </div>
  );
}
