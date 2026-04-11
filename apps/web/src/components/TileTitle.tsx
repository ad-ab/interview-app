import type { ReactNode } from "react";

interface TileTitleProps {
  children: ReactNode;
}

/**
 * Subtitle that heads a group of Tiles on a page (e.g. "Personal" above the
 * Color Theme / Language tiles on the Settings page). Name comes from the
 * BR-2 spec even though it's really a page subtitle, not a per-tile title.
 */
export default function TileTitle({ children }: TileTitleProps) {
  return (
    <h2 className="tw-font-bold tw-m-0 tw-mb-2 tw-text-base">{children}</h2>
  );
}
