import React from "react";
import { ReactComponent as ThumbsUpIcon } from "../../../assets/svg/thumbsUp.svg";
import styles from "../create-listing-page.module.scss";

interface Props {
  valid: boolean;
}

export default function ValidInputSvg({ valid }: Props) {
  return (
    <>{valid === true ? <ThumbsUpIcon className={styles.valid_svg} /> : null}</>
  );
}
