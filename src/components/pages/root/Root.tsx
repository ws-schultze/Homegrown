import { Outlet, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../../../ThemeProvider";
import Navbar from "../../shared/navbar/desktopNavbar/DesktopNavbar";
import Spinner from "../../shared/loaders/Spinner";
import MobileNavbar from "../../shared/navbar/mobileNavbar/MobileNavbar";
import styles from "./root.module.scss";
import { useMemo } from "react";
import useScreenSize from "../../../hooks/useScreenSize";
import DesktopNavbar from "../../shared/navbar/desktopNavbar/DesktopNavbar";

export default function Root({
  children,
}: {
  children?: JSX.Element;
}): JSX.Element {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { width } = useScreenSize();
  const mode = useMemo(
    () =>
      width <= 480
        ? "mobile"
        : width > 480 && width <= 1023
        ? "tablet"
        : width > 1023
        ? "desktop"
        : undefined,
    [width]
  );

  if (navigation.state === "loading") {
    return <Spinner size="large" />;
  }

  return (
    <div className={`${styles.container}`}>
      {mode === "desktop" ? <DesktopNavbar /> : <MobileNavbar />}

      <main id="root-main-outlet">{children ?? <Outlet />}</main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}
