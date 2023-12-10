import { Link } from "react-router-dom";
import { ReactComponent as LogoSVG } from "./desktop-logo.svg";
import styles from "./desktopLogo.module.scss";

export default function DesktopLogo() {
  return (
    <Link to="/">
      <LogoSVG className={styles.logo} />
    </Link>
  )
}
