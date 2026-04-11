import { IPV4_REGEX } from "@/regex";

/**
 * Returns true when `value` is a valid IPv4 address, OR when it is empty
 * (so empty input fields are not flagged as invalid before the user types).
 * Leading/trailing whitespace is trimmed before matching.
 */
export function isValidIPv4(value: string): boolean {
  if (value === "") return true;
  return IPV4_REGEX.test(value.trim());
}
