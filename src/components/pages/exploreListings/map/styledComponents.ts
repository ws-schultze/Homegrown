import styled from "styled-components";

export const MapZoomInBtn = styled.button`
  width: 40px;
  height: 40px;
  margin: 10px 0 0 0;
  background: var(--color-bg-primary);
  color: var(--color-text);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: var(--color-text);
    height: 20px;
  }

  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);

    svg {
      fill: var(--color-primary);
    }
  }
`;

export const MapZoomOutBtn = styled.button`
  width: 40px;
  height: 40px;
  margin-top: 10px;
  background: var(--color-bg-primary);
  color: var(--color-text);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: var(--color-text);
    height: 20px;
  }

  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);

    svg {
      fill: var(--color-primary);
    }
  }
`;

export const MapZoomControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 10px;
`;

export const MapFullScreenBtnContainer = styled.div`
  margin: 0 10px;
`;

export const MapFullScreenBtn = styled.button`
  width: 40px;
  height: 40px;
  margin: 0 0 0 0;
  background: var(--color-bg-primary);
  color: var(--color-text);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: var(--color-text);
    height: 20px;
  }

  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);

    svg {
      fill: var(--color-primary);
    }
  }
`;

export const MapBoundaryBtn = styled.button`
  height: 40px;
  margin: 10px;
  font-size: 1.2rem;
  background: var(--color-bg-primary);
  color: var(--color-text);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;

  &:hover {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
`;
