import React from "react";

/**
 * Capitalize the first letter of each word in a given string
 * @param value string
 * @returns string with the first letter of each word capitalized
 */
export default function formatName(value: string): string {
  const name = value
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return name;
}
