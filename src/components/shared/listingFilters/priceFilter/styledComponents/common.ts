import styled from "styled-components";

export const APPLY_FILTER_BTN = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 5px;
  height: 50px;
  color: black;
  font-size: 18px;
  background: var(--color-primary);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  &:hover {
    box-shadow: 0px 0px 10px 5px #4dceec;
  }
`;
