import { useTranslation } from "react-i18next";
import PageTitle from "@/components/PageTitle";
import LogsTable from "@/components/LogsTable";
import { Stack } from "@carbon/react";

export default function LogPage() {
  const { t } = useTranslation();

  return (
    <Stack gap="1" className="tw-w-full tw-min-w-0">
      <PageTitle>{t("log.title")}</PageTitle>
      <LogsTable />
    </Stack>
  );
}
