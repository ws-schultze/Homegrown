import styled from "styled-components";

export const Container = styled.div`
  background: var(--color-bg-secondary);
  display: flex;
  flex-grow: 1;
  height: calc(100vh - var(--height-navbar));
  margin-top: var(--height-navbar);
  font-size: 36px;
  color: var(--color-primary);
  align-items: center;
  justify-content: center;
`;
