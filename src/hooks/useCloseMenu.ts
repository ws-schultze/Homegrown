import { useEffect, useState } from "react";

export default function useCloseMenu(
  menuRef: React.RefObject<HTMLElement>,
  btnRef: React.RefObject<HTMLElement>
) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;

      // Hide menu when clicking outside of it, ignoring clicks on given btn
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setShowMenu(false);
      }
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [btnRef, menuRef]);

  return { showMenu, setShowMenu };
}
