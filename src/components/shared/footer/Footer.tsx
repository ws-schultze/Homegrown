import { Link } from "react-router-dom";
import logoIconPNG from "../../../assets/logo/IconOnly.png";
import styles from "./footer.module.scss";

export default function Footer() {
  const dateNow = new Date();
  const thisYear = dateNow.getFullYear();

  return (
    <div className={styles.container}>
      {/* <Link to={"/"} className={styles.link}>
        <img src={logoIconPNG} alt="" />
      </Link> */}
      &copy; {thisYear} Homegrown Development
    </div>
  );
}
