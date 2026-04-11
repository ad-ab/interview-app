/**
 * Shared regular expressions used across the web app.
 */

/** Loose IPv4 check — each octet 0-255. */
export const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;
