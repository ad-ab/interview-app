import { Grid, Column, Tile, Tag, Row, FormLabel, Layer } from "@carbon/react";
import { useTranslation } from "react-i18next";
import HashrateChartTile from "../components/dashboard/HashrateChartTile";
import OverviewTile from "../components/dashboard/OverviewTile";
import DashboardTileHeader from "../components/DashboardTileHeader";

// ── Dummy data ────────────────────────────────────────────────────────────────
const WORKERS = [
  {
    name: "Antminer S19 Pro #1",
    hashrate: "24.6 TH/s",
    temp: "71°C",
    status: "active",
  },
  {
    name: "Antminer S19 Pro #2",
    hashrate: "23.9 TH/s",
    temp: "73°C",
    status: "active",
  },
  {
    name: "Antminer S19 Pro #3",
    hashrate: "24.1 TH/s",
    temp: "70°C",
    status: "active",
  },
  {
    name: "Antminer S19    #4",
    hashrate: "22.8 TH/s",
    temp: "68°C",
    status: "active",
  },
  {
    name: "Antminer S19j   #5",
    hashrate: "0.0 TH/s",
    temp: "—",
    status: "error",
  },
];

const POOLS = [
  {
    name: "Braiins Pool",
    share: 60,
    accepted: "14,823",
    rejected: "12",
    latency: "18 ms",
  },
  {
    name: "Slush Pool",
    share: 30,
    accepted: "7,412",
    rejected: "8",
    latency: "24 ms",
  },
  {
    name: "F2Pool",
    share: 10,
    accepted: "2,471",
    rejected: "4",
    latency: "41 ms",
  },
];

const EVENTS = [
  { time: "14:32", type: "info", msg: "Pool failover: switched to Slush Pool" },
  { time: "13:15", type: "warning", msg: "Worker #5 hashrate dropped to 0" },
  { time: "11:40", type: "info", msg: "Firmware updated to BOS+ 23.04" },
  { time: "09:02", type: "success", msg: "New best share submitted" },
  { time: "08:55", type: "warning", msg: "Chip temp exceeded 75°C on board 2" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PoolsSection() {
  return (
    <Tile className="tw-h-full tw-p-5">
      <p
        className="tw-mb-4 tw-text-xs tw-uppercase tw-tracking-[0.08em]"
        style={{ color: "var(--cds-text-secondary)" }}
      >
        Mining Pools
      </p>
      <div className="tw-flex tw-flex-col tw-gap-4">
        {POOLS.map((p) => (
          <div key={p.name}>
            <div className="tw-mb-[0.3rem] tw-flex tw-justify-between">
              <span
                className="tw-text-sm"
                style={{ color: "var(--cds-text-primary)" }}
              >
                {p.name}
              </span>
              <span
                className="tw-text-xs"
                style={{ color: "var(--cds-text-secondary)" }}
              >
                {p.latency}
              </span>
            </div>
            <div
              className="tw-mb-[0.3rem] tw-h-1 tw-overflow-hidden tw-rounded-sm"
              style={{ backgroundColor: "var(--cds-layer-accent-01)" }}
            >
              <div
                className="tw-h-full tw-rounded-sm"
                style={{
                  width: `${p.share}%`,
                  backgroundColor: "var(--cds-interactive)",
                }}
              />
            </div>
            <div
              className="tw-flex tw-gap-4 tw-text-[0.6875rem]"
              style={{ color: "var(--cds-text-secondary)" }}
            >
              <span>✓ {p.accepted} accepted</span>
              <span style={{ color: "var(--cds-support-error)" }}>
                ✕ {p.rejected} rejected
              </span>
              <span className="tw-ml-auto">{p.share}%</span>
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
}

function EventLog() {
  const typeColor: Record<string, string> = {
    info: "var(--cds-support-info)",
    warning: "var(--cds-support-warning)",
    success: "var(--cds-support-success)",
    error: "var(--cds-support-error)",
  };
  return (
    <Tile className="tw-p-5">
      <p
        className="tw-mb-4 tw-text-xs tw-uppercase"
        style={{ color: "var(--cds-text-secondary)" }}
      >
        Recent Events
      </p>
      <div className="tw-flex tw-flex-col ">
        {EVENTS.map((e, i) => (
          <div
            key={i}
            className="tw-grid tw-items-start tw-gap-2 tw-py-2"
            style={{
              gridTemplateColumns: "3rem 0.5rem 1fr",
              borderBottom:
                i < EVENTS.length - 1
                  ? "1px solid var(--cds-border-subtle)"
                  : "none",
            }}
          >
            <span
              className="tw-text-xs"
              style={{ color: "var(--cds-text-placeholder)" }}
            >
              {e.time}
            </span>
            <div
              className="tw-mt-1 tw-h-2 tw-w-2 tw-shrink-0 tw-rounded-full"
              style={{ backgroundColor: typeColor[e.type] }}
            />
            <span
              className="tw-text-sm"
              style={{ color: "var(--cds-text-primary)" }}
            >
              {e.msg}
            </span>
          </div>
        ))}
      </div>
    </Tile>
  );
}

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

          <Grid fullWidth>
            <Column sm={4} md={4} lg={5} className="tw-mb-4">
              <PoolsSection />
            </Column>
            <Column sm={4} md={4} lg={6} className="tw-mb-4">
              <EventLog />
            </Column>
          </Grid>
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
