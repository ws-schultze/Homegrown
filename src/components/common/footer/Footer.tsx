import logoIconPNG from "../../../assets/logo/IconOnly.png";
import { FooterDiv, Logo } from "./styledComponents";

export default function Footer() {
  return (
    <FooterDiv>
      {/* <BrandDiv></BrandDiv> */}
      <Logo to={"/"}>
        <img src={logoIconPNG} alt="" />
      </Logo>
      &copy; 2023 Home Grown Development
    </FooterDiv>
  );
}
