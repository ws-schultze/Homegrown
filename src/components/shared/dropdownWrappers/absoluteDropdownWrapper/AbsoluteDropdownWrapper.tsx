import { useRef } from "react";
import styles from "./absoluteDropdownWrapper.module.scss";
import { ReactComponent as Icon } from "./chevron-down.svg";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { AbsDropdownMenuWrapper } from "../types";

export default function AbsoluteDropdownWrapper({
  menuContent,
  showMenu,
  inUse,
  label,
  btnStyles,
  menuStyles,
  handleShowMenu,
  handleStateOnMenuClose,
}: AbsDropdownMenuWrapper): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: showMenu,
    closeOnOutsideClick: true,
    containerRef,
    menuRef,
    handleShowMenu,
    handleStateOnMenuClose,
  });

  return (
    <div
      className={`${styles["abs-container"]} ${inUse ? styles.used : ""}`}
      ref={containerRef}
      onClick={handleShowMenu}
      style={btnStyles ? btnStyles : undefined}
    >
      {label || "Dropdown"}
      <div className={styles["abs-icon-wrap"]}>
        <Icon
          className={`${styles["abs-icon"]} ${
            showMenu ? styles.open : styles.closed
          }`}
        />
      </div>

      <div
        className={`${styles["abs-menu"]} ${
          showMenu ? styles.open : styles.closed
        }`}
        style={menuStyles ? menuStyles : undefined}
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        {menuContent}
      </div>
    </div>
  );
}
