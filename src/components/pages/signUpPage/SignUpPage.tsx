import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { db } from "../../../firebase.config";
import { setDoc, doc, serverTimestamp, FieldValue } from "firebase/firestore";
import styles from "./signUpPage.module.scss";
// import { ReactComponent as PersonIcon } from "../../../assets/svg/personIcon.svg";
// import { ReactComponent as EnvelopeIcon } from "../../../assets/svg/envelopeIcon.svg";
// import { ReactComponent as LockIcon } from "../../../assets/svg/lockIcon.svg";
// import { ReactComponent as VisibilityIcon } from "../../../assets/svg/visibilityIcon.svg";
import OAuth from "../../shared/oAuth/OAuth";
import EmailInput, {
  Email,
  initEmail,
} from "../../shared/inputs/emailInput/EmailInput";
import PasswordInput, {
  Password,
  initPassword,
} from "../../shared/inputs/passwordInput/PasswordInput";
import SignUpBtn from "../../shared/signUpButton/SignUpBtn";
import UsernameInput, {
  Username,
  initUsername,
} from "../../shared/inputs/usernameInput/UsernameInput";
import Spinner from "../../shared/loaders/Spinner";

interface State {
  username: Username;
  email: Email;
  password?: Password;
  timestamp?: FieldValue;
  showPassword?: boolean;
  loading?: boolean;
}

const initState: State = {
  username: initUsername,
  email: initEmail,
  password: initPassword,
  showPassword: false,
  loading: false,
};

export default function SignUpPage() {
  const [state, setState] = useState<State>(initState);
  const navigate = useNavigate();

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    // https://firebase.google.com/docs/auth/web/start?hl=en&authuser=0#sign_up_new_users
    e.preventDefault();
    setState((s) => ({ ...s, loading: true }));

    try {
      // Get firebase authentication
      const auth = getAuth();

      // Create the user by returning a promise to userCredential
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          state.email.value,
          state.password!.value
        );

      // User is now created and signed in, get user info
      const user = userCredential.user;

      // Update the signed-in user's display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: state.username.value,
        });

        console.log("Updated display name: ", user.displayName);

        const newUser = {
          username: state.username.value,
          email: state.email.value,
          timestamp: serverTimestamp(),
        };

        // Add user data copy to database
        await setDoc(doc(db, "users", user.uid), newUser);

        // Hide loading spinner
        setState((s) => ({ ...s, loading: false }));

        console.log(state);

        // Redirect user to home page
        navigate("/");
      } else {
        console.log("auth.currentUser is undefined.");
      }
    } catch (error) {
      toast.error("Something went wrong...");
      setState((s) => ({ ...s, loading: false }));
    }
  }

  function handleUserName(username: Username) {
    setState((s) => ({
      username: username,
      email: s.email,
      password: s.password,
      loading: s.loading,
      showPassword: s.showPassword,
    }));
  }

  function handleEmail(email: Email) {
    setState((s) => ({
      username: s.username,
      email: email,
      password: s.password,
      loading: s.loading,
      showPassword: s.showPassword,
    }));
  }

  function handlePassword(password: Password) {
    setState((s) => ({
      username: s.username,
      email: s.email,
      password: password,
      loading: s.loading,
      showPassword: s.showPassword,
    }));
  }

  if (state.loading) {
    return <Spinner size="small" />;
  }

  return (
    <div className="page-wrap">
      <div className={styles.container}>
        <form id="sign-up-form">
          <UsernameInput emit={handleUserName} />
          <EmailInput emit={handleEmail} />
          <PasswordInput emit={handlePassword} />
          <div className={styles.btns}>
            <SignUpBtn emit={handleSubmit} />
            <Link to="/forgot-password" className={styles.link}>
              Forgot password
            </Link>
            <Link to="/sign-in" className={styles.link}>
              Already have an account?
            </Link>
            <OAuth />
          </div>
        </form>
      </div>
    </div>
  );
}
