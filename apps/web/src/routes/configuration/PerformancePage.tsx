import PageTitle from "@/components/PageTitle";
import { Stack, Tile } from "@carbon/react";
import { useTranslation } from "react-i18next";

export default function PerformancePage() {
  const { t } = useTranslation();

  return (
    <Stack gap={1} className="tw-w-full">
      <PageTitle>{t("config.performance")}</PageTitle>

      <Tile>TODO</Tile>
    </Stack>
  );
}
