import { useMemo, useState } from "react";
import {
  IconButton,
  MultiSelect,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { Renew } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { LogSeverity } from "@/types";
import { LOG_SEVERITY_OPTIONS, SAMPLE_LOG_DATA } from "@/const";
import { useFormat } from "@/hooks/useFormat";

type SeverityOption = (typeof LOG_SEVERITY_OPTIONS)[number];

export default function LogsTable() {
  const { t } = useTranslation();
  const { formatDateTime } = useFormat();

  // Multi-select severity filter — all selected by default.
  const [selectedSeverities, setSelectedSeverities] = useState<
    readonly SeverityOption[]
  >(LOG_SEVERITY_OPTIONS);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeSeverities = useMemo(
    () => new Set(selectedSeverities.map((s) => s.value)),
    [selectedSeverities],
  );

  const handleSeverityChange = ({
    selectedItems,
  }: {
    selectedItems: SeverityOption[];
  }) => {
    setSelectedSeverities(selectedItems);
    setPage(1);
  };

  const handleRefresh = () => {
    // Placeholder — no backend, just reset pagination.
    setPage(1);
  };

  const filteredData = useMemo(
    () => SAMPLE_LOG_DATA.filter((row) => activeSeverities.has(row.severity)),
    [activeSeverities],
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const columns = [
    { key: "time", header: t("log.columns.time") },
    { key: "name", header: t("log.columns.name") },
    { key: "description", header: t("log.columns.description") },
    { key: "severity", header: t("log.columns.severity") },
  ] as const;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {/* Severity filter + refresh */}
      <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-4">
        <div style={{ minWidth: "280px" }}>
          <MultiSelect
            id="log-severity-filter"
            titleText=""
            hideLabel
            label={t("log.columns.severity")}
            items={[...LOG_SEVERITY_OPTIONS]}
            itemToString={(item: SeverityOption) => t(item.labelKey)}
            selectedItems={[...selectedSeverities]}
            onChange={handleSeverityChange}
            selectionFeedback="top-after-reopen"
          />
        </div>
        <IconButton
          label={t("log.refresh")}
          kind="ghost"
          size="md"
          onClick={handleRefresh}
        >
          <Renew />
        </IconButton>
      </div>

      {/* Data table */}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeader
                key={col.key}
                style={
                  col.key === "time"
                    ? { width: "180px", minWidth: "180px" }
                    : undefined
                }
              >
                {col.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  style={
                    col.key === "time"
                      ? { width: "180px", minWidth: "180px", whiteSpace: "nowrap" }
                      : undefined
                  }
                >
                  {col.key === "time"
                    ? formatDateTime(new Date(row.time))
                    : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        totalItems={filteredData.length}
        pageSize={pageSize}
        page={page}
        pageSizes={[5, 10, 15]}
        onChange={({
          page: newPage,
          pageSize: newSize,
        }: {
          page: number;
          pageSize: number;
        }) => {
          setPage(newPage);
          setPageSize(newSize);
        }}
      />
    </div>
  );
}
