//https://codepen.io/gustavo_victor/pen/PodmyqM
import { TypeTheme } from "../../../ThemeProvider";
import styles from "./themeBtn.module.scss";
import { ReactComponent as MoonSVG } from "../../../assets/svg/moonIcon.svg";
import { ReactComponent as SunSVG } from "../../../assets/svg/sun-regular.svg";

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
    <div className={styles.container}>
      <input
        type="checkbox"
        name="switcher"
        id="switcher-input"
        className={styles.label}
        defaultChecked={isDark}
        onChange={onChange}
      />

      <label htmlFor="switcher-input" className={styles.label}>
        <MoonSVG className={styles.moon} />
        <span className={styles.toggle}></span>
        <SunSVG className={styles.sun} />
      </label>
    </div>
  );
}
