import styled from "styled-components";
import { ReactComponent as Icon } from "./assets/chevron-down.svg";
import * as s from "../../../../styledComponentVariables";
import { DropdownStyles } from "../../../../types";

interface A_CONTAINER_PROPS {
  inUse: boolean;
  styles: DropdownStyles;
}

export const A_CONTAINER = styled.div<A_CONTAINER_PROPS>`
  position: relative;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
  gap: 1rem;
  cursor: pointer;
  width: ${(props) => props.styles.btnWidth};
  height: ${(props) => props.styles.btnHeight};
  font-size: 1.2rem;
  border-radius: var(--border-radius);
  color: var(--color-text);
  background: var(--color-bg-primary);
  border: 1px solid
    ${(props) => (props.inUse ? "var(--color-primary)" : "var(--color-border)")};
  @media (max-width: ${s.maxWidthTablet}) {
    width: ${(props) => props.styles.btnWidth};
  }
`;

export const A_CONTAINER_ICON_WRAP = styled.div`
  display: flex;
`;

interface A_CONTAINER_ICON_PROPS {
  flipped: boolean;
}

export const A_CONTAINER_ICON = styled(Icon)<A_CONTAINER_ICON_PROPS>`
  transform: ${(props) =>
    props.flipped ? "rotateX(180deg)" : "rotateX(0deg)"};
  height: 1.5rem;
  fill: var(--color-text);
  transition: 0.1s linear;
  ${A_CONTAINER}:hover & {
    fill: var(--color-primary);
  }
`;

export const A_MENU = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  cursor: default;
  gap: 10px;
  padding: 10px;
  top: 100%;
  left: 0;
  transform: translateY(4px);
  /* width: inherit; */
  min-width: 100%;
  max-width: fit-content;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  z-index: 1;
  box-shadow: var(--box-shadow);
`;
