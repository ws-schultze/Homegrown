import React from "react";

/**
 * Format a string containing only numeric characters into comma separated form format (e.g "123456" --> "123,456")
 * @param value string of the form "123456"
 * @returns string of the form "123,456"
 */
export default function formatCommaSeparatedNoDecimal(value: string): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value));
}
