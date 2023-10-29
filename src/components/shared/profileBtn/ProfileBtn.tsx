import { useUserContext } from "../../../UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { NavbarLink } from "./styledComponents";

interface Props {
  /**
   * Closes the mobile nav menu when the link is clicked
   */
  closeMenu?: () => void;
}

export default function ProfileBtn({ closeMenu }: Props) {
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
          onClick={closeMenu}
          className={pathMatchRoute("/sign-in") ? "active" : ""}
        >
          Sign In
        </NavbarLink>
      ) : (
        <NavbarLink
          to={"/profile"}
          onClick={closeMenu}
          className={pathMatchRoute("/profile") ? "active" : ""}
        >
          Profile
        </NavbarLink>
      )}
    </>
  );
}
