import styled, { keyframes } from "styled-components";
import { ReactComponent as Icon } from "../../../../../assets/svg/dropdownIcon.svg";
import { DropdownStyles } from "../../../../../types";

interface ContainerProps {
  inUse: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border: 1px solid
    ${(p) => (p.inUse ? "var(--color-primary)" : "var(--color-border)")};
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
`;

interface BtnProps {
  // $inUse: boolean;
  styles: DropdownStyles;
}

export const Btn = styled.div<BtnProps>`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
  /* gap: 1rem; */
  cursor: pointer;
  width: ${(p) => p.styles.btnWidth};
  height: ${(p) => p.styles.btnHeight};
  font-size: 1.2rem;
  /* border-radius: 5px; */
  color: var(--color-text);
  /* background: var(--color-bg-primary); */
`;

export const BtnIconWrap = styled.div`
  display: flex;
`;

interface IconProps {
  $flipped: boolean;
}

export const BtnIcon = styled(Icon)<IconProps>`
  transform: ${(props) =>
    props.$flipped ? "rotateX(180deg)" : "rotateX(0deg)"};
  fill: ${(props) => props.fill};
  height: 1.5rem;
  fill: var(--color-text);
  transition: 0.1s linear;
  ${Btn}:hover & {
    fill: var(--color-primary);
  }
`;

const openMenu = keyframes`
  0%{
    height: 0px; 
    padding: 0px;
    visibility: hidden; 
    opacity:0; 
    margin-top:0; 
  }
  25%{
    height: 50%; 
    padding: 10px; 
    visibility: 
    hidden;opacity:0; 
    margin-top:10px;
  }
  50%{
    height: 100%; 
    padding: 10px; 
    visibility: visible; 
    opacity:0; 
    margin-top:10px;
  }
  75%{
    height: 100%; 
    padding: 10px; 
    visibility: visible; 
    opacity:0; 
    margin-top:10px;
  }
  100%{
    height: 100%; 
    padding: 10px; 
    visibility: visible; 
    opacity:0; 
    margin-top:10px;
    }
`;

interface MenuProps {
  styles: DropdownStyles;
}

export const Menu = styled.div<MenuProps>`
  /* width: 0; */
  height: 0;
  visibility: hidden;
  opacity: 0;
  transition: 0.1s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* top: 100%; */
  /* left: 0; */
  /* transform: translateY(4px); */
  min-width: ${(props) => props.styles.menuMinWidth};
  max-width: ${(props) => props.styles.menuMaxWidth};
  /* background: var(--color-bg-primary); */
  /* border: 1px solid var(--color-border); */
  /* border-radius: 5px; */
  /* z-index: 1; */
  cursor: default;
  /* box-shadow: var(--box-shadow); */
  &.open {
    visibility: visible;
    opacity: 1;
    padding: 10px;
    height: max-content;
  }
  &.closed {
    visibility: hidden;
    opacity: 0;
    padding: 0;
    height: 0;
  }
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
