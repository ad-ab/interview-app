import { Grid, Column } from "@carbon/react";
import { useTranslation } from "react-i18next";
import HashrateChartTile from "@/components/dashboard/HashrateChartTile";
import OverviewTile from "@/components/dashboard/OverviewTile";
import HashBoardsTile from "@/components/dashboard/HashBoardsTile";
import DashboardTileHeader from "@/components/DashboardTileHeader";

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <main className="tw-w-full tw-mt-6">
      <Grid fullWidth>
        <Column sm={4} md={8} lg={16}>
          <DashboardTileHeader
            title="Antminer S19J Pro"
            info={t("dashboard.hostname", { name: "Antminer" })}
          />
        </Column>

        <Column sm={4} md={8} lg={11}>
          <div className="tw-mb-4">
            <HashrateChartTile />
          </div>
          <div className="tw-mb-4">
            <HashBoardsTile />
          </div>
        </Column>

        <Column sm={4} md={8} lg={5}>
          <div className="tw-mb-4">
            <OverviewTile />
          </div>
        </Column>
      </Grid>
    </main>
  );
}
