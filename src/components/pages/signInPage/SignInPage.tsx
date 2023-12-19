import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "../../shared/loaders/Spinner";
import styles from "./signInPage.module.scss";
import PasswordInput, {
  Password,
  initPassword,
} from "../../shared/inputs/passwordInput/PasswordInput";
import EmailInput, {
  Email,
  initEmail,
} from "../../shared/inputs/emailInput/EmailInput";
import Footer from "../../shared/footer/Footer";
import GoogleOAuth from "../../shared/oAuth/google/GoogleOAuth";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    email: Email;
    password: Password;
  }>({
    email: initEmail,
    password: initPassword,
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      if (userCredential.user) {
        navigate("/");
      } else {
        console.error(`Bad user credentials: ${userCredential}`);
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
    setIsLoading(false);
  };

  function handleEmail(obj: Email) {
    setFormData((s) => ({
      ...s,
      email: obj,
    }));
  }

  function handlePassword(obj: Password) {
    setFormData((s) => ({
      ...s,
      password: obj,
    }));
  }

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <div className={styles.container}>
        <form>
          <EmailInput emit={handleEmail} />
          <PasswordInput emit={handlePassword} />
          <button
            className={`btn ${styles.btn} ${styles.submit_btn}`}
            onClick={handleSubmit}
          >
            {"Sign in"}
          </button>
          <h4>More options</h4>
        </form>
        <div className={styles.more_options}>
          <Link to="/forgot-password" className={`btn ${styles.btn}`}>
            Forgot password
          </Link>
          <Link to="/sign-up" className={`btn ${styles.btn}`}>
            Create an account
          </Link>
          <GoogleOAuth />
        </div>
      </div>
      <Footer />
    </>
  );
}
