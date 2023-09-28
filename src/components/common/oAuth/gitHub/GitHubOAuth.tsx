import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import LogoSVGDarkMode from "./assets/github-mark.svg";
import styles from "../styles.module.scss";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { useNavigate } from "react-router";

//https://firebase.google.com/docs/auth/web/github-auth?authuser=0&hl=en

export default function GitHubOAuth() {
  const navigate = useNavigate();

  async function handleClick() {
    try {
      // Get the user from GihHub sign in
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exit, create it
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with GitHub");
      console.error(error);
    }
  }

  return (
    <button className={styles["icon-container"]} onClick={handleClick}>
      <img src={LogoSVGDarkMode} alt="GitHub" />
    </button>
  );
}
