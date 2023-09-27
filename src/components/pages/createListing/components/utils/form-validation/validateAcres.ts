import React from "react";

/**
 *
 * @param value string
 * @returns boolean about whether or not the input string is valid. Commas every 1000 are optional, decimal is optional, must have two decimal places if there is a decimal
 */
export default function validateAcres(value: string): boolean {
  const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
  return regex.test(value);
}
