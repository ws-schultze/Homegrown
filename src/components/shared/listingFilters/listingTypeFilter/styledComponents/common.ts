import styled from "styled-components";

export const MENU_ITEM = styled.div<{
  isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.isSelected ? "var(--color-primary)" : "var(--color-bg-primary)"};
  font-size: 16px;
  color: ${(props) => (props.isSelected ? "black" : "var(--color-text)")};
  border-radius: 10px;
  width: fit-content;
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  cursor: pointer;

  &:hover {
    border: 1px solid var(--color-primary);
  }
`;
