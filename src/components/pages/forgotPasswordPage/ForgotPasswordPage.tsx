import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import styles from "./forgotPasswordStyles.module.scss";
import EmailInput, {
  Email,
  initEmail,
} from "../../shared/inputs/emailInput/EmailInput";
import Button from "../../shared/button/Button";

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
    }
  }

  function handleEmail(obj: Email) {
    setEmail(obj);
  }

  return (
    <div className="page-wrap">
      <div className={styles.container}>
        <form className="form" onSubmit={handleSubmit}>
          <p className={styles.notice}>
            Please enter the email address associated with the account that you
            would like to recover.
          </p>
          <EmailInput emit={handleEmail} />

          <Button text="Send password reset email" emit={handleSubmit} />

          <Link to="/sign-in" className={styles.link}>
            Sign in
          </Link>

          <Link to="/sign-up" className={styles.link}>
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
}
