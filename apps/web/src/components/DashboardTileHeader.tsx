interface DashboardTileHeaderProps {
  title: string;
  info: string;
}

export default function DashboardTileHeader({
  title,
  info,
}: DashboardTileHeaderProps) {
  return (
    <h4
      className="tw-mb-4 tw-font-bold"
      style={{ color: "var(--cds-text-secondary)" }}
    >
      {title}
      <small
        className="tw-ml-4 cds--type-heading-01 tw-text-sm"
        style={{ color: "var(--cds-text-placeholder)" }}
      >
        {info}
      </small>
    </h4>
  );
}
