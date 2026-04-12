import { useState } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
  Toggle,
} from "@carbon/react";
import { ArrowUp, ArrowDown, TrashCan } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { STRATUM_URL_REGEX } from "@/regex";
import type { PoolConfig } from "@/types";

interface PoolsTableProps {
  pools: PoolConfig[];
  onToggle: (poolId: string) => void;
  onUpdate: (poolId: string, field: keyof PoolConfig, value: string) => void;
  onMoveUp: (poolId: string) => void;
  onMoveDown: (poolId: string) => void;
  onDelete: (poolId: string) => void;
}

export default function PoolsTable({
  pools,
  onToggle,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: PoolsTableProps) {
  const { t } = useTranslation();
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );
  const [invalidUrls, setInvalidUrls] = useState<Set<string>>(new Set());

  const handleUrlBlur = (poolId: string, value: string) => {
    setInvalidUrls((prev) => {
      const next = new Set(prev);
      if (value.length > 0 && !STRATUM_URL_REGEX.test(value)) {
        next.add(poolId);
      } else {
        next.delete(poolId);
      }
      return next;
    });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader style={{ width: "50px" }}>{""}</TableHeader>
          <TableHeader>{t("pools.columns.url")}</TableHeader>
          <TableHeader style={{ width: "160px" }}>
            {t("pools.columns.username")}
          </TableHeader>
          <TableHeader style={{ width: "160px" }}>
            {t("pools.columns.password")}
          </TableHeader>
          <TableHeader style={{ width: "120px" }}>
            {t("pools.columns.actions")}
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {pools.map((pool, index) => {
          if (confirmingDeleteId === pool.id) {
            return (
              <TableRow key={pool.id}>
                <TableCell colSpan={5}>
                  <div className="tw-flex tw-items-center tw-justify-between tw-py-2">
                    <span>{t("pools.deleteConfirm")}</span>
                    <div className="tw-flex tw-gap-2">
                      <Button
                        kind="ghost"
                        size="sm"
                        onClick={() => setConfirmingDeleteId(null)}
                      >
                        {t("pools.deleteNo")}
                      </Button>
                      <Button
                        kind="danger"
                        size="sm"
                        onClick={() => {
                          onDelete(pool.id);
                          setConfirmingDeleteId(null);
                        }}
                      >
                        {t("pools.deleteYes")}
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          }

          const isFirst = index === 0;
          const isLast = index === pools.length - 1;
          const inputOpacity = pool.enabled ? 1 : 0.5;

          return (
            <TableRow key={pool.id}>
              <TableCell>
                <Toggle
                  id={`pool-toggle-${pool.id}`}
                  size="sm"
                  toggled={pool.enabled}
                  onToggle={() => onToggle(pool.id)}
                  hideLabel
                  labelA=""
                  labelB=""
                />
              </TableCell>
              <TableCell>
                <div style={{ opacity: inputOpacity }}>
                  <TextInput
                    id={`pool-url-${pool.id}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    value={pool.url}
                    placeholder="stratum+tcp://..."
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdate(pool.id, "url", e.target.value)
                    }
                    onBlur={() => handleUrlBlur(pool.id, pool.url)}
                    invalid={invalidUrls.has(pool.id)}
                    invalidText={t("pools.validation.invalidUrl")}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div style={{ opacity: inputOpacity }}>
                  <TextInput
                    id={`pool-username-${pool.id}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    value={pool.username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdate(pool.id, "username", e.target.value)
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                <div style={{ opacity: inputOpacity }}>
                  <TextInput
                    id={`pool-password-${pool.id}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    type="password"
                    value={pool.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdate(pool.id, "password", e.target.value)
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="tw-flex tw-items-center">
                  <IconButton
                    label="Move up"
                    kind="ghost"
                    size="sm"
                    disabled={isFirst}
                    onClick={() => onMoveUp(pool.id)}
                  >
                    <ArrowUp />
                  </IconButton>
                  <IconButton
                    label="Move down"
                    kind="ghost"
                    size="sm"
                    disabled={isLast}
                    onClick={() => onMoveDown(pool.id)}
                  >
                    <ArrowDown />
                  </IconButton>
                  {pools.length > 1 && (
                    <IconButton
                      label="Delete"
                      kind="ghost"
                      size="sm"
                      className="tw-ml-4"
                      onClick={() => setConfirmingDeleteId(pool.id)}
                    >
                      <TrashCan />
                    </IconButton>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
