import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import LogoSVGDarkMode from "./assets/github-mark.svg";
import styles from "../styles.module.scss";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { useNavigate } from "react-router";

//https://firebase.google.com/docs/auth/web/github-auth?authuser=0&hl=en

export default function GitHubOAuth() {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GithubAuthProvider();

  async function handleClick() {
    try {
      // Sign user in
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user in database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exit, create one
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      // https://cloud.google.com/identity-platform/docs/link-accounts#handling_the_account-exists-with-different-credential_error
      // User tries to sign in with github.
      await signInWithPopup(auth, provider).catch((err) => {
        console.error(err);
        // User's email already exists.
        if (err.code === "auth/account-exists-with-different-credential") {
          // The pending Github credential.
          var pendingCred = err.credential;
          // The provider account's email address.
          var email = err.email;
          // Get the sign-in methods for this email.
          fetchSignInMethodsForEmail(auth, email).then((methods) => {
            // If the user has several sign-in methods, the first method
            // in the list will be the "recommended" method to use.
            if (methods[0] === "password") {
              // TODO: Ask the user for their password.
              // In real scenario, you should handle this asynchronously.
              window.alert("You already have an account with this email");
              // var password = promptUserForPassword();

              const password = "123456";

              signInWithEmailAndPassword(auth, email, password)
                .then((result) => {
                  //@ts-ignore
                  return result.user.linkWithCredential(pendingCred);
                })
                .then(() => {
                  // github account successfully linked to the existing user.
                  navigate("/");
                  // goToApp();
                });
              return;
            }
            // All other cases are external providers.

            // Construct provider object for that provider.
            // TODO: Implement getProviderForProviderId.
            //@ts-ignore
            var provider = getProviderForProviderId(methods[0]);

            // At this point, you should let the user know that they already have an
            // account with a different provider, and validate they want to sign in
            // with the new provider.
            // Note: Browsers usually block popups triggered asynchronously, so in
            // real app, you should ask the user to click on a "Continue" button
            // that will trigger signInWithPopup().
            signInWithPopup(auth, provider).then((result) => {
              // Note: Identity Platform doesn't control the provider's sign-in
              // flow, so it's possible for the user to sign in with an account
              // with a different email from the first one.

              // Link the github credential. We have access to the pending
              // credential, so we can directly call the link method.

              //@ts-ignore
              result.user.linkWithCredential(pendingCred).then((usercred) => {
                // Success.
                navigate("/");
                // goToApp();
              });
            });
          });
        }
      });
    }
  }

  return (
    <button className={styles["icon-container"]} onClick={handleClick}>
      <img src={LogoSVGDarkMode} alt="GitHub" />
    </button>
  );
}
