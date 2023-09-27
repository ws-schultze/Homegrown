import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 1024px;
  margin: auto;
`;

export const MainSlide = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export const MainSlideImg = styled.img`
  width: 100%;
  object-fit: cover;
`;

export const MainSlideDetails = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-bg-primary) !important;
  box-shadow: var(--box-shadow);
`;

export const Detail = styled.div`
  color: var(--color-text);
  display: flex;
  font-weight: 600;
`;
