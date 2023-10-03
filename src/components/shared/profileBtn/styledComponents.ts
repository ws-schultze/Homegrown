import { Link } from "react-router-dom";
import styled from "styled-components";

export const NavbarLink = styled(Link)`
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
