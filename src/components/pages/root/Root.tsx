import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../../../ThemeProvider";
import Spinner from "../../shared/loaders/Spinner";
import MobileNavbar from "../../shared/navbar/mobileNavbar/MobileNavbar";
import styles from "./root.module.scss";
import DesktopNavbar from "../../shared/navbar/desktopNavbar/DesktopNavbar";
import { useScreenSizeContext } from "../../../ScreenSizeProvider";
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
            <div>
              <h1>Welcome 😃</h1>
              <p>
                Explore my application’s features to the fullest by creating an
                account, but note it's a demo version, not for commercial use.
              </p>
              <p>- W. S. Schultze</p>
            </div>
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
