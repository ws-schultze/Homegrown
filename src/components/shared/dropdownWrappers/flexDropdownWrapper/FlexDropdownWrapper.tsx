import { useRef } from "react";
import styles from "./flexDropdownWrapper.module.scss";
import { ReactComponent as Icon } from "./chevron-down.svg";

export interface FlexDropdownBtnStyles {
  height: string;
  width: string;
}

export interface FlexDropdownMenuStyles {
  height: string;
  width: string;
}

interface Props {
  menuContent: JSX.Element;
  showMenu: boolean;
  inUse: boolean;
  label: React.ReactNode;
  btnStyles: FlexDropdownBtnStyles;
  menuStyles: FlexDropdownMenuStyles;
  handleShowMenu: () => void;
}

export default function FlexDropdownWrapper({
  menuContent,
  showMenu,
  inUse,
  label,
  btnStyles,
  menuStyles,
  handleShowMenu,
}: Props): JSX.Element {
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
        style={{
          width: btnStyles.width,
          minHeight: btnStyles.height,
          maxHeight: btnStyles.height,
        }}
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
      >
        {/* Menu content goes here */}
        {menuContent}
      </div>
    </div>
  );
}
