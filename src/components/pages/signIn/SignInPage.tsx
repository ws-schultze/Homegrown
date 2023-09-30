import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "../../common/loaders/Spinner";
import OAuth from "../../common/oAuth/OAuth";
import SignInBtn from "./components/signInButton/SignInBtn";
import EmailInput from "./components/emailInput/EmailInput";
import PasswordInput from "./components/passwordInput/PasswordInput";
import styles from "./styles.module.scss";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  function handleChange(id: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <div className="page-wrap">
        <div className={styles["container"]}>
          <form>
            <EmailInput emit={handleChange} />
            <PasswordInput emit={handleChange} />
            <SignInBtn emit={handleSubmit} />
            <Link to="/forgot-password" className={styles["link"]}>
              Forgot Password
            </Link>
            <Link to="/sign-up" className={styles["link"]}>
              Create an Account
            </Link>
          </form>
          <OAuth />
        </div>
      </div>
    </>
  );
}
