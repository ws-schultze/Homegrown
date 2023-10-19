import styled from "styled-components";
import { ReactComponent as Icon } from "./dropdownIcon.svg";
import { DropdownStyles } from "../../../../types/index";

// ABSOLUTE MENU COMPS START HERE

export const A_CONTAINER = styled.div<{
  $inUse: boolean;
  styles: DropdownStyles;
}>`
  position: relative;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
  gap: 1rem;
  cursor: pointer;
  width: ${(p) => p.styles.btnWidth};
  height: ${(p) => p.styles.btnHeight};
  font-size: 1.2rem;
  border-radius: 5px;
  color: var(--color-text);
  background: var(--color-bg-primary);
  border: 1px solid
    ${(props) =>
      props.$inUse ? "var(--color-primary)" : "var(--color-border)"};
`;

export const A_CONTAINER_ICON_WRAP = styled.div`
  display: flex;
`;

export const A_CONTAINER_ICON = styled(Icon)<{
  $flipped: boolean;
}>`
  transform: ${(props) =>
    props.$flipped ? "rotateX(180deg)" : "rotateX(0deg)"};
  fill: ${(props) => props.fill};
  height: 1.5rem;
  fill: var(--color-text);
  transition: 0.1s linear;
  ${A_CONTAINER}:hover & {
    fill: var(--color-primary);
  }
`;

export const A_MENU = styled.div<{
  styles: DropdownStyles;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  top: 100%;
  left: 0;
  transform: translateY(4px);
  min-width: ${(props) => props.styles.menuMinWidth};
  max-width: ${(props) => props.styles.menuMaxWidth};
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  z-index: 1;
  cursor: default;
  box-shadow: var(--box-shadow);
`;

export const A_MENU_ITEM = styled.div<{
  $isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.$isSelected ? "var(--color-primary)" : "var(--color-bg-primary)"};
  font-size: 16px;
  color: ${(props) => (props.$isSelected ? "black" : "var(--color-text)")};
  border-radius: 10px;
  width: fit-content;
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  cursor: pointer;

  &:hover {
    border: 1px solid var(--color-primary);
  }
`;

// FLEX MENU COMPS START HERE

export const F_CONTAINER = styled.div<{ inUse: boolean }>`
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

export const F_BTN_ICON = styled(Icon)<{ $flipped: boolean }>`
  transform: ${(props) =>
    props.$flipped ? "rotateX(180deg)" : "rotateX(0deg)"};
  fill: ${(props) => props.fill};
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

export const F_MENU_ITEM = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.$isSelected ? "var(--color-primary)" : "var(--color-bg-primary)"};
  font-size: 16px;
  color: ${(props) => (props.$isSelected ? "black" : "var(--color-text)")};
  border-radius: 10px;
  width: fit-content;
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  cursor: pointer;

  &:hover {
    border: 1px solid var(--color-primary);
  }
`;
