import styled from "styled-components";
import { ReactComponent as MoonSVG } from "../../../assets/svg/moonIcon.svg";
import { ReactComponent as SunSVG } from "../../../assets/svg/sun-regular.svg";

export const Sun = styled(SunSVG)`
  fill: orange;
`;

export const Moon = styled(MoonSVG)`
  fill: var(--color-primary);
`;
