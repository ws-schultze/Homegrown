import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "../../common/loaders/Spinner";
import OAuth from "../../common/oAuth/OAuth";
import SignInBtn from "./components/signInButton/SignInBtn";
import styles from "./styles.module.scss";
import { TypeStr } from "../../..";
import PasswordInput, {
  Password,
  initPassword,
} from "../../common/passwordInput/PasswordInput";
import EmailInput, {
  Email,
  initEmail,
} from "../../common/emailInput/EmailInput";

export default function SignIn() {
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
        email.value,
        password.value
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
    setIsLoading(false);
  };

  function handleInputTypeStr(
    object: TypeStr,
    fieldName: keyof typeof formData
  ) {
    setFormData((s) => ({
      ...s,
      [fieldName]: object,
    }));
  }

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
      <div className="page-wrap">
        <div className={styles["container"]}>
          <form>
            <EmailInput emit={handleEmail} />
            <PasswordInput emit={handlePassword} />
            <SignInBtn emit={handleSubmit} />
            <Link to="/forgot-password" className={styles["link"]}>
              Forgot Password
            </Link>
            <Link to="/sign-up" className={styles["link"]}>
              Create an Account
            </Link>
            <OAuth />
          </form>
        </div>
      </div>
    </>
  );
}
