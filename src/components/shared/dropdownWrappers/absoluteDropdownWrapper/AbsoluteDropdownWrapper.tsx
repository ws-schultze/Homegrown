import { useRef } from "react";
import styles from "./absoluteDropdownWrapper.module.scss";
import { ReactComponent as Icon } from "./chevron-down.svg";
import { FlexDropdownBtnStyles } from "../flexDropdownWrapper/FlexDropdownWrapper";
import useCloseDropdown from "../hooks/useCloseDropdown";

interface Props {
  menuContent: JSX.Element;
  showMenu: boolean;
  inUse: boolean;
  label: React.ReactNode;
  btnStyles: FlexDropdownBtnStyles;
  handleShowMenu: () => void;
  handleStateOnMenuClose: () => void;
}

export default function AbsoluteDropdownWrapper({
  menuContent,
  showMenu,
  inUse,
  label,
  btnStyles,
  handleShowMenu,
  handleStateOnMenuClose,
}: Props): JSX.Element {
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
      style={{
        width: btnStyles.width,
        minHeight: btnStyles.height,
        maxHeight: btnStyles.height,
      }}
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
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu contents goes here */}
        {menuContent}
      </div>
    </div>
  );
}
