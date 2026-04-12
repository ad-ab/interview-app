import { useMemo, useState } from "react";
import {
  DataTable,
  IconButton,
  MultiSelect,
  Pagination,
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
import { Renew } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { LOG_SEVERITY_OPTIONS } from "@/const";
import { MOCK_LOG_DATA } from "@/mockData";
import { useFormat } from "@/hooks/useFormat";
import type { LogSeverity } from "@/types";

type SeverityOption = (typeof LOG_SEVERITY_OPTIONS)[number];

interface SelectAllItem {
  isSelectAll: true;
  labelKey: string;
}

type MultiSelectItem = SeverityOption | SelectAllItem;

const SELECT_ALL_ITEM: SelectAllItem = {
  isSelectAll: true,
  labelKey: "log.selectAll",
};

const MULTISELECT_ITEMS: MultiSelectItem[] = [
  SELECT_ALL_ITEM,
  ...LOG_SEVERITY_OPTIONS,
];

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

  const [selectedItems, setSelectedItems] = useState<MultiSelectItem[]>([
    ...MULTISELECT_ITEMS,
  ]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeSeverities = useMemo(
    () =>
      new Set(
        selectedItems
          .filter((item): item is SeverityOption => !("isSelectAll" in item))
          .map((s) => s.value),
      ),
    [selectedItems],
  );

  const handleSeverityChange = ({
    selectedItems: newItems,
  }: {
    selectedItems: MultiSelectItem[];
  }) => {
    setSelectedItems(newItems);
    setPage(1);
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
            dir *
            (new Date(a[key]).getTime() - new Date(b[key]).getTime())
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
                  onChange={(_e: unknown, newValue?: string) => {
                    setSearchText(newValue ?? "");
                    setPage(1);
                  }}
                  placeholder={t("log.search")}
                  persistent
                />
                <div style={{ minWidth: "220px" }}>
                  <MultiSelect
                    id="log-severity-filter"
                    titleText=""
                    hideLabel
                    label={t("log.selectSeverity")}
                    items={MULTISELECT_ITEMS}
                    itemToString={(item: MultiSelectItem) => t(item.labelKey)}
                    selectedItems={selectedItems}
                    onChange={handleSeverityChange}
                    selectionFeedback="top-after-reopen"
                    size="sm"
                  />
                </div>
                <IconButton
                  label={t("log.refresh")}
                  kind="ghost"
                  size="sm"
                  onClick={handleRefresh}
                >
                  <Renew />
                </IconButton>
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {dtHeaders.map((header: { key: string; header: string; isSortable: boolean }) => {
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
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row: { id: string; cells: Array<{ id: string; value: string; info: { header: string } }> }) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell: { id: string; value: string; info: { header: string } }) => (
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
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              totalItems={sortedRows.length}
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
          </TableContainer>
        );
      }}
    </DataTable>
  );
}
