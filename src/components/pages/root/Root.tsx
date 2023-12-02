import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../../../ThemeProvider";
import Spinner from "../../shared/loaders/Spinner";
import MobileNavbar from "../../shared/navbar/mobileNavbar/MobileNavbar";
import styles from "./root.module.scss";
import DesktopNavbar from "../../shared/navbar/desktopNavbar/DesktopNavbar";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
import houseGif from "./assets/wired-outline-63-home.gif";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import { setUserAcknowledgedSiteIsDemo } from "../../../common/commonSlice";

export default function Root({
  children,
}: {
  children?: JSX.Element;
}): JSX.Element {
  const { theme } = useThemeContext();
  const screenSize = useScreenSizeContext();
  const navigation = useNavigation();
  const location = useLocation();
  const commonState = useAppSelector((s) => s.common);
  const dispatch = useDispatch();

  function handleUserAcknowledgment() {
    dispatch(setUserAcknowledgedSiteIsDemo(true));
  }

  if (navigation.state === "loading") {
    return <Spinner size="large" data-testid="spinner" />;
  }

  return (
    <div className={`${styles.container}`}>
      {screenSize === "desktop" ? (
        location.pathname.includes("explore-listings") ? (
          // Wider navbar nav
          <DesktopNavbar maxWidth="100%" />
        ) : (
          // Narrower navbar nav
          <DesktopNavbar />
        )
      ) : (
        // Mobile navbar nav doesn't change width
        <MobileNavbar />
      )}

      <div
        className={styles.user_acknowledgement_container}
        style={{
          display:
            commonState.userAcknowledgedSiteIsDemo === false ? "flex" : "none",
        }}
      >
        <div className={styles.user_acknowledgement}>
          <div className={styles.notice}>
            <a href="https://lordicon.com/">
              <img src={houseGif} alt="Lordicon" />
            </a>
            <h1>Disclaimer</h1>
            <ul>
              <li>This app is for demonstration purposes only.</li>
              <li>All property listings found on this app are fictional.</li>
              <li>
                No transactions shall occur as a result of using this app.
              </li>
            </ul>
            <button onClick={handleUserAcknowledgment}>I understand</button>
          </div>
        </div>
      </div>

      <main id="main-container" className={styles.main}>
        {children ?? <Outlet />}
      </main>

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
