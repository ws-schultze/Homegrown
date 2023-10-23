import styled from "styled-components";

export const MENU_SECTION_WRAP = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  header {
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
`;

export const MENU_SECTION = styled.div`
  display: flex;
  gap: 5px;
`;

interface BED_BATH_BTN_PROPS {
  $isSelected: boolean;
}

export const BED_BATH_BTN = styled.button<BED_BATH_BTN_PROPS>`
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
