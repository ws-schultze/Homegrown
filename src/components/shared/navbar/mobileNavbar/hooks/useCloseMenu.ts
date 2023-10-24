import { useEffect, useState } from "react";

interface Params {
  closeOnOutsideClick: boolean;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function useCloseMenu({
  closeOnOutsideClick = true,
  containerRef,
  menuRef,
}: Params) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

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
              setShowMenu(false);
            }
          }
        }
      }
    } // end handler

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return { showMenu, setShowMenu };
}
