// https://stackoverflow.com/questions/49623849/format-currency-input-with-1000-separator-and-2-decimal-places-upon-typing-using

import React from "react";

interface Props {
  /**
   * Clean string containing only numeric characters
   */
  value: string;
}

/**
 *
 * @param value string containing only numeric digits [0-9]
 * @returns a formatted string with commas for thousands separators and one decimal and two decimal places
 */
export default function formatCommaSeparatedWithDecimal({ value }: Props): string {
  const len = value.length;
  let left = "",
    right = "",
    formatted = "";

  if (len === 0) {
    return "";
  } else if (len === 1) {
    // 0.01
    return `0.0${value}`;
  } else if (len === 2) {
    // 0.12
    return `0.${value}`;
  } else if (len === 3) {
    // 1.23
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else if (len === 4) {
    // 12.34
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    console.log("left: ", left, " ", "right: ", right);
    return formatted;
  } else if (len === 5) {
    // 123.45
    left = value.slice(0, -2);
    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else if (len >= 6) {
    // 1,234.56 and larger
    left = value.slice(0, -2);

    // Insert commas to the group left of the decimal
    left = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Number(left));

    right = value.slice(-2);
    formatted = left + "." + right;
    return formatted;
  } else {
    return "Error";
  }

  // This regex works great but breaks on Safari because of the usage of forward lookahead ?<=\
  //   return (
  //     // "$" +
  //     value
  //       .replace(/ (?!\.)\D /g, "") // deletes all non numeric characters except .
  //       .replace(/ (?:\..*)\. /g, "") // removes all extra . except the first .
  //       .replace(/(?<=\..*)\./g, "") // deletes everything after 2 decimal places
  //       .replace(/(?<=\.\d\d).*/g, "") // deletes everything after 2 decimal places
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // inserts commas at appropriate places
  //   );
}
