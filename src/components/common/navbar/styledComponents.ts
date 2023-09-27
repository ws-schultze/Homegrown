import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: var(--height-navbar);
  background-color: var(--color-bg-primary);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  // box-shadow: var(--box-shadow);
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 100%;
  width: 100%;
`;

export const NavLeft = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  & :first-child {
    padding-left: 0 !important;
  }
`;

export const NavRight = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

interface NavLinkProps {}

export const NavLink = styled(Link)`
  color: var(--color-text);
  font-size: 1.2rem;
  text-decoration: none;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20px 10px 20px 10px;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  &:hover,
  &:focus,
  &:active,
  &.active {
    color: var(--color-primary);
  }
`;

interface NavMenuProps {}

export const NavMenuWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  cursor: default;
  gap: 10px;
  padding: 1px;
  top: 100%;
  left: 0px;
  width: 100%;
  background: var(--color-bg-primary);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0px 24px 19px 1px black;
  visibility: hidden;
  ${NavLink}:hover & {
    visibility: visible;
    z-index: 1;
  }
`;

export const NavLogo = styled(Link)`
  color: blue;
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px;
  svg {
    height: 100%;
    width: 63px;
  }
  img {
    height: 100%;
  }
`;
