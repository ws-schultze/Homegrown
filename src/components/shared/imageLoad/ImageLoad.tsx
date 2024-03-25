import { useState } from "react";
import { Image } from "../../../types";
import styles from "./imageLoad.module.scss";

export default function ImageLoad({
  image,
  height,
}: {
  image: Image;
  height?: number;
}) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {isLoaded ? null : (
        <div className={styles.load_wrapper}>
          <div className={styles.activity}></div>
        </div>
      )}

      <img
        className={styles.image}
        alt="listing card cover pic"
        height={height ? height : "100%"}
        style={isLoaded ? { opacity: "1" } : { opacity: "0" }}
        onLoad={() => setIsLoaded(true)}
        src={image.url}
      />
    </div>
  );
}
