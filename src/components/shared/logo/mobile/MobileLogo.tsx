import { ReactComponent as LogoSVG } from "./mobile-logo.svg";
import styles from "./mobileLogo.module.scss";

export default function MobileLogo() {
  return <LogoSVG className={styles.logo} />;
}
