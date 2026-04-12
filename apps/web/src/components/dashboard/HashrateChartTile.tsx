import { Tab, TabList, Tabs, Tile } from "@carbon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_CHART_DATASETS } from "@/mockData";

export default function HashrateChartTile() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const dataset = MOCK_CHART_DATASETS[selectedIndex];
  const max = Math.max(...dataset.bars);

  return (
    <Tile className="tw-p-0">
      <div style={{ boxShadow: "inset 0 -2px 0 0 var(--cds-border-subtle)" }}>
        <Tabs
          selectedIndex={selectedIndex}
          onChange={({ selectedIndex: i }) => setSelectedIndex(i)}
        >
          <TabList aria-label={t("chart.tabs.ariaLabel")}>
            {MOCK_CHART_DATASETS.map((d) => (
              <Tab key={d.key}>{t(`chart.tabs.${d.key}`)}</Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className="tw-p-5">
        <div className="tw-mt-4 tw-flex tw-h-[170px] tw-items-end tw-gap-1">
          {dataset.bars.map((v, i) => (
            <div
              key={i}
              title={`${v} ${dataset.unit}`}
              className="tw-min-w-0 tw-flex-1 tw-rounded-t-1 tw-transition-opacity tw-duration-200"
              style={{
                height: `${(v / max) * 100}%`,
                backgroundColor: "var(--cds-interactive)",
                opacity: 0.7 + (i / dataset.bars.length) * 0.3,
              }}
            />
          ))}
        </div>
        <div className="tw-mt-2 tw-flex tw-justify-between">
          <span
            className="tw-text-xs"
            style={{ color: "var(--cds-text-placeholder)" }}
          >
            00:00
          </span>
          <span
            className="tw-text-xs"
            style={{ color: "var(--cds-text-placeholder)" }}
          >
            12:00
          </span>
          <span
            className="tw-text-xs"
            style={{ color: "var(--cds-text-placeholder)" }}
          >
            Now
          </span>
        </div>
      </div>
    </Tile>
  );
}
