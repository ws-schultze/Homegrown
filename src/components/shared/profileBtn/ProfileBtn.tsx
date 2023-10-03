import { useUserContext } from "../../../UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { NavbarLink } from "./styledComponents";

export default function ProfileBtn() {
  const { isAuthenticated } = useUserContext();
  const location = useLocation();
  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <NavbarLink
          to={"/sign-in"}
          className={pathMatchRoute("/sign-in") ? "active" : ""}
        >
          Sign In
        </NavbarLink>
      ) : (
        <NavbarLink
          to={"/profile"}
          className={pathMatchRoute("/profile") ? "active" : ""}
        >
          Profile
        </NavbarLink>
      )}
    </>
  );
}
