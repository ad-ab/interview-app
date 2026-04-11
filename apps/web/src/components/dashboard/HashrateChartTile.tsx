import { Tab, TabList, Tabs, Tile } from "@carbon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HASHRATE_BARS = [
  68, 72, 75, 80, 78, 82, 85, 88, 84, 87, 90, 92, 89, 91, 94, 93, 95, 96, 94,
  97, 95, 94, 96, 95,
];

const OVERALL_BARS = [
  65, 68, 70, 72, 75, 78, 80, 82, 80, 83, 85, 87, 85, 86, 88, 89, 90, 91, 90,
  92, 91, 90, 92, 91,
];

const TEMPERATURE_BARS = [
  62, 63, 65, 66, 67, 68, 70, 71, 72, 73, 72, 73, 74, 73, 72, 71, 70, 71, 72,
  73, 74, 73, 72, 71,
];

const DATASETS = [
  {
    key: "overall",
    bars: OVERALL_BARS,
    avg: "83.4",
    peak: "92.0",
    unit: "%",
  },
  {
    key: "hashrate",
    bars: HASHRATE_BARS,
    avg: "88.7",
    peak: "97.2",
    unit: "TH/s",
  },
  {
    key: "temperature",
    bars: TEMPERATURE_BARS,
    avg: "70.1",
    peak: "74.0",
    unit: "°C",
  },
] as const;

export default function HashrateChartTile() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const dataset = DATASETS[selectedIndex];
  const max = Math.max(...dataset.bars);

  return (
    <Tile className="tw-p-0">
      <div style={{ boxShadow: "inset 0 -2px 0 0 var(--cds-border-subtle)" }}>
        <Tabs
          selectedIndex={selectedIndex}
          onChange={({ selectedIndex: i }) => setSelectedIndex(i)}
        >
          <TabList aria-label={t("chart.tabs.ariaLabel")}>
            {DATASETS.map((d) => (
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
