import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";
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

const HEADERS = [
  { key: "id",        header: "ID"                 },
  { key: "hashrate",  header: "Real Hashrate"       },
  { key: "voltage",   header: "Voltage"             },
  { key: "boardTemp", header: "Board Temp"          },
  { key: "chipTemp",  header: "Chip Temp"           },
  { key: "freq",      header: "Frequency"           },
  { key: "asic",      header: "ASIC#"               },
  { key: "hwErr",     header: "HW Error Hashrate"   },
];

export default function HashBoardsTile() {
  return (
    <Tile className="tw-p-5">
      <TileTitle>Hash Boards</TileTitle>
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            {HEADERS.map((h) => (
              <TableHeader key={h.key}>{h.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody style={{ background: "transparent" }}>
          {BOARD_ROWS.map((row) => (
            <TableRow key={row.id} style={{ background: "transparent" }}>
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
