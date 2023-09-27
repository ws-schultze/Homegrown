import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styles from "./root.module.css";
import { useThemeContext } from "../../../ThemeProvider";
import Navbar from "../../common/navbar/Navbar";
import Spinner from "../../common/loaders/Spinner";
import { RootLayout } from "./styledComponents";
import { useEffect, useState } from "react";

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
    <RootLayout>
      <Navbar theme={theme} />

      <main
        id="root-main-outlet"
        // className={styles.fade}
        // style={{ animationDelay: `${1000}ms` }}
        // className={navigation.state === "loading" ? "loading" : ""}
      >
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
    </RootLayout>
  );
}
