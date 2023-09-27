import styled from "styled-components";

export const RootLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: var(--color-primary);
  background: var(--color-bg-primary);

  main.loading div {
    opacity: 0.5;
  }
`;
