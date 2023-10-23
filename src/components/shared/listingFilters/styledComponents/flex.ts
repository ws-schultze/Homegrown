import styled from "styled-components";
import { ReactComponent as Icon } from "./assets/chevron-down.svg";
import { DropdownStyles } from "../../../../types";

export const F_CONTAINER = styled.div<{ inUse?: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid
    ${(p) => (p.inUse ? "var(--color-primary)" : "var(--color-border)")};
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
`;

export const F_BTN = styled.div<{ styles: DropdownStyles }>`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  width: ${(p) => p.styles.btnWidth};
  min-height: ${(p) => p.styles.btnHeight};
  max-height: ${(p) => p.styles.btnHeight};
  font-size: 1.2rem;
  color: var(--color-text);
`;

export const F_BTN_ICON_WRAP = styled.div`
  display: flex;
`;

interface F_BTN_ICON_PROPS {
  flipped: boolean;
}

export const F_BTN_ICON = styled(Icon)<F_BTN_ICON_PROPS>`
  transform: ${(p) => (p.flipped ? "rotateX(180deg)" : "rotateX(0deg)")};
  height: 1.5rem;
  fill: var(--color-text);
  transition: 0.1s linear;
  ${F_BTN}:hover & {
    fill: var(--color-primary);
  }
`;

export const F_MENU = styled.div<{ styles: DropdownStyles }>`
  height: 0;
  visibility: hidden;
  opacity: 0;
  transition: 0.1s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: ${(props) => props.styles.menuMinWidth};
  max-width: ${(props) => props.styles.menuMaxWidth};
  cursor: default;
  &.open {
    visibility: visible;
    opacity: 1;
    padding: 0 10px 10px 10px;
    height: 100%;
  }
  &.closed {
    visibility: hidden;
    opacity: 0;
    padding: 0;
    height: 0;
  }
`;
