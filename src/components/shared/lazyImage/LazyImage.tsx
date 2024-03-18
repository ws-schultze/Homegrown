import React, { ImgHTMLAttributes } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ image }: { image: HTMLImageElement }) => (
  <div>
    <LazyLoadImage
      alt={image.alt}
      height={image.height}
      src={image.src} // use normal <img> attributes as props
      width={image.width}
    />
    {/* <span>{image.caption}</span> */}
  </div>
);

export default LazyImage;
