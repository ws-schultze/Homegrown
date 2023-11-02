import React from "react";
import { ReactComponent as WarningIcon } from "../../assets/svg/warningSign.svg";
import styles from "./error-msg.module.scss";

interface Props {
  errorMsg?: string;
}

function ErrorMsg({ errorMsg }: Props) {
  return (
    <>
      {errorMsg && errorMsg.length > 0 ? (
        <div className={styles.error}>{errorMsg}</div>
      ) : null}
    </>
  );
}

export default React.memo(ErrorMsg);
