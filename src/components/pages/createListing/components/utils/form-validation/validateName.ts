export default function validateName(value: string, required: boolean): { valid: boolean; errorMsg: string } {
  let valid: boolean = false;
  let errorMsg: string = "";
  console.log(value);

  if (required === true) {
    if (value === "") {
      // Invalid
      console.log("invalid");

      valid = false;
      errorMsg = "Required";
    } else if (value.length >= 1) {
      // Valid

      valid = true;
      errorMsg = "";
    } else {
      throw new Error("Something went wrong");
    }
  } else {
    valid = true;
    errorMsg = "";
  }

  return { valid, errorMsg };
}
