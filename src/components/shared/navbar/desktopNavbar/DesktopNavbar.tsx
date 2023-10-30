import { useThemeContext } from "../../../../ThemeProvider";
import { Link, useLocation } from "react-router-dom";
import ProfileBtn from "../../profileBtn/ProfileBtn";
import pathMatchRoute from "../../../utils/pathMatchRoute";
import styles from "./desktopNavbar.module.scss";
import ThemeBtn from "../../themeBtn/ThemeBtn";
import { useAppSelector } from "../../../../redux/hooks";
import DesktopLogo from "../../logo/desktop/DesktopLogo";

interface Props {
  /**
   * Sets max width for navbar nav, of the form <"123px">
   */
  maxWidth?: string;
}

export default function DesktopNavbar({ maxWidth }: Props) {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const placeFilter = useAppSelector((state) => state.placeFilter);

  function navigateToMapPage(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      return `/explore-listings/${place.formatted_address}`;
    } else {
      return `/explore-listings/`;
    }
  }

  return (
    <nav className={`${styles.container}`}>
      <div
        className={styles.nav}
        style={maxWidth ? { maxWidth: maxWidth } : undefined}
      >
        <div className={styles["nav-left"]}>
          <Link
            to={navigateToMapPage()}
            className={` 
            ${styles["nav-link"]}
            ${pathMatchRoute("/listings", location) ? "active" : ""}`}
          >
            Home finder
          </Link>

          <Link
            to={"/create-listing"}
            className={` 
            ${styles["nav-link"]}
            ${pathMatchRoute("/listings", location) ? "active" : ""}`}
          >
            List your property
          </Link>
        </div>

        <Link to={"/"} className={styles["logo-container"]}>
          <DesktopLogo />
        </Link>

        <div className={styles["nav-right"]}>
          <ProfileBtn />
          <ThemeBtn onChange={() => toggleTheme()} theme={theme} />
        </div>
      </div>
    </nav>
  );
}
