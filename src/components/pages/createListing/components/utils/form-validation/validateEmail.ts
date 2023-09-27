import isEmail from "validator/lib/isEmail";

export default function validateEmail(value: string): { valid: boolean; errorMsg: string } {
  if (isEmail(value)) {
    return { valid: true, errorMsg: "" };
  } else {
    return { valid: false, errorMsg: "Enter a valid email" };
  }
}
