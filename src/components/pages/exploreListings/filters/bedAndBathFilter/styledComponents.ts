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

export const Menu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  top: 100%;
  left: 0;
  transform: translateY(4px);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  cursor: default;
  z-index: 1;
  header {
    color: var(--color-primary);
    margin-bottom: 5px;
    border-bottom: 1px solid;
  }
  box-shadow: var(--box-shadow);
`;

export const MenuSectionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  header {
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
`;

export const MenuSection = styled.div`
  display: flex;
  gap: 5px;
`;

interface BedBathBtnProps {
  $isSelected: boolean;
}

export const BedBathBtn = styled.button<BedBathBtnProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$isSelected ? "var(--color-primary)" : "var(--color-bg-primary)"};
  font-size: 16px;
  color: ${(props) => (props.$isSelected ? "black" : "var(--color-text)")};
  border-radius: 10px;
  width: 45px;
  height: 45px;
  padding: 5px;
  border: 1px solid var(--color-border);

  &:hover {
    border: 1px solid var(--color-primary);
  }
`;

// export const ApplyFilterBtn = styled.button`
//   display: flex;
//   justify-content: center;
//   font-size: 16px;
//   padding: 5px;
//   color: black;
//   background: var(--color-primary);
//   border-radius: var(--border-radius);
//   border: 1px solid var(--color-border);
//   &:hover {
//     box-shadow: 0px 0px 10px 5px #4dceec;
//   }
// `;
