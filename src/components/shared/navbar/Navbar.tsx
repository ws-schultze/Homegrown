import { TypeTheme, useThemeContext } from "../../../ThemeProvider";
import { useLocation } from "react-router-dom";
import logoPNG from "../../../assets/logo/logo.png";
import ProfileBtn from "../profileBtn/ProfileBtn";
import pathMatchRoute from "../../utils/pathMatchRoute";
import {
  Container,
  Nav,
  NavLeft,
  NavLink,
  NavLogo,
  NavRight,
} from "./styledComponents";
import ThemeBtn from "../themeBtn/ThemeBtn";
import { useAppSelector } from "../../../redux/hooks";

export default function Navbar({ theme }: { theme: TypeTheme }) {
  const location = useLocation();
  const { toggleTheme } = useThemeContext();
  const placeFilter = useAppSelector((state) => state.placeFilter);

  function navigateToMapPage(): string {
    if (placeFilter.place) {
      const place = JSON.parse(placeFilter.place);
      return `/explore-listings/${place.formatted_address}`;
    } else {
      return `/explore-listings/`;
    }
  }

  return (
    <Container>
      <Nav>
        <NavLeft>
          <NavLink
            to={navigateToMapPage()}
            className={pathMatchRoute("/listings", location) ? "active" : ""}
          >
            Explore Listings
          </NavLink>

          <NavLink
            to={"/create-listing"}
            className={pathMatchRoute("/listings", location) ? "active" : ""}
          >
            Create a Listing
          </NavLink>
        </NavLeft>

        <NavLogo to={"/"}>
          <img src={logoPNG} alt="" />
        </NavLogo>

        <NavRight>
          <ProfileBtn />
          <ThemeBtn onChange={() => toggleTheme()} theme={theme} />
        </NavRight>
      </Nav>
    </Container>
  );
}
