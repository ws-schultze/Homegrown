import React, { createContext, useContext, useMemo } from "react";
import { useEffect, useState } from "react";
// import useScreenSize from "./hooks/useScreenSize";

type ScreenSize = "mobile" | "tablet" | "desktop" | undefined;

// interface ScreenSize {
//   width: number;
//   height: number;
// }

const ScreenSizeContext = createContext<ScreenSize>({} as ScreenSize);

export function ScreenSizeProvider({ children }: { children: JSX.Element }) {
  const [width, setWidth] = useState(getWidth);

  const screenSize: ScreenSize = useMemo(
    () =>
      width <= 480
        ? "mobile"
        : width > 480 && width <= 1023
        ? "tablet"
        : width > 1023
        ? "desktop"
        : undefined,
    [width]
  );

  function getWidth() {
    return window.innerWidth;
  }

  useEffect(() => {
    function handleResize() {
      setWidth(getWidth());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
}

export function useScreenSizeContext(): ScreenSize {
  return useContext(ScreenSizeContext);
}
