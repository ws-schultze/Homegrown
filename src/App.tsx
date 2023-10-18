import "./css/addressAutoCompleteForm.css";
import "./scss/index.scss";
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
import PrivateRoute from "./components/shared/privateRoute/PrivateRoute";
import RootBoundary from "./components/pages/rootBoundary/RootBoundary";
import Root from "./components/pages/root/Root";
import ContactLandlordPage from "./components/pages/contactLandlordPage/ContactLandlordPage";
import EditListingPage from "./components/pages/editListingPage/EditListingPage";
import CreateListingPage from "./components/pages/createListingPage/CreateListingPage";
import ProfilePage from "./components/pages/profilePage/ProfilePage";
import ExploreListingsPage from "./components/pages/exploreListingsPage/ExploreListingsPage";
import HomePage from "./components/pages/homePage/HomePage";
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
      <Route index element={<HomePage />} />
      <Route path="/explore-listings" element={<ExploreListingsPage />}>
        <Route path=":place" element={<ExploreListingsPage />} />
        <Route
          path="details/:listingAddress/:listingId"
          element={<ExploreListingsPage />}
        />
      </Route>
      <Route path={"forgot-password/"} element={<ForgotPasswordPage />} />
      <Route path="profile/" element={<PrivateRoute />}>
        <Route path="" element={<ProfilePage />} />
      </Route>
      <Route path="sign-in/" element={<SignInPage />} />
      <Route path="sign-up/" element={<SignUpPage />} />
      <Route path="create-listing/" element={<CreateListingPage />} />
      <Route path="edit-listing/:listingId/" element={<EditListingPage />} />
      <Route
        path="contact/:landlordId/:listingId/"
        element={<ContactLandlordPage />}
      />
      \
    </Route>
  )
);

export default function App(): JSX.Element {
  return <RouterProvider router={appRouter} />;
}
