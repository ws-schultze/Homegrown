import styled from "styled-components";

export const PageWrap = styled.div`
  display: flex;
  gap: 5px;
  height: calc(100vh - var(--height-navbar));
  margin-top: var(--height-navbar);
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--height-navbar));

  main {
    position: relative;
    display: flex;
    height: calc(100vh - var(--height-navbar));
    overflow: hidden;
  }
`;

export const FiltersBar = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 5px;
  gap: 5px;
  height: 64px;
`;

export const SearchBox = styled.input`
  width: 500px;
  height: 100%;
  border-radius: var(--border-radius);
  padding: 0 10px;
  color: var(--color-text);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  font-size: 1.2rem;

  &:focus {
    outline: 1px solid var(--color-primary) !important;
  }
`;

export const ListingCardsWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 755px;
  gap: 5px;
  overflow: hidden scroll;
  color: var(--color-text);
  padding: 0px;
  display: flex;
  flex-direction: column;
  width: 755px;
  gap: 5px;
  overflow: hidden scroll;
  color: var(--color-text);
  padding: 0px;
`;

export const SearchResultsHeader = styled.header`
  color: var(--color-text);
  padding: 10px;
  font-size: 18px;
  border-radius: 5px;
  margin: 5px 5px 0;

  p {
    padding: 0;
    margin: 0;
    font-size: 16px;
  }
`;

export const ListingCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--color-text);
  height: 100%;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 0px;
    padding: 0px;
    justify-content: center;
    flex-grow: 1;

    li {
      list-style-type: none;
    }
  }
`;

export const MapContainer = styled.div`
  height: 100%;
  width: calc(100vw - var(--width-map-page__listing-cards));
  background: var(--color-bg-primary);
`;
