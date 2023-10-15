import { Outlet, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../../../ThemeProvider";
import Spinner from "../../shared/loaders/Spinner";
import MobileNavbar from "../../shared/navbar/mobileNavbar/MobileNavbar";
import styles from "./root.module.scss";
import DesktopNavbar from "../../shared/navbar/desktopNavbar/DesktopNavbar";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";

export default function Root({
  children,
}: {
  children?: JSX.Element;
}): JSX.Element {
  const { theme } = useThemeContext();
  const screenSize = useScreenSizeContext();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Spinner size="large" />;
  }

  return (
    <div className={`${styles.container}`}>
      {screenSize === "desktop" ? <DesktopNavbar /> : <MobileNavbar />}

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
