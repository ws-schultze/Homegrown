import styles from "./styles.module.scss";
import { ReactComponent as LockIcon } from "./assets/lockIcon.svg";
import { ReactComponent as VisibilityIcon } from "./assets/visibilityIcon.svg";
import { useState } from "react";

interface Props {
  emit: (id: string, value: string) => void;
}

export default function PasswordInput({ emit }: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleOnBlur(id: string) {
    emit(id, value);
  }

  return (
    <div className={styles["container"]}>
      <LockIcon className={styles["icon"]} />
      <input
        type={showPassword ? "text" : "password"}
        className={styles["input"]}
        placeholder="Password"
        id="password"
        value={value}
        onChange={(e) => handleChange(e)}
        onBlur={(e) => handleOnBlur(e.target.id)}
        required
      />
      <VisibilityIcon
        className={styles["visibility-icon"]}
        onClick={() => setShowPassword((prev) => !prev)}
      />
    </div>
  );
}
