import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  DataTable,
  IconButton,
  Pagination,
  Popover,
  PopoverContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from "@carbon/react";
import { Filter, Renew } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { LOG_SEVERITY_OPTIONS } from "@/const";
import { MOCK_LOG_DATA } from "@/mockData";
import { useFormat } from "@/hooks/useFormat";
import type { LogSeverity } from "@/types";

const ALL_SEVERITIES = new Set<LogSeverity>(
  LOG_SEVERITY_OPTIONS.map((o) => o.value),
);

const SEVERITY_ORDER: Record<LogSeverity, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

export default function LogsTable() {
  const { t } = useTranslation();
  const { formatDateTime } = useFormat();

  const [activeSeverities, setActiveSeverities] =
    useState<Set<LogSeverity>>(ALL_SEVERITIES);
  const [pendingSeverities, setPendingSeverities] =
    useState<Set<LogSeverity>>(ALL_SEVERITIES);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleApplyFilter = () => {
    setActiveSeverities(new Set(pendingSeverities));
    setFilterOpen(false);
    setPage(1);
  };

  const handleResetFilter = () => {
    setPendingSeverities(ALL_SEVERITIES);
    setActiveSeverities(ALL_SEVERITIES);
    setFilterOpen(false);
    setPage(1);
  };

  const handleCheckboxChange = (severity: LogSeverity, checked: boolean) => {
    setPendingSeverities((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(severity);
      } else {
        next.delete(severity);
      }
      return next;
    });
  };

  const handleRefresh = () => {
    setPage(1);
  };

  const filteredData = useMemo(() => {
    const query = searchText.toLowerCase();
    return MOCK_LOG_DATA.filter((row) => {
      if (!activeSeverities.has(row.severity)) return false;
      if (query) {
        return (
          row.name.toLowerCase().includes(query) ||
          row.description.toLowerCase().includes(query) ||
          row.severity.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeSeverities, searchText]);

  const headers = [
    { key: "time", header: t("log.columns.time"), isSortable: true },
    { key: "name", header: t("log.columns.name"), isSortable: true },
    {
      key: "description",
      header: t("log.columns.description"),
      isSortable: false,
    },
    { key: "severity", header: t("log.columns.severity"), isSortable: true },
  ];

  const rows = useMemo(
    () =>
      filteredData.map((row) => ({
        id: row.id,
        time: row.time,
        name: row.name,
        description: row.description,
        severity: row.severity,
      })),
    [filteredData],
  );

  const isFiltered = activeSeverities.size < ALL_SEVERITIES.size;

  return (
    <DataTable
      rows={rows}
      headers={headers}
      isSortable
      sortRow={(
        a: Record<string, string>,
        b: Record<string, string>,
        { sortDirection, key }: { sortDirection: string; key: string },
      ) => {
        const dir = sortDirection === "ASC" ? 1 : -1;
        if (key === "severity") {
          return (
            dir *
            (SEVERITY_ORDER[a[key] as LogSeverity] -
              SEVERITY_ORDER[b[key] as LogSeverity])
          );
        }
        if (key === "time") {
          return (
            dir * (new Date(a[key]).getTime() - new Date(b[key]).getTime())
          );
        }
        return dir * a[key].localeCompare(b[key]);
      }}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(renderProps: any) => {
        const {
          rows: sortedRows,
          headers: dtHeaders,
          getHeaderProps,
          getRowProps,
          getTableProps,
        } = renderProps;
        const paginatedRows = sortedRows.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );

        return (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  expanded
                  onChange={(_e: unknown, newValue?: string) => {
                    setSearchText(newValue ?? "");
                    setPage(1);
                  }}
                  placeholder={t("log.search")}
                />
                <Popover
                  open={filterOpen}
                  align="bottom-end"
                  onRequestClose={() => {
                    setFilterOpen(false);
                    setPendingSeverities(new Set(activeSeverities));
                  }}
                  isTabTip
                >
                  <IconButton
                    label={t("log.filterSeverity")}
                    kind="ghost"
                    onClick={() => {
                      setPendingSeverities(new Set(activeSeverities));
                      setFilterOpen((prev) => !prev);
                    }}
                    className={isFiltered ? "tw-text-blue-500" : undefined}
                  >
                    <Filter />
                  </IconButton>
                  <PopoverContent>
                    <div className="tw-p-4 tw-flex tw-flex-col tw-gap-2">
                      <fieldset className="tw-border-0 tw-p-0 tw-m-0">
                        <legend className="tw-sr-only">
                          {t("log.filterSeverity")}
                        </legend>
                        {LOG_SEVERITY_OPTIONS.map((opt) => (
                          <Checkbox
                            key={opt.value}
                            id={`log-filter-${opt.value}`}
                            labelText={t(opt.labelKey)}
                            checked={pendingSeverities.has(opt.value)}
                            onChange={(
                              _: unknown,
                              { checked }: { checked: boolean },
                            ) => handleCheckboxChange(opt.value, checked)}
                          />
                        ))}
                      </fieldset>
                      <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-2">
                        <Button
                          kind="secondary"
                          size="sm"
                          onClick={handleResetFilter}
                        >
                          {t("log.filterReset")}
                        </Button>
                        <Button
                          kind="primary"
                          size="sm"
                          onClick={handleApplyFilter}
                        >
                          {t("log.filterApply")}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <IconButton
                  label={t("log.refresh")}
                  kind="ghost"
                  onClick={handleRefresh}
                >
                  <Renew />
                </IconButton>
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {dtHeaders.map(
                    (header: {
                      key: string;
                      header: string;
                      isSortable: boolean;
                    }) => {
                      const props = getHeaderProps({ header });
                      return (
                        <TableHeader
                          key={header.key}
                          {...props}
                          isSortable={header.isSortable}
                          style={
                            header.key === "time"
                              ? { width: "180px", minWidth: "180px" }
                              : undefined
                          }
                        >
                          {header.header}
                        </TableHeader>
                      );
                    },
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map(
                  (row: {
                    id: string;
                    cells: Array<{
                      id: string;
                      value: string;
                      info: { header: string };
                    }>;
                  }) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map(
                        (cell: {
                          id: string;
                          value: string;
                          info: { header: string };
                        }) => (
                          <TableCell
                            key={cell.id}
                            style={
                              cell.info.header === "time"
                                ? {
                                    width: "180px",
                                    minWidth: "180px",
                                    whiteSpace: "nowrap",
                                  }
                                : undefined
                            }
                          >
                            {cell.info.header === "time"
                              ? formatDateTime(new Date(cell.value))
                              : cell.value}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>

            <Pagination
              totalItems={sortedRows.length}
              pageSize={pageSize}
              page={page}
              pageSizes={[5, 10, 15]}
              itemsPerPageText={t("log.pagination.itemsPerPage")}
              itemRangeText={(min: number, max: number, total: number) =>
                t("log.pagination.itemRange", { min, max, total })
              }
              pageRangeText={(_current: number, total: number) =>
                total === 1
                  ? t("log.pagination.pageRangeOne")
                  : t("log.pagination.pageRange", { total })
              }
              backwardText={t("log.pagination.backwardText")}
              forwardText={t("log.pagination.forwardText")}
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
          </TableContainer>
        );
      }}
    </DataTable>
  );
}
