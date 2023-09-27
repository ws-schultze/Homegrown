import styles from "./styles.module.css";
import { ReactComponent as EnvelopeIcon } from "./assets/envelopeIcon.svg";
import { useState } from "react";

interface Props {
  emit: (id: string, value: string) => void;
}

export default function EmailInput({ emit }: Props) {
  const [value, setValue] = useState("");
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleOnBlur(id: string) {
    emit(id, value);
  }

  return (
    <div className={styles["container"]}>
      <EnvelopeIcon className={styles["icon"]} />
      <input
        type="email"
        className={styles["input"]}
        placeholder="Email"
        id="email"
        value={value}
        onChange={(e) => handleChange(e)}
        onBlur={(e) => handleOnBlur(e.target.id)}
        required
      />
    </div>
  );
}
