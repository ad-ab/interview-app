import { UNITS } from "@/shared/types";

const FAN_GROUPS = new Set(["1#Fan", "2#Fan", "3#Fan"]);

/** Returns the display unit for a Carbon Charts series group name. */
export const unitForGroup = (group: string): string => {
  if (group === "Hashrate" || group === "Nominal Average") return UNITS.HASHRATE;
  if (group === "Temperature") return UNITS.TEMPERATURE;
  if (FAN_GROUPS.has(group)) return "%";
  // Board / Chip temperature series
  return UNITS.TEMPERATURE;
};
