import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import styles from "./forgotPasswordStyles.module.scss";
import EmailInput, {
  Email,
  initEmail,
} from "../../shared/inputs/emailInput/EmailInput";
import Footer from "../../shared/footer/Footer";
import { ReactComponent as BellSVG } from "./assets/bell-regular.svg";
import GoogleOAuth from "../../shared/oAuth/google/GoogleOAuth";
import { Helmet } from "react-helmet";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<Email>(initEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email.value);
      toast.success(`Password reset email was went to ${email}`);
    } catch (error) {
      toast.error("Password reset email could not be sent");
      handleEmail({
        value: "",
        errorMsg: "Required",
        valid: false,
        readOnly: false,
        required: true,
      });
    }
  }

  function handleEmail(obj: Email) {
    setEmail(obj);
  }

  return (
    <>
      <div className={styles.container}>
        <Helmet>
          <title>Homegrown | Forgot password</title>
          <meta name="forgot-password" content="forgot password" />
        </Helmet>
        <form onSubmit={handleSubmit}>
          <div className={styles.notice}>
            <BellSVG />
            <p>
              Please enter the email address associated with the account that
              you would like to recover.
            </p>
          </div>
          <EmailInput emit={handleEmail} />
          <button
            className={`btn ${styles.btn} ${styles.submit_btn}`}
            onClick={handleSubmit}
          >
            {"Send password reset email"}
          </button>
          <h4>More options</h4>
        </form>
        <div className={styles.more_options}>
          <Link to="/sign-in" className={`btn ${styles.btn}`}>
            Sign in
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
