import { TypeBool, Str, VerifyActionName } from "../../../../types/index";
import { ReactComponent as BellSVG } from "../../../../assets/svg/bell-regular.svg";
import styles from "../styles.module.scss";

interface Props<T> {
  /** Whether or not a field remains disabled in edit mode -- set to false by parent when user confirms a prompt */
  parent: T;
  // children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  emit: (actionName: VerifyActionName, obj: T) => void;
}

/**
 * The end of a form section that contains a header and edit button.
 * Only show this component when its parent section is saved.
 */
export default function EditFormSection<T>({
  parent,
  emit,
}: Props<T>): JSX.Element {
  function handleClick() {
    let state: T = parent;
    let key: keyof T;
    let keys: (keyof T)[] = [];

    for (key in parent) {
      keys.push(key);
    }

    keys.forEach((k) => {
      // un-save and make editable each field in parent state
      const field = parent[k] as Str | TypeBool;
      if (field) {
        state = {
          ...state,
          [k]: {
            ...state[k],
            saved: false,
            readOnly: false,
          },
        };
      }
    });

    // In parent state, un-save and make editable
    const s: T = {
      ...state,
      saved: false,
      readOnly: false,
    };

    emit("edit", s);
  }

  return (
    <div className={styles.notice}>
      <BellSVG />
      Enable editing to make changes.
      <button type="button" className={styles.btn} onClick={handleClick}>
        Enable Editing
      </button>
    </div>
  );
}
