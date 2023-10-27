import { AnyAction } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

type Reducer = (noArgument: void) => {
  payload: object | undefined;
  type: string;
};

interface Props {
  closeOnOutsideClick: boolean;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  menuIsOpen: boolean;
  handleShowMenu: () => void;
  handleStateOnMenuClose?: () => void;
}

export default function useCloseDropdown({
  closeOnOutsideClick,
  menuIsOpen,
  menuRef,
  containerRef,
  handleShowMenu,
  handleStateOnMenuClose,
}: Props) {
  /**
   * Close the menu when clicking outside of the container
   */
  useEffect(() => {
    if (closeOnOutsideClick === false) return;

    function handler({ target }: MouseEvent) {
      const t = target as Node;

      // container exists
      if (containerRef.current) {
        // the click is not inside the container
        if (containerRef.current.contains(t) === false) {
          // the menu exists
          if (menuRef.current) {
            // the click is not inside the menu
            if (menuRef.current.contains(t) === false) {
              // the menu must be open for it to be closed, otherwise clicking outside the container will just toggle the menu on any click!!
              if (menuIsOpen) {
                handleShowMenu();
                if (handleStateOnMenuClose) {
                  handleStateOnMenuClose();
                }
              }
            }
          }
        }
      }
    } // end handler

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, [menuIsOpen, handleStateOnMenuClose]);
}
