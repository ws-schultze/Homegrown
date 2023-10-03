import { Link } from "react-router-dom";
import styled from "styled-components";

export const FooterDiv = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 5px;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  color: var(--color-text);
  padding: 20px;
  align-items: center;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
`;

export const Logo = styled(Link)`
  color: blue;
  height: 50px;
  img {
    height: inherit;
  }
`;
