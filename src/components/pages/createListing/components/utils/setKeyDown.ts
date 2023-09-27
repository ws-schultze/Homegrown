/**
 * Return the last key pressed and prevent default on "Enter"
 * @param e React.KeyboardEvent
 */
export default function setKeyDown(e: React.KeyboardEvent): string {
  if (e.key === "Enter") {
    e.preventDefault();
  }
  return e.key;
}
