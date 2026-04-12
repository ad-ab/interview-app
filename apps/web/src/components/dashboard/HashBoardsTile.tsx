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
import { UNITS } from "@/types";
import { MOCK_HASH_BOARDS } from "@/mockData";

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
              <TableCell>
                {row.hashrate.toFixed(2)} {UNITS.HASHRATE}
              </TableCell>
              <TableCell>
                {row.voltage.toFixed(2)} {UNITS.VOLTAGE}
              </TableCell>
              <TableCell>
                {row.boardTemp} {UNITS.TEMPERATURE}
              </TableCell>
              <TableCell>
                {row.chipTemp} {UNITS.TEMPERATURE}
              </TableCell>
              <TableCell>
                {row.freq.toFixed(1)} {UNITS.FREQUENCY}
              </TableCell>
              <TableCell>{row.asic}</TableCell>
              <TableCell>
                {row.hwErr.toFixed(3)} {UNITS.HASHRATEERRORS}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Tile>
  );
}
