import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="tw-font-bold tw-m-0 tw-mb-4 tw-text-2xl">{children}</h1>
  );
}
