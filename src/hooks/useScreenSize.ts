import { useEffect, useState } from "react";

//https://usehooks.com/useWindowSize/
export default function useScreenSize() {
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
