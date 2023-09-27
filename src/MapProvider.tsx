import { createContext, useContext, useEffect, useState } from "react";
import { useThemeContext } from "./ThemeProvider";

interface MapContextState {
  darkModeMapId: string;
  lightModeMapId: string;
  currentMapId: string;
}

const initialMapContextState: MapContextState = {
  darkModeMapId: "a93e2735a55284b2",
  lightModeMapId: "4821a1ac6b18a50e",
  currentMapId: "a93e2735a55284b2",
};

const MapContext = createContext<MapContextState>({} as MapContextState);

export function MapContextProvider({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<MapContextState>(initialMapContextState);
  const { theme } = useThemeContext();

  /**
   * Set the current map ID based on what the theme is
   */
  useEffect(() => {
    if (theme !== "dark" && theme !== "light") {
      throw new Error("Something went wrong");
    } else if (theme === "dark") {
      setState((s) => ({ ...s, currentMapId: state.darkModeMapId }));
    } else if (theme === "light") {
      setState((s) => ({ ...s, currentMapId: state.lightModeMapId }));
    }
  }, [theme, state.lightModeMapId, state.darkModeMapId]);

  return <MapContext.Provider value={state}>{children}</MapContext.Provider>;
}

export function useMapContext(): MapContextState {
  return useContext(MapContext);
}
