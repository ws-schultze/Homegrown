import Error from "../error/Error";
import {
  LargeContainer,
  SmallContainer,
  SpinnerWheel,
} from "./styledComponents";

export default function Spinner({
  size,
}: {
  size: "large" | "small";
}): JSX.Element {
  if (size === "large") {
    return (
      <LargeContainer>
        <SpinnerWheel />
      </LargeContainer>
    );
  } else if (size === "small") {
    return (
      <SmallContainer>
        <SpinnerWheel />
      </SmallContainer>
    );
  } else {
    return <>Something went wrong...</>;
  }
}
