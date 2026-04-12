import { LineChart } from "@carbon/charts-react";
import { ScaleTypes, ChartTheme } from "@carbon/charts";
import type { LineChartOptions } from "@carbon/charts";
import { Tab, TabList, Tabs, Tile } from "@carbon/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useFormat } from "@/hooks/useFormat";
import { unitForGroup } from "@/chartUtils";
import {
  MOCK_OVERALL_SERIES,
  MOCK_HASHRATE_SERIES,
  MOCK_TEMPERATURE_SERIES,
  MOCK_NOMINAL_HASHRATE,
} from "@/mockData";

const CHART_HEIGHT = "320px";

const TAB_KEYS = ["overall", "hashrate", "temperature"] as const;

function makeTooltipHTML(
  data: { group: string; value: number; date: string }[],
  formatTime: (d: Date) => string,
) {
  const date = data[0]?.date ? formatTime(new Date(data[0].date)) : "";
  const rows = data
    .map((d) => `<p style="margin:1px 0">${d.group}: <strong>${d.value} ${unitForGroup(d.group)}</strong></p>`)
    .join("");
  return `<div style="padding:4px 8px"><p style="margin:0 0 4px 0;opacity:0.7;font-size:0.75rem">${date}</p>${rows}</div>`;
}

export default function HashrateChartTile() {
  const { t } = useTranslation();
  const { carbonTheme } = useTheme();
  const { formatTime } = useFormat();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const chartTheme = carbonTheme === "g100" ? ChartTheme.G100 : ChartTheme.WHITE;

  const tooltipOpts = useMemo(() => ({
    customHTML: (data: { group: string; value: number; date: string }[]) =>
      makeTooltipHTML(data, formatTime),
  }), [formatTime]);

  const timeAxisOpts = useMemo(() => ({
    scaleType: ScaleTypes.TIME,
    mapsTo: "date" as const,
    ticks: {
      formatter: (v: number | Date) =>
        formatTime(v instanceof Date ? v : new Date(v)),
    },
  }), [formatTime]);

  const overallOptions = useMemo((): LineChartOptions => ({
    axes: {
      bottom: timeAxisOpts,
      left: {
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 110],
        correspondingDatasets: ["Hashrate"],
        ticks: { formatter: (v: number | Date) => `${+(v)}T` },
      },
      right: {
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 100],
        correspondingDatasets: ["Temperature"],
        ticks: { formatter: (v: number | Date) => `${+(v)}°C` },
      },
    },
    curve: "curveMonotoneX",
    height: CHART_HEIGHT,
    toolbar: { enabled: false },
    points: { radius: 2 },
    tooltip: tooltipOpts,
    theme: chartTheme,
  }), [timeAxisOpts, tooltipOpts, chartTheme]);

  const hashrateOptions = useMemo((): LineChartOptions => ({
    axes: {
      bottom: timeAxisOpts,
      left: {
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 110],
        ticks: { formatter: (v: number | Date) => `${+(v)}T` },
        thresholds: [
          {
            value: MOCK_NOMINAL_HASHRATE,
            label: `Nominal Average (${MOCK_NOMINAL_HASHRATE} TH/s)`,
            fillColor: "var(--cds-support-warning)",
          },
        ],
      },
    },
    curve: "curveMonotoneX",
    height: CHART_HEIGHT,
    toolbar: { enabled: false },
    points: { radius: 2 },
    tooltip: tooltipOpts,
    theme: chartTheme,
  }), [timeAxisOpts, tooltipOpts, chartTheme]);

  const temperatureOptions = useMemo((): LineChartOptions => ({
    axes: {
      bottom: timeAxisOpts,
      left: {
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        correspondingDatasets: ["1#Board", "1#Chip", "2#Board", "2#Chip", "3#Board", "3#Chip"],
        ticks: { formatter: (v: number | Date) => `${+(v)}°C` },
      },
      right: {
        mapsTo: "value",
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 100],
        correspondingDatasets: ["1#Fan", "2#Fan", "3#Fan"],
        ticks: { formatter: (v: number | Date) => `${+(v)}%` },
      },
    },
    curve: "curveMonotoneX",
    height: CHART_HEIGHT,
    toolbar: { enabled: false },
    points: { radius: 2 },
    tooltip: tooltipOpts,
    theme: chartTheme,
  }), [timeAxisOpts, tooltipOpts, chartTheme]);

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
      <div className="tw-px-4 tw-pb-4 tw-pt-6">
        {selectedIndex === 0 && (
          <LineChart data={MOCK_OVERALL_SERIES} options={overallOptions} />
        )}
        {selectedIndex === 1 && (
          <LineChart data={MOCK_HASHRATE_SERIES} options={hashrateOptions} />
        )}
        {selectedIndex === 2 && (
          <LineChart data={MOCK_TEMPERATURE_SERIES} options={temperatureOptions} />
        )}
      </div>
    </Tile>
  );
}
