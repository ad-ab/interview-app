import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import TileTitle from "@/components/TileTitle";
import { UNITS } from "@/shared/types";
import { MOCK_HASH_BOARDS } from "@/shared/mockData";
import { useFormat } from "@/hooks/useFormat";

const COLUMN_KEYS = [
  "dashboard.hashBoards.col.id",
  "dashboard.hashBoards.col.realHashrate",
  "dashboard.hashBoards.col.voltage",
  "dashboard.hashBoards.col.boardTemp",
  "dashboard.hashBoards.col.chipTemp",
  "dashboard.hashBoards.col.frequency",
  "dashboard.hashBoards.col.asic",
  "dashboard.hashBoards.col.hwErrorHashrate",
] as const;

export default function HashBoardsTile() {
  const { t } = useTranslation();
  const { formatNumber } = useFormat();

  const fmt = (value: number, decimals: number) =>
    formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <Tile className="tw-p-5">
      <TileTitle>{t("dashboard.hashBoards.title")}</TileTitle>
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            {COLUMN_KEYS.map((key) => (
              <TableHeader key={key}>{t(key)}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="tw-bg-transparent">
          {MOCK_HASH_BOARDS.map((row) => (
            <TableRow key={row.id} className="tw-bg-transparent">
              <TableCell>{row.id}</TableCell>
              <TableCell>{fmt(row.hashrate, 2)} {UNITS.HASHRATE}</TableCell>
              <TableCell>{fmt(row.voltage, 2)} {UNITS.VOLTAGE}</TableCell>
              <TableCell>{fmt(row.boardTemp, 0)} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{fmt(row.chipTemp, 0)} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{fmt(row.freq, 1)} {UNITS.FREQUENCY}</TableCell>
              <TableCell>{row.asic}</TableCell>
              <TableCell>{fmt(row.hwErr, 3)} {UNITS.HASHRATEERRORS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Tile>
  );
}
