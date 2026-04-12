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

interface BoardRow {
  id: number;
  hashrate: number;
  voltage: number;
  boardTemp: number;
  chipTemp: number;
  freq: number;
  asic: number;
  hwErr: number;
}

const BOARD_ROWS: BoardRow[] = [
  { id: 1, hashrate: 24.83, voltage: 12.40, boardTemp: 68, chipTemp: 78, freq: 650.0, asic: 108, hwErr: 0.0 },
  { id: 2, hashrate: 31.47, voltage: 12.38, boardTemp: 72, chipTemp: 84, freq: 725.5, asic: 108, hwErr: 0.0 },
  { id: 3, hashrate: 18.92, voltage: 12.35, boardTemp: 61, chipTemp: 74, freq: 562.5, asic: 108, hwErr: 0.0 },
];

export default function HashBoardsTile() {
  const { t } = useTranslation();

  const headers = [
    { key: "id",        header: t("dashboard.hashBoards.col.id")              },
    { key: "hashrate",  header: t("dashboard.hashBoards.col.realHashrate")    },
    { key: "voltage",   header: t("dashboard.hashBoards.col.voltage")         },
    { key: "boardTemp", header: t("dashboard.hashBoards.col.boardTemp")       },
    { key: "chipTemp",  header: t("dashboard.hashBoards.col.chipTemp")        },
    { key: "freq",      header: t("dashboard.hashBoards.col.frequency")       },
    { key: "asic",      header: t("dashboard.hashBoards.col.asic")            },
    { key: "hwErr",     header: t("dashboard.hashBoards.col.hwErrorHashrate") },
  ];

  return (
    <Tile className="tw-p-5">
      <TileTitle>{t("dashboard.hashBoards.title")}</TileTitle>
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableHeader key={h.key}>{h.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="tw-bg-transparent">
          {BOARD_ROWS.map((row) => (
            <TableRow key={row.id} className="tw-bg-transparent">
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.hashrate.toFixed(2)} {UNITS.HASHRATE}</TableCell>
              <TableCell>{row.voltage.toFixed(2)} {UNITS.VOLTAGE}</TableCell>
              <TableCell>{row.boardTemp} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{row.chipTemp} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{row.freq.toFixed(1)} {UNITS.FREQUENCY}</TableCell>
              <TableCell>{row.asic}</TableCell>
              <TableCell>{row.hwErr.toFixed(3)} {UNITS.HASHRATEERRORS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Tile>
  );
}
