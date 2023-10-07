// https://blog.logrocket.com/create-custom-debounce-hook-react/
import { useState, useEffect } from "react";

export const useDebounce = (value: any, milliSeconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("debouncing");
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};
