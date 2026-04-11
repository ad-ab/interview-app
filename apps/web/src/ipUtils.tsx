import { IPV4_REGEX } from "@/regex";

export const isValidIPv4 = (value: string): boolean => {
  if (value === "") return true;
  return IPV4_REGEX.test(value.trim());
};
