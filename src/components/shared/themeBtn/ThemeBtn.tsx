//https://codepen.io/gustavo_victor/pen/PodmyqM
import { TypeTheme } from "../../../ThemeProvider";
import { Moon, Sun } from "./styledComponents";

export default function ThemeBtn({
  theme,
  onChange,
}: {
  theme: TypeTheme;
  onChange: () => void;
}) {
  //@ts-ignore
  const isDark = theme.theme === "dark" ? true : false;

  return (
    <>
      <input
        type="checkbox"
        name="switcher"
        id="switcher-input"
        className="switcher-input"
        defaultChecked={isDark}
        onChange={onChange}
      />

      <label className="switcher-label" htmlFor="switcher-input">
        <Moon />
        <span className="switcher-toggler"></span>
        <Sun />
      </label>
    </>
  );
}
