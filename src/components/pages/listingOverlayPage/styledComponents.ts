import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  background: #000000c7;
  height: 100vh;
  overflow: hidden;
  top: 0;
  z-index: 9999;
`;

export const Overlay = styled.div`
  width: 1436px;
  min-width: 1436px;
  height: fit-content;
  min-height: 100vh;
  background: var(--color-bg-primary);
`;

export const Page = styled.div`
  display: flex;
  margin: auto;
`;

export const MapContainer = styled.div`
  width: 100%;
  min-height: 300px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  overflow: hidden;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 600px;
`;

export const InfoHeader = styled.header`
  display: flex;
  height: 64px;
  padding: 10px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  // border-bottom: none;

  img {
    height: 40px;
  }
`;

export const InfoHeaderBtns = styled.div`
  display: flex;
  gap: 5px;
  margin-left: auto;
`;

export const Btn = styled.button`
  position: relative;
  color: var(--color-text);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  z-index: 2;

  svg {
    height: 25px;
    width: 25px;
    fill: var(--color-text);
  }

  label {
    cursor: pointer;
    color: var(--color-text);
  }

  &:hover {
    background: var(--color-primary);
    border: 1px solid black;
    color: black;
    svg {
      fill: black;
    }
    label {
      color: black;
    }
  }
`;

export const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  padding: 10px;
  gap: 10px;
  border-bottom: 1px solid var(--color-border);
`;

export const BasicInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  header {
    width: 100%;
    display: flex;
  }
`;

export const Specs = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
`;

export const Price = styled.p`
  font-size: 2rem;
  color: var(--color-text);
  margin: 0;
`;

export const Address = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Images = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  background: var(--color-bg-secondary);
  flex-grow: 1;
  height: 100vh;
  overflow-y: scroll;
`;

export const SmallImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-bottom: 5px;
`;

export const CoverImg = styled.img`
  width: 100%;
  max-height: 80vh;
  object-fit: cover;
`;

export const SmallImg = styled.img`
  width: 408px;
  max-height: 275px;
  object-fit: cover;
`;

export const ListedBy = styled.div`
  line-height: 25px;
`;

export const Overview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  flex-grow: 1;
  min-width: 600px;
  overflow-y: scroll;
  color: var(--color-text);
  // border-bottom: 1px solid var(--color-border);
  header {
    color: var(--color-text);
    font-size: 2rem;
    padding: 10px 0;
    background: var(--color-bg-primary);
    // border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  gap: 10px;
  padding: 10px 0;
  svg {
    fill: var(--color-primary);
    height: 25px;
    width: 25px;
  }
`;

export const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
