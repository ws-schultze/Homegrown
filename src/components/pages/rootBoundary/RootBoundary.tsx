import { isRouteErrorResponse, useRouteError } from "react-router";
import { Container } from "./styledComponents";

export default function RootBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <Container>
          This page doesn't exist! <br />
          Error {error.data}
        </Container>
      );
    } else if (error.status === 401) {
      return (
        <Container>
          You aren't authorized to see this <br />
          {error.data}
        </Container>
      );
    } else if (error.status === 503) {
      return (
        <Container>
          Looks like our API is down <br />
          {error.data}
        </Container>
      );
    } else if (error.status === 418) {
      return (
        <Container>
          🫖 <br />
          {error.data}
        </Container>
      );
    } else {
      return (
        <Container>
          Awe snap... Something didn't work <br /> Error {error.data}
        </Container>
      );
    }
  } else {
    //@ts-ignore
    return <Container>Something went wrong: {error.message}</Container>;
  }
}
