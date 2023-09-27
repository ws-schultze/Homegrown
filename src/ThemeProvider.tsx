import React, { useEffect, createContext, useState, useContext } from "react";
import { SetStateAction } from "react";
import { Dispatch } from "react";

export type TypeTheme = "light" | "dark";

function getTheme(): TypeTheme {
  const theme = localStorage.getItem("theme") as TypeTheme;
  if (!theme) {
    // Theme is not defined in local storage
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Browser's theme is set to dark
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
      return "dark";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      // Browser's theme is set to light
      localStorage.setItem("theme", "light");
      document.body.classList.add("light");
      return "light";
    } else {
      // Theme is not set in local storage or the browser
      // Use dark as the default theme
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
      return "dark";
    }
  } else {
    // Theme is already defined in ls
    document.body.classList.add(theme);
    return theme;
  }
}

interface ThemeContext {
  theme: TypeTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

export const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  const [theme, setTheme] = useState<"light" | "dark">(getTheme);

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  useEffect(() => {
    const refreshTheme = () => {
      // Set theme in local storage
      // Remove any theme class from the body and add the updated theme class
      localStorage.setItem("theme", theme);
      document.body.classList.remove("dark", "light");
      document.body.classList.add(theme);
    };
    refreshTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContext => {
  return useContext(ThemeContext);
};
