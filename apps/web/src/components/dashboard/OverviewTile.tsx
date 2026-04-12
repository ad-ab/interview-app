import { useFormat } from "@/hooks/useFormat";
import { Tile } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { MOCK_FANS } from "@/mockData";

const CONFIRMATION_GREEN = "#42be65";

const enum UNITS {
  TEMPERATURE = "°C",
  HASHRATE = "TH/s",
  EFFICIENCY = "W/THs",
  POWER = "kW",
  RPM = "RPM",
}

const enum POOL_STATUS {
  ALIVE = "alive",
  DEAD = "dead",
  DEGRADED = "degraded",
}

const enum TUNER_STATUS {
  STABLE = "stable",
  UNSTABLE = "unstable",
  ERROR = "error",
}

const enum METRIC_LABEL {
  REAL_HASHRATE = "realHashrate",
  TEMPERATURE = "temperature",
  EFFICIENCY = "efficiency",
  POWER = "power",
  DPS = "dps",
  POOL_STATUS = "poolStatus",
  TUNER_STATUS = "tunerStatus",
}

export const isNumber = (value: unknown) => Number.isFinite(value);

function CircleCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      height="16"
      width="16"
      fill={checked ? CONFIRMATION_GREEN : "var(--cds-border-subtle)"}
    >
      <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM404.5 215L285.1 379.2L216 310.1L182.1 344L271 432.9L290.8 452.8L307.3 430.1L443.2 243.2L457.3 223.8L418.5 195.5L404.4 214.9z" />
    </svg>
  );
}

function FanSection() {
  const { formatNumber } = useFormat();
  const { t } = useTranslation();

  return (
    <Tile className="tw-p-5">
      <p
        className="tw-mb-4 tw-text-xs tw-uppercase"
        style={{ color: "var(--cds-text-secondary)" }}
      >
        {t("overview.fanMonitor")}
      </p>
      <div className="tw-flex tw-flex-col tw-gap-3">
        {MOCK_FANS.map((f) => (
          <div key={f.id}>
            <div className="tw-mb-1 tw-flex tw-justify-between">
              <span
                className="tw-text-xs"
                style={{ color: "var(--cds-text-primary)" }}
              >
                {f.id}
              </span>
              <span
                className="tw-text-xs"
                style={{ color: "var(--cds-text-secondary)" }}
              >
                {isNumber(f.rpm) ? formatNumber(f.rpm as number) : f.rpm} RPM
              </span>
            </div>
            <div
              className="tw-h-1 tw-overflow-hidden tw-rounded-sm"
              style={{ backgroundColor: "var(--cds-layer-accent-01)" }}
            >
              <div
                className="tw-h-full tw-rounded-sm tw-transition-all tw-duration-400 tw-ease-in-out"
                style={{
                  width: `${f.pct}%`,
                  backgroundColor: "var(--cds-interactive)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
}

export default function OverviewTile() {
  const { formatNumber } = useFormat();
  const { t } = useTranslation();

  const tmpData = [
    {
      label: "overview.metrics.realHashrate",
      value: 90.24,
      unit: UNITS.HASHRATE,
    },
    {
      label: "overview.metrics.temperature",
      value: 72.5,
      unit: UNITS.TEMPERATURE,
      color: CONFIRMATION_GREEN,
    },
    {
      label: "overview.metrics.efficiency",
      value: 35.95,
      unit: UNITS.EFFICIENCY,
    },
    { label: "overview.metrics.power", value: 3244, unit: UNITS.POWER },
    {
      label: "overview.metrics.dps",
      value: "common.enabled",
      checkbox: true,
      wide: true,
    },
    {
      label: "overview.metrics.poolStatus",
      value: t(`overview.poolStatus.${POOL_STATUS.ALIVE}`),
      checkbox: true,
    },
    {
      label: "overview.metrics.tunerStatus",
      value: t(`overview.tunerStatus.${TUNER_STATUS.STABLE}`),
      checkbox: true,
    },
  ];

  return (
    <div className="tw-grid tw-grid-cols-2 tw-gap-px">
      {tmpData.map((d) => (
        <Tile key={d.label} className={d.wide ? "tw-col-span-2" : undefined}>
          <p
            className="tw-mb-2 tw-text-xs"
            style={{ color: "var(--cds-text-placeholder)" }}
          >
            {t(d.label)}
          </p>
          <div
            className="tw-flex tw-items-baseline tw-gap-1"
            style={{ color: d.color ? d.color : undefined }}
          >
            {"checkbox" in d ? (
              <span className="tw-self-center">
                <CircleCheckbox checked={!!d.checkbox} />
              </span>
            ) : null}
            <span>
              {isNumber(d.value)
                ? formatNumber(d.value as number)
                : t(d.value as string)}
            </span>
            <span className="tw-text-xs">{d.unit}</span>
          </div>
          <div style={{ color: d.color ? d.color : undefined }}></div>
        </Tile>
      ))}

      <div className="tw-col-span-2">
        <FanSection />
      </div>
    </div>
  );
}
