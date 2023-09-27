// This page came from:
// https://github.com/cchanxzy/react-currency-input-field/blob/master/src/components/utils/repositionCursor.ts

type RepositionCursorProps = {
  eventTargetValue: string;
  formattedValueFromState?: string;
  lastKeyDown: string | null;
  selectionStart?: number | null;
  groupSeparators?: string[];
};

/**
 * Based on the last key stroke and the cursor position, update the eventTargetValue
 * and reposition the cursor to the right place
 */
export default function repositionCursor({
  eventTargetValue,
  formattedValueFromState,
  selectionStart,
  lastKeyDown,
  groupSeparators,
}: RepositionCursorProps): {
  modifiedValue: string;
  modifiedCursorPosition: number | null | undefined;
} {
  let modifiedCursorPosition = selectionStart;
  let modifiedValue = eventTargetValue;

  if (formattedValueFromState && modifiedCursorPosition) {
    const splitValue = eventTargetValue.split("");

    if (groupSeparators) {
      if (groupSeparators.length > 2 || groupSeparators.length === 0) {
        throw new Error(
          "Only two group separators can be used currently, and group separators cannot be an empty list."
        );
        // One group separator is defined
      } else if (groupSeparators.length === 1) {
        // Cursor is to right of groupSeparator and backspace is pressed.
        // --> Delete the character to the left of the separator and reposition the cursor.
        if (lastKeyDown === "Backspace" && formattedValueFromState[modifiedCursorPosition] === groupSeparators[0]) {
          splitValue.splice(modifiedCursorPosition - 1, 1);
          modifiedCursorPosition -= 1;
        }

        // Cursor is to left of groupSeparator and forward delete is pressed,
        // --> Delete the character to the right of the separator and reposition the cursor.
        if (lastKeyDown === "Delete" && formattedValueFromState[modifiedCursorPosition] === groupSeparators[0]) {
          splitValue.splice(modifiedCursorPosition, 1);
          modifiedCursorPosition += 1;
        }
        // Two groups separators are defined
      } else if (groupSeparators.length === 2) {
        // Cursor is to right of groupSeparator and backspace is pressed.
        // --> Delete the character to the left of the separator and reposition the cursor.
        if (
          lastKeyDown === "Backspace" &&
          (formattedValueFromState[modifiedCursorPosition] === groupSeparators[0] ||
            formattedValueFromState[modifiedCursorPosition] === groupSeparators[1])
        ) {
          splitValue.splice(modifiedCursorPosition - 1, 1);
          modifiedCursorPosition -= 1;
        }

        // Cursor is to left of groupSeparator and forward delete is pressed,
        // --> Delete the character to the right of the separator and reposition the cursor.
        if (
          lastKeyDown === "Delete" &&
          (formattedValueFromState[modifiedCursorPosition] === groupSeparators[0] ||
            formattedValueFromState[modifiedCursorPosition] === groupSeparators[1])
        ) {
          splitValue.splice(modifiedCursorPosition, 1);
          modifiedCursorPosition += 1;
        }
      }
    }

    modifiedValue = splitValue.join("");

    return { modifiedValue, modifiedCursorPosition };
  }

  return { modifiedValue, modifiedCursorPosition: selectionStart };
}
