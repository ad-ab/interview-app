import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

/**
 * Top-of-page heading used by every System page (Settings, Network, ...).
 * Bold, small-ish, matches the scale the user landed on during BR-1 review.
 */
export default function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="tw-font-bold tw-m-0 tw-mb-4 tw-text-2xl">{children}</h1>
  );
}
