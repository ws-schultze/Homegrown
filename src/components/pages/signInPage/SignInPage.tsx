import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "../../shared/loaders/Spinner";
import OAuth from "../../shared/oAuth/OAuth";
import SignInBtn from "../../shared/signInButton/SignInBtn";
import styles from "./signInPage.module.scss";
import PasswordInput, {
  Password,
  initPassword,
} from "../../shared/inputs/passwordInput/PasswordInput";
import EmailInput, {
  Email,
  initEmail,
} from "../../shared/inputs/emailInput/EmailInput";

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
    console.log("Signing user in");
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
    <div className={"page-wrap"}>
      <div className={styles.container}>
        <form>
          <EmailInput emit={handleEmail} />
          <PasswordInput emit={handlePassword} />
          <div className={styles.btns}>
            <SignInBtn emit={handleSubmit} />
            <Link to="/forgot-password" className={styles.link}>
              Forgot password
            </Link>
            <Link to="/sign-up" className={styles.link}>
              Create an account
            </Link>
            <OAuth />
          </div>
        </form>
      </div>
    </div>
  );
}
