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
import InputTypeStr from "../../common/inputTypeStr/InputTypeStr";
import { TypeStr } from "../../..";
import { initTypeStrReq } from "../../../initialValues";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    email: TypeStr;
    password: TypeStr;
  }>({
    email: initTypeStrReq,
    password: initTypeStrReq,
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

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <div className="page-wrap">
        <div className={styles["container"]}>
          <form>
            <InputTypeStr<typeof formData>
              size="lg"
              fieldName="email"
              placeholder="Email"
              formatType="email"
              parent={formData.email}
              emit={handleInputTypeStr}
            />

            <InputTypeStr<typeof formData>
              size="lg"
              fieldName="password"
              placeholder="Password"
              formatType="password"
              parent={formData.password}
              emit={handleInputTypeStr}
            />

            {/* <EmailInput emit={handleChange} />
            <PasswordInput emit={handleChange} /> */}
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
