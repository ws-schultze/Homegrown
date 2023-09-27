import React, { useEffect, useState } from "react";
import { RootState } from "../redux/store";

/**
 * Get value from local storage if it exists, otherwise return defaultValue
 * @param key string
 * @param defaultValue T
 * @returns T
 */
export function getStorageValue<T>(key: string, defaultValue: T): T {
  const saved_str = localStorage.getItem(key);
  if (saved_str) {
    const saved_obj = JSON.parse(saved_str) as T;
    return saved_obj;
  } else {
    return defaultValue;
  }
}

/**
 * Return the current local storage value for the given key,
 * and its set function. When the user sets the value, update local storage.
 * @param key string
 * @param defaultValue T
 * @returns [T, React.Dispatch<React.SetStateAction<T>>]
 */
export function useLocalStorage<T>(
  key: keyof RootState,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
