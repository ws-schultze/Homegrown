import { TypeTheme, useThemeContext } from "../../../../ThemeProvider";
import { Link, useLocation } from "react-router-dom";
// import { ReactComponent as MobileLogo } from "./assets/mobile-logo.svg";
import { ReactComponent as DesktopLogo } from "./assets/desktop-logo.svg";
import ProfileBtn from "../../profileBtn/ProfileBtn";
import pathMatchRoute from "../../../utils/pathMatchRoute";
import styles from "./desktopNavbar.module.scss";
import ThemeBtn from "../../themeBtn/ThemeBtn";
import { useAppSelector } from "../../../../redux/hooks";

export default function DesktopNavbar() {
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
    <nav className={`${styles.container} `}>
      <div className={styles.nav}>
        <div className={styles["nav-left"]}>
          <Link
            to={navigateToMapPage()}
            className={` 
            ${styles["nav-link"]}
            ${pathMatchRoute("/listings", location) ? "active" : ""}`}
          >
            Explore
          </Link>

          <Link
            to={"/create-listing"}
            className={` 
            ${styles["nav-link"]}
            ${pathMatchRoute("/listings", location) ? "active" : ""}`}
          >
            Create
          </Link>
        </div>

        <Link to={"/"}>
          <DesktopLogo className={styles.logo} />
        </Link>

        <div className={styles["nav-right"]}>
          <ProfileBtn />
          <ThemeBtn onChange={() => toggleTheme()} theme={theme} />
        </div>
      </div>
    </nav>
  );
}
