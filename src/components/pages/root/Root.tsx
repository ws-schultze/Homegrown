import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../../../ThemeProvider";
import Navbar from "../../common/navbar/Navbar";
import Spinner from "../../common/loaders/Spinner";
import styles from "./styles.module.scss";

export default function Root({
  children,
}: {
  children?: JSX.Element;
}): JSX.Element {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Spinner size="large" />;
  }

  return (
    <div className={`${styles["container"]}`}>
      <Navbar theme={theme} />

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
