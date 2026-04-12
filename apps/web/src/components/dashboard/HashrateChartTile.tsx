import { LineChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import type { LineChartOptions } from "@carbon/charts";
import { Tab, TabList, Tabs, Tile } from "@carbon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MOCK_OVERALL_SERIES,
  MOCK_HASHRATE_SERIES,
  MOCK_TEMPERATURE_SERIES,
} from "@/mockData";

const CHART_HEIGHT = "220px";

const OVERALL_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "TH/s",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 110],
      correspondingDatasets: ["Hashrate"],
    },
    right: {
      title: "°C",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 100],
      correspondingDatasets: ["Temperature"],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const HASHRATE_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "TH/s",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 110],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const TEMPERATURE_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "°C",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      correspondingDatasets: ["1#Board", "1#Chip", "2#Board", "2#Chip", "3#Board", "3#Chip"],
    },
    right: {
      title: "%",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 100],
      correspondingDatasets: ["1#Fan", "2#Fan", "3#Fan"],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const TAB_KEYS = ["overall", "hashrate", "temperature"] as const;

export default function HashrateChartTile() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tile className="tw-p-0">
      <div style={{ boxShadow: "inset 0 -2px 0 0 var(--cds-border-subtle)" }}>
        <Tabs
          selectedIndex={selectedIndex}
          onChange={({ selectedIndex: i }) => setSelectedIndex(i)}
        >
          <TabList aria-label={t("chart.tabs.ariaLabel")}>
            {TAB_KEYS.map((key) => (
              <Tab key={key}>{t(`chart.tabs.${key}`)}</Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className="tw-p-4">
        {selectedIndex === 0 && (
          <LineChart data={MOCK_OVERALL_SERIES} options={OVERALL_OPTIONS} />
        )}
        {selectedIndex === 1 && (
          <LineChart data={MOCK_HASHRATE_SERIES} options={HASHRATE_OPTIONS} />
        )}
        {selectedIndex === 2 && (
          <LineChart data={MOCK_TEMPERATURE_SERIES} options={TEMPERATURE_OPTIONS} />
        )}
      </div>
    </Tile>
  );
}
