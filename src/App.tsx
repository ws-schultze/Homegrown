import "./css/addressAutoCompleteForm.css";
import "./css/index.css";
import "./css/navbar.css";
import "./css/dropdown.css";
import "./css/listing-page.css";
import "./css/listing-form.css";
import "./css/loaders.css";
import "./css/theme-toggle-btn.css";
import "react-toastify/dist/ReactToastify.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import PrivateRoute from "./components/common/privateRoute/PrivateRoute";
import RootBoundary from "./components/pages/rootBoundary/RootBoundary";
import Root from "./components/pages/root/Root";
import ContactLandlord from "./components/pages/contactLandlord/ContactLandlord";
import EditListing from "./components/pages/editListing/EditListing";
import CreateListing from "./components/pages/createListing/CreateListing";
import Profile from "./components/pages/profile/Profile";
import ExploreListings from "./components/pages/exploreListings/ExploreListings";
import Home from "./components/pages/home/Home";
import SignInPage from "./components/pages/signInPage/SignInPage";
import SignUpPage from "./components/pages/signUpPage/SignUpPage";
import ForgotPasswordPage from "./components/pages/forgotPasswordPage/ForgotPasswordPage";

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      errorElement={
        <Root>
          <RootBoundary />
        </Root>
      }
    >
      \
      <Route index element={<Home />} />
      <Route path="/explore-listings" element={<ExploreListings />}>
        <Route path=":place" element={<ExploreListings />} />
        <Route
          path="details/:listingAddress/:listingId"
          element={<ExploreListings />}
        />
      </Route>
      <Route path={"forgot-password/"} element={<ForgotPasswordPage />} />
      <Route path="profile/" element={<PrivateRoute />}>
        <Route path="" element={<Profile />} />
      </Route>
      <Route path="sign-in/" element={<SignInPage />} />
      <Route path="sign-up/" element={<SignUpPage />} />
      <Route path="create-listing/" element={<CreateListing />} />
      <Route path="edit-listing/:listingId/" element={<EditListing />} />
      <Route
        path="contact/:landlordId/:listingId/"
        element={<ContactLandlord />}
      />
      \
    </Route>
  )
);

export default function App(): JSX.Element {
  return <RouterProvider router={appRouter} />;
}
