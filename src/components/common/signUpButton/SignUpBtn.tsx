import styles from "./styles.module.scss";

interface Props {
  emit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export default function SignUpBtn({ emit }: Props) {
  return (
    <button className={styles.btn} onClick={(e) => emit(e)}>
      Sign up
    </button>
  );
}
