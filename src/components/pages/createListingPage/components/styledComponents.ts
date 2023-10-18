import styled from "styled-components";

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

export const Notice = styled.div`
  font-size: 16px;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
  svg {
    fill: var(--color-primary);
    height: 30px;
    min-width: 30px;
  }
`;
