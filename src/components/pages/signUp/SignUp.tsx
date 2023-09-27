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
import { ReactComponent as PersonIcon } from "../../../assets/svg/personIcon.svg";
import { ReactComponent as EnvelopeIcon } from "../../../assets/svg/envelopeIcon.svg";
import { ReactComponent as LockIcon } from "../../../assets/svg/lockIcon.svg";
import { ReactComponent as VisibilityIcon } from "../../../assets/svg/visibilityIcon.svg";
import OAuth from "../../common/oAuth/OAuth";

interface State {
  name?: string;
  email?: string;
  password?: string;
  timestamp?: FieldValue;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, setFormData] = useState<State>({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = state;

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This function can be used for multiple for fields (e.g. email, password etc) because it just sets the state's id value for the given item
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    // https://firebase.google.com/docs/auth/web/start?hl=en&authuser=0#sign_up_new_users
    e.preventDefault();
    try {
      // Get firebase authentication
      const auth = getAuth();

      // Create the user by returning a promise to userCredential
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email!,
        password!
      );
      // User is now created and signed in, get user info
      const user = userCredential.user;

      // Update the signed-in user's display name
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: name,
        });
      } else {
        console.log("auth.currentUser is undefined.");
      }

      // Copy the name, email, and password of the current user
      const stateCopy = { ...state };

      // Delete the password from the data copy
      delete stateCopy.password;

      // Set the timestamp for when the data is uploaded
      stateCopy.timestamp = serverTimestamp();

      console.log(stateCopy);

      // Add user data copy to database
      await setDoc(doc(db, "users", user.uid), stateCopy);

      // Redirect user to home page
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong...");
    }
  };

  return (
    <>
      <div className="page-wrap">
        {/* <header className="profileFormHeader">
          <p className="page__header">Get Started Today</p>
        </header> */}
        <form onSubmit={onSubmit} className="register-form">
          <div className="signUpNameInputDiv">
            <PersonIcon className="nameInputPersonIcon" />
            <input
              type="name"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="signUpEmailInputDiv">
            <EnvelopeIcon className="emailInputEnvelopeIcon" />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="signUpPasswordInputDiv">
            <LockIcon className="passwordInputLockIcon" />
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
              required
            />
            <VisibilityIcon
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <button type="submit" className="signInButton">
            Create Account
          </button>

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <Link to="/sign-in" className="registerLink">
            Already Have an Account
          </Link>
        </form>
        <OAuth />
      </div>
    </>
  );
}
