import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as EnvelopeIcon } from "../../../assets/svg/envelopeIcon.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset email was went to ${email}`);
    } catch (error) {
      toast.error("Password reset email could not be sent...");
    }
  };

  return (
    <div className="page-wrap">
      <header>
        <p className="page__header">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
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
          {/* <Link className='forgotPasswordLink' to='/sign-in'>
            Sign In
          </Link> */}
          {/* <div className='signInBar'>
            <div className='signInText'>Reset Password</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div> */}
          <button
            className="primary-btn passwordResetButton"
            onClick={onSubmit}
          >
            Send Password Reset Email
          </button>

          <Link to="/sign-in" className="registerLink">
            Sign In
          </Link>

          <Link to="/sign-up" className="registerLink">
            Create Account
          </Link>
        </form>
      </main>
    </div>
  );
}
