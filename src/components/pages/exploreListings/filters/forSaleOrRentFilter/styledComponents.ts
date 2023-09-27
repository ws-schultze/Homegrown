import styled from "styled-components";
import { ReactComponent as Icon } from "../../../../../assets/svg/dropdownIcon.svg";

interface ContainerProps {
  $inUse: boolean;
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
  width: 230px;
  font-size: 1.2rem;
  border-radius: var(--border-radius);
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

export const Menu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  cursor: default;
  gap: 10px;
  padding: 10px;
  top: 100%;
  left: 0;
  transform: translateY(4px);
  width: inherit;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  z-index: 1;
  box-shadow: var(--box-shadow);
`;

export const Radio = styled.div`
  cursor: pointer;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="radio" i] {
    width: 20px;
    height: 20px;
    background-color: var(--color-primary);
    cursor: pointer;
    appearance: auto;
    box-sizing: border-box;
    margin: 0;
    padding: initial;
    border: initial;
  }
`;
