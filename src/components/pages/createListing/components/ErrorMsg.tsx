import React from "react";
import { ReactComponent as WarningIcon } from "../../assets/svg/warningSign.svg";

interface Props {
  errorMsg?: string;
}

function ErrorMsg({ errorMsg }: Props) {
  return <>{errorMsg && errorMsg.length > 0 ? <div className="hg-input__error-msg">{errorMsg}</div> : null}</>;
}

export default React.memo(ErrorMsg);
