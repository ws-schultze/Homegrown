import { useThemeContext } from "../../../../ThemeProvider";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as LogoSVG } from "./assets/desktop-logo.svg";
import { ReactComponent as Hamburger } from "./assets/bars-solid.svg";
import ProfileBtn from "../../profileBtn/ProfileBtn";
import pathMatchRoute from "../../../utils/pathMatchRoute";
import styles from "./mobileNavbar.module.scss";
import ThemeBtn from "../../themeBtn/ThemeBtn";
import { useAppSelector } from "../../../../redux/hooks";
import { useRef, useState } from "react";
import useCloseMenu from "./hooks/useCloseMenu";
import { ReactComponent as CloseSVG } from "./assets/close-icon.svg";

export default function MobileNavbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const showMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef(null);
  const [wobble, setWobble] = useState<0 | 1 | 2>(0);

  const { showMenu, setShowMenu } = useCloseMenu(menuRef, showMenuBtnRef);

  function navigateToMapPage(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      return `/explore-listings/${place.formatted_address}`;
    } else {
      return `/explore-listings/`;
    }
  }

  function openMenu() {
    setWobble(1);
    setShowMenu(!showMenu);
  }

  function closeMenu() {
    setWobble(2);
    setShowMenu(!showMenu);
  }

  return (
    <nav className={styles.container} ref={containerRef}>
      <div className={styles.nav}>
        <Link to={"/"}>
          <LogoSVG className={styles.logo} />
        </Link>

        <button
          ref={showMenuBtnRef}
          className={styles["show-menu-btn"]}
          onClick={openMenu}
          onAnimationEnd={() => setWobble(0)}
          //@ts-ignore
          wobble={wobble}
        >
          <Hamburger className={styles.hamburger} />
        </button>

        <div
          ref={menuContainerRef}
          className={`${styles["m-menu-container"]} ${
            showMenu ? styles["is-open"] : styles["is-closed"]
          }`}
        >
          <div
            ref={menuRef}
            className={`${styles["m-menu"]} ${
              showMenu ? styles["is-open"] : styles["is-closed"]
            }`}
          >
            <button
              type="button"
              id="m-menu-close-btn"
              className={styles["m-menu-close-btn"]}
              onClick={closeMenu}
            >
              <CloseSVG />
            </button>
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
            <ProfileBtn />
            <ThemeBtn onChange={() => toggleTheme()} theme={theme} />
          </div>
        </div>
      </div>
    </nav>
  );
}
