import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

interface Props {
  menuKind: "absolute" | "flex";
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  menuIsOpen: boolean;
  setShowMenu: (noArgument: void) => {
    payload: undefined;
    type: string;
  };
}

export default function useCloseDropdown({
  menuKind,
  menuIsOpen,
  setShowMenu,
  menuRef,
  containerRef,
}: Props) {
  const dispatch = useDispatch();

  /**
   * Close the menu when clicking outside of the container
   */
  useEffect(() => {
    function handler({ target }: MouseEvent) {
      const t = target as Node;

      if (menuKind === "flex") {
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
                } else console.warn("menu is not open");
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
  }, [menuIsOpen]);
}
