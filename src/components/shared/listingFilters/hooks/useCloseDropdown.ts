import { AnyAction } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

type Reducer = (noArgument: void) => {
  payload: object | undefined;
  type: string;
};

interface Props {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  menuIsOpen: boolean;
  closeOnOutsideClick: boolean;
  setShowMenu: Reducer;
  /**
   * Reducers for actions that should happen when the menu closes, such as setting a price range to the global state
   */
  reducers?: AnyAction[];
}

export default function useCloseDropdown({
  closeOnOutsideClick,
  menuIsOpen,
  setShowMenu,
  menuRef,
  containerRef,
  reducers,
}: Props) {
  const dispatch = useDispatch();

  /**
   * Close the menu when clicking outside of the container
   */
  useEffect(() => {
    if (closeOnOutsideClick === false) return;

    function handler({ target }: MouseEvent) {
      console.log("handler called for: ", menuIsOpen);
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
                dispatch(setShowMenu());
                if (reducers) {
                  reducers.forEach((r) => dispatch(r));
                }
              } else console.warn("menu is not open");
            } else console.log("menuRef.current.contains(t) !== false");
          } else console.log("menuRef.current is undefined");
        } else console.log("containerRef.current.contains(t) !== false");
      } else console.log("containerRef.current is undefined");
    } // end handler

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, [menuIsOpen, reducers]);
}
