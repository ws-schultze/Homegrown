export function validatePassword(value: string): {
  valid: boolean;
  errorMsg: string;
} {
  //TODO: Decide what constraints and requirements a password should have

  if (value.length < 12) {
    return { valid: false, errorMsg: "Must be at least 12 characters" };
  }
  return { valid: false, errorMsg: "" };
}
