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
import { ref } from "firebase/storage";

export default function MobileNavbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const placeFilter = useAppSelector((state) => state.placeFilter);
  const showMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef(null);
  const [wobble, setWobble] = useState<0 | 1>(0);

  const { showMenu, setShowMenu } = useCloseMenu({
    closeOnOutsideClick: true,
    containerRef: menuContainerRef,
    menuRef,
  });

  function navigateToMapPage(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      return `/explore-listings/${place.formatted_address}`;
    } else {
      return `/explore-listings/`;
    }
  }

  function handleClick() {
    setShowMenu(!showMenu);
    setWobble(1);
  }

  return (
    <nav className={styles.container} ref={containerRef}>
      <div className={styles.nav}>
        <Link to={"/"}>
          <LogoSVG className={styles.logo} />
        </Link>

        <div ref={menuContainerRef}>
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
          <button
            ref={showMenuBtnRef}
            className={styles["show-menu-btn"]}
            onClick={handleClick}
            onAnimationEnd={() => setWobble(0)}
            //@ts-ignore
            wobble={wobble}
          >
            <Hamburger className={styles.hamburger} />
          </button>
        </div>
      </div>
    </nav>
  );
}
