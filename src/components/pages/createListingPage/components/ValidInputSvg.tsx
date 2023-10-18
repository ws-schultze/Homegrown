import React from "react";
import { ReactComponent as ThumbsUpIcon } from "../../../assets/svg/thumbsUp.svg";

interface Props {
  valid: boolean;
}

export default function ValidInputSvg({ valid }: Props) {
  return <>{valid === true ? <ThumbsUpIcon className="listing-form__input-valid__svg" /> : null}</>;
}
