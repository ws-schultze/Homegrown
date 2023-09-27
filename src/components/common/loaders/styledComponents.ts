import styled from "styled-components";

export const LargeContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  //   background-color: rgba(0, 0, 0, 0.5);
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SmallContainer = styled.div`
  height: 100%;
  width: 100%;
  //   background-color: rgba(0, 0, 0, 0.5);
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const SpinnerWheel = styled.div`
  width: 64px;
  height: 64px;
  border: 8px solid;
  border-color: var(--color-primary) transparent var(--color-primary)
    transparent;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
`;
