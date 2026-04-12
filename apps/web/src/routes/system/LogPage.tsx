import { useTranslation } from "react-i18next";
import PageTitle from "@/components/PageTitle";
import LogsTable from "@/components/LogsTable";

export default function LogPage() {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-flex-col tw-gap-1">
      <PageTitle>{t("log.title")}</PageTitle>
      <LogsTable />
    </div>
  );
}
