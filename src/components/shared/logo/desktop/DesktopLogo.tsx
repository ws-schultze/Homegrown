import { ReactComponent as LogoSVG } from "./desktop-logo.svg";
import styles from "./desktopLogo.module.scss";

export default function DesktopLogo() {
  return <LogoSVG className={styles.logo} />;
}
