import { Link } from "react-router-dom";
import styled from "styled-components";

export const BtnsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  width: -moz-fit-content;
  width: fit-content;
  background-color: var(--color-bg-primary);
  color: var(--color-text);
  font-weight: 500;
  font-size: 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);

  svg {
    height: 100%;
    fill: var(--color-text);
  }

  &:hover {
    color: black;
    background: var(--color-primary);
    svg {
      fill: black;
    }
  }
`;

export const LinkBtn = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  width: -moz-fit-content;
  width: fit-content;
  background-color: var(--color-bg-primary);
  color: var(--color-text);
  font-weight: 500;
  font-size: 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);

  svg {
    height: 100%;
    fill: var(--color-text);
  }

  &:hover {
    color: black;
    background: var(--color-primary);
    svg {
      fill: black;
    }
  }
`;

export const Header = styled.header`
  display: flex;
  font-size: 24px;
  gap: 5px;
  color: var(--color-primary);
  width: 100%;
  align-items: center;
  border-radius: 5px;
  padding: 10px;
  justify-content: center;
`;
