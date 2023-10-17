import styled from "styled-components";
import { ReactComponent as Icon } from "../../../../../assets/svg/dropdownIcon.svg";

interface ContainerProps {
  $inUse: boolean;
  width: string;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
  gap: 1rem;
  cursor: pointer;
  width: ${(p) => p.width};
  font-size: 1.2rem;
  border-radius: 5px;
  color: var(--color-text);
  background: var(--color-bg-primary);
  border: 1px solid
    ${(props) =>
      props.$inUse ? "var(--color-primary)" : "var(--color-border)"};
`;

export const ContainerIconWrap = styled.div`
  display: flex;
`;

interface IconProps {
  $flipped: boolean;
}

export const ContainerIcon = styled(Icon)<IconProps>`
  transform: ${(props) =>
    props.$flipped ? "rotateX(180deg)" : "rotateX(0deg)"};
  fill: ${(props) => props.fill};
  height: 1.5rem;
  fill: var(--color-text);
  transition: 0.1s linear;
  ${Container}:hover & {
    fill: var(--color-primary);
  }
`;

interface MenuProps {
  width: string;
}

export const Menu = styled.div<MenuProps>`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  top: 100%;
  left: 0;
  transform: translateY(4px);
  width: ${(props) => props.width};
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  z-index: 1;
  cursor: default;
  box-shadow: var(--box-shadow);
`;

interface MenuItemProps {
  $isSelected: boolean;
}

export const MenuItem = styled.div<MenuItemProps>`
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

export const ApplyFilterBtn = styled.button`
  display: flex;
  justify-content: center;
  font-size: 16px;
  padding: 5px;
  color: black;
  background: var(--color-primary);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  &:hover {
    box-shadow: 0px 0px 10px 5px #4dceec;
  }
`;
