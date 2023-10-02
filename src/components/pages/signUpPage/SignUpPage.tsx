import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../../firebase.config";
import { setDoc, doc, serverTimestamp, FieldValue } from "firebase/firestore";
import styles from "./signUpPageStyles.module.scss";
// import { ReactComponent as PersonIcon } from "../../../assets/svg/personIcon.svg";
// import { ReactComponent as EnvelopeIcon } from "../../../assets/svg/envelopeIcon.svg";
// import { ReactComponent as LockIcon } from "../../../assets/svg/lockIcon.svg";
// import { ReactComponent as VisibilityIcon } from "../../../assets/svg/visibilityIcon.svg";
import OAuth from "../../common/oAuth/OAuth";
import EmailInput, {
  Email,
  initEmail,
} from "../../common/emailInput/EmailInput";
import PasswordInput, {
  Password,
  initPassword,
} from "../../common/passwordInput/PasswordInput";
import SignUpBtn from "../../common/signUpButton/SignUpBtn";
import UsernameInput, {
  Username,
  initUsername,
} from "../../common/usernameInput/UsernameInput";

interface State {
  name: Username;
  email: Email;
  password: Password;
  timestamp?: FieldValue;
  showPassword: boolean;
}

const initState: State = {
  name: initUsername,
  email: initEmail,
  password: initPassword,
  showPassword: false,
};

export default function SignUpPage() {
  const [state, setFormData] = useState<State>(initState);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // https://firebase.google.com/docs/auth/web/start?hl=en&authuser=0#sign_up_new_users
    e.preventDefault();
    try {
      // Get firebase authentication
      const auth = getAuth();

      // Create the user by returning a promise to userCredential
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.email.value,
        state.password.value
      );
      // User is now created and signed in, get user info
      const user = userCredential.user;

      // Update the signed-in user's display name
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: state.name.value,
        });
      } else {
        console.log("auth.currentUser is undefined.");
      }

      // Copy the name, email, and password of the current user
      const stateCopy = { ...state };

      // Delete the password from the data copy
      //@ts-ignore
      delete stateCopy.password;

      // Set the timestamp for when the data is uploaded
      stateCopy.timestamp = serverTimestamp();

      // Add user data copy to database
      await setDoc(doc(db, "users", user.uid), stateCopy);

      // Redirect user to home page
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong...");
    }
  };

  const handleUserName = (obj: Username) => {
    setFormData((s) => ({
      ...s,
      userName: obj,
    }));
  };

  const handleEmail = (obj: Email) => {
    setFormData((s) => ({
      ...s,
      email: obj,
    }));
  };

  const handlePassword = (obj: Password) => {
    setFormData((s) => ({
      ...s,
      password: obj,
    }));
  };

  return (
    <div className="page-wrap">
      <div className={styles.container}>
        <form>
          <UsernameInput emit={handleUserName} />
          <EmailInput emit={handleEmail} />
          <PasswordInput emit={handlePassword} />
          <SignUpBtn emit={handleSubmit} />
          <Link to="/forgot-password" className={styles.link}>
            Forgot password
          </Link>
          <Link to="/sign-in" className={styles.link}>
            Sign in to an existing account
          </Link>
          <OAuth />
        </form>
      </div>
    </div>
  );
}
