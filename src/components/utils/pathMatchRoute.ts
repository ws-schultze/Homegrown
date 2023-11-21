import { Location } from "react-router";

export default function pathMatchRoute(
  route: string,
  location: Location
): boolean {
  if (route === location.pathname) {
    return true;
  } else {
    return false;
  }
}
