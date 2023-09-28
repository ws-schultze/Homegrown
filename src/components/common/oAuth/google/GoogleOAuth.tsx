import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { toast } from "react-toastify";
import styles from "../styles.module.scss";
import googleIcon from "./assets/googleIcon.svg";

export default function GoogleOAuth() {
  const navigate = useNavigate();

  async function handleClick() {
    try {
      // Get the user from the Google sign in
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
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
      toast.error("Could not authorize with Google");
      console.error(error);
    }
  }

  return (
    <button className={styles["icon-container"]} onClick={handleClick}>
      <img src={googleIcon} alt="Google" />
    </button>
  );
}
