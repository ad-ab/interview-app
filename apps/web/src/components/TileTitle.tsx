import type { ReactNode } from "react";

interface TileTitleProps {
  children: ReactNode;
}

export default function TileTitle({ children }: TileTitleProps) {
  return (
    <h2 className="tw-font-bold tw-m-0 tw-mb-2 tw-text-base">{children}</h2>
  );
}
