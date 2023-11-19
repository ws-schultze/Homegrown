import { useRef } from "react";
import styles from "./flexDropdownWrapper.module.scss";
import { ReactComponent as Icon } from "./chevron-down.svg";
import { FlxDropdownMenuWrapper } from "../types";

export interface FlexDropdownBtnStyles {
  height: string;
  width: string;
}

export interface FlexDropdownMenuStyles {
  height: string;
  width: string;
}

export default function FlexDropdownWrapper({
  menuContent,
  showMenu,
  inUse,
  label,
  btnStyles,
  menuStyles,
  handleShowMenu,
}: FlxDropdownMenuWrapper): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={`${styles["flx-container"]} ${inUse ? styles.used : ""}`}
      ref={containerRef}
    >
      <div
        className={styles["flx-btn"]}
        onClick={handleShowMenu}
        style={btnStyles ? btnStyles : undefined}
      >
        {label}
        <div className={styles["flx-icon-wrap"]}>
          <Icon
            className={`${styles["flx-icon"]} ${
              showMenu ? styles.open : styles.closed
            }`}
          />
        </div>
      </div>

      <div
        className={`${styles["flx-menu"]} ${
          showMenu ? styles.open : styles.closed
        }`}
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        style={menuStyles ? menuStyles : undefined}
      >
        {menuContent}
      </div>
    </div>
  );
}
