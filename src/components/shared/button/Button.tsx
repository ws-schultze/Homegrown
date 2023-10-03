import styles from "./buttonStyles.module.scss";

interface Props {
  text: string;
  emit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export default function Button({ text, emit }: Props) {
  return (
    <button className={styles.btn} onClick={(e) => emit(e)}>
      {text}
    </button>
  );
}
