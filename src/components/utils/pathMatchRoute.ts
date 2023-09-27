import { Location } from "react-router";

export default function pathMatchRoute(
  route: string,
  location: Location
): boolean {
  // console.log(`route: ${route}, location.pathname: ${location.pathname}`);
  if (route === location.pathname) {
    return true;
  } else {
    return false;
  }
}
