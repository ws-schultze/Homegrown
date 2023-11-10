import React, { useEffect } from "react";

/**
 *
 * Prevent cursor jumping white editing input.
 * Only need this on formatted inputs.
 *
 * ** WARNING: This will cause the input to be focused
 * on render if using Safari browser. **
 */
export default function useSetCursorPosition(
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
  cursorPosition: number
) {
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, inputRef]);
}
