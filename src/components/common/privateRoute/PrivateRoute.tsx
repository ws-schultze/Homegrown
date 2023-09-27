import { Navigate, Outlet } from "react-router-dom";
// import { CurrentUserContext } from '../AuthProvider'
import { useUserContext } from "../../../UserProvider";

// import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from "../loaders/Spinner";

// This private route will make it so that only signed in users
// can view the profile page. If the client is not signed in, if they
// click on the profile link, it will take them to the sign in page.
const PrivateRoute = () => {
  // Use our custom hook
  // const { isSignedIn, checkingUserStatus } = useContext(CurrentUserContext)
  const userContext = useUserContext();
  const { isAuthenticated, isLoading } = userContext;

  if (isLoading) {
    return <Spinner size="large" />;
  } else {
    // In App.js, pass in the profile component as the Outlet if signed in
    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
  }
};
export default PrivateRoute;
