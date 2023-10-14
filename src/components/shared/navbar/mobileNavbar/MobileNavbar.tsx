import { useThemeContext } from "../../../../ThemeProvider";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MobileLogo } from "./assets/mobile-logo.svg";
import { ReactComponent as Hamburger } from "./assets/bars-solid.svg";
import ProfileBtn from "../../profileBtn/ProfileBtn";
import pathMatchRoute from "../../../utils/pathMatchRoute";
import styles from "./mobileNavbar.module.scss";
import ThemeBtn from "../../themeBtn/ThemeBtn";
import { useAppSelector } from "../../../../redux/hooks";
import { useEffect, useRef, useState } from "react";
import { ref } from "firebase/storage";
import useCloseMenu from "./hooks/useCloseMenu";

export default function MobileNavbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const showMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef(null);
  const { showMenu, setShowMenu } = useCloseMenu(menuRef, showMenuBtnRef);

  function navigateToMapPage(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      return `/explore-listings/${place.formatted_address}`;
    } else {
      return `/explore-listings/`;
    }
  }

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  return (
    <nav className={`${styles.container} `}>
      <div className={styles.nav}>
        <div className={styles["nav-left"]}>
          <button ref={showMenuBtnRef} className={styles["show-menu-btn"]}>
            <Hamburger className={styles.hamburger} onClick={toggleMenu} />
          </button>
        </div>

        {showMenu ? (
          <div ref={menuRef} className={styles.menu}>
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
        ) : null}

        <Link to={"/"}>
          <MobileLogo className={styles.logo} />
        </Link>

        <div className={styles["nav-right"]}></div>
      </div>
    </nav>
  );
}
