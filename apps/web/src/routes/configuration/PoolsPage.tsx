import { useState } from "react";
import { Button, Stack, Tile } from "@carbon/react";
import { Add } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import PageTitle from "@/components/PageTitle";
import TileTitle from "@/components/TileTitle";
import PoolsTable from "@/components/PoolsTable";
import { MOCK_POOL_GROUPS } from "@/shared/mockData";
import type { PoolConfig, PoolGroup } from "@/shared/types";

let nextId = 100;

export default function PoolsPage() {
  const { t } = useTranslation();
  const [draftGroups, setDraftGroups] = useState<PoolGroup[]>(() =>
    MOCK_POOL_GROUPS.map((g) => ({ ...g, pools: [...g.pools] })),
  );

  const updateGroupPools = (
    groupIndex: number,
    updater: (pools: PoolConfig[]) => PoolConfig[],
  ) => {
    setDraftGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, pools: updater([...g.pools]) } : g,
      ),
    );
  };

  const handleToggle = (groupIndex: number, poolId: string) => {
    updateGroupPools(groupIndex, (pools) =>
      pools.map((p) => (p.id === poolId ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const handleUpdate = (
    groupIndex: number,
    poolId: string,
    field: keyof PoolConfig,
    value: string,
  ) => {
    updateGroupPools(groupIndex, (pools) =>
      pools.map((p) => (p.id === poolId ? { ...p, [field]: value } : p)),
    );
  };

  const handleMoveUp = (groupIndex: number, poolId: string) => {
    updateGroupPools(groupIndex, (pools) => {
      const idx = pools.findIndex((p) => p.id === poolId);
      if (idx <= 0) return pools;
      [pools[idx - 1], pools[idx]] = [pools[idx], pools[idx - 1]];
      return pools;
    });
  };

  const handleMoveDown = (groupIndex: number, poolId: string) => {
    updateGroupPools(groupIndex, (pools) => {
      const idx = pools.findIndex((p) => p.id === poolId);
      if (idx === -1 || idx >= pools.length - 1) return pools;
      [pools[idx], pools[idx + 1]] = [pools[idx + 1], pools[idx]];
      return pools;
    });
  };

  const handleDelete = (groupIndex: number, poolId: string) => {
    updateGroupPools(groupIndex, (pools) =>
      pools.filter((p) => p.id !== poolId),
    );
  };

  const handleAddPool = (groupIndex: number) => {
    updateGroupPools(groupIndex, (pools) => [
      ...pools,
      {
        id: String(nextId++),
        enabled: true,
        url: "",
        username: "",
        password: "",
      },
    ]);
  };

  const handleSave = () => {
    alert(t("pools.saveTodo"));
  };

  return (
    <Stack gap={1} className="tw-w-full">
      <PageTitle>{t("pools.title")}</PageTitle>

      {draftGroups.map((group, groupIndex) => (
        <div key={group.name}>
          <TileTitle>{group.name}</TileTitle>
          <Tile className="tw-flex tw-flex-col tw-w-full tw-p-0">
            <PoolsTable
              pools={group.pools}
              onToggle={(poolId) => handleToggle(groupIndex, poolId)}
              onUpdate={(poolId, field, value) =>
                handleUpdate(groupIndex, poolId, field, value)
              }
              onMoveUp={(poolId) => handleMoveUp(groupIndex, poolId)}
              onMoveDown={(poolId) => handleMoveDown(groupIndex, poolId)}
              onDelete={(poolId) => handleDelete(groupIndex, poolId)}
            />
          </Tile>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Add}
            onClick={() => handleAddPool(groupIndex)}
            className="tw-mt-2"
          >
            {t("pools.addPool")}
          </Button>
        </div>
      ))}

      <Button kind="primary" onClick={handleSave} className="tw-pr-4 tw-mt-4">
        {t("pools.save")}
      </Button>
    </Stack>
  );
}
