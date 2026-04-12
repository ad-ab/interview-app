# BR-4: Pools Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Pools configuration page with editable pool rows, reordering, inline delete confirmation, and URL validation.

**Architecture:** PoolsPage owns draft state (single "Default" PoolGroup), delegates table rendering to PoolsTable component. Follows the LogPage → LogsTable pattern. All strings internationalized across en/es/de.

**Tech Stack:** React 18, TypeScript, Carbon Design System (`@carbon/react`, `@carbon/icons-react`), react-i18next, Tailwind (tw- prefix)

**Spec:** `docs/superpowers/specs/2026-04-12-pools-page-design.md`

---

### Task 1: Add types, regex, and mock data

**Files:**
- Modify: `apps/web/src/types.tsx`
- Modify: `apps/web/src/regex.tsx`
- Modify: `apps/web/src/mockData.tsx`

- [ ] **Step 1: Add PoolConfig and PoolGroup to types.tsx**

Add at the end of `apps/web/src/types.tsx`:

```typescript
/** A single mining pool connection. */
export interface PoolConfig {
  id: string;
  enabled: boolean;
  url: string;
  username: string;
  password: string;
}

/** A named group of pool connections. */
export interface PoolGroup {
  name: string;
  pools: PoolConfig[];
}
```

- [ ] **Step 2: Add STRATUM_URL_REGEX to regex.tsx**

Add at the end of `apps/web/src/regex.tsx`:

```typescript
export const STRATUM_URL_REGEX = /^stratum\+(tcp|ssl):\/\/.+/;
```

- [ ] **Step 3: Add MOCK_POOL_GROUPS to mockData.tsx**

Add the import at the top of `apps/web/src/mockData.tsx`:

```typescript
import { LogSeverity, type LogEntry, type PoolGroup } from "@/types";
```

Add at the end of the file:

```typescript
// ── Configuration — Pools page ──────────────────────────────────────────────

export const MOCK_POOL_GROUPS: readonly PoolGroup[] = [
  {
    name: "Default",
    pools: [
      {
        id: "1",
        enabled: true,
        url: "stratum+tcp://pool.braiins.com:3333",
        username: "worker1.miner01",
        password: "x",
      },
      {
        id: "2",
        enabled: true,
        url: "stratum+tcp://pool.slushpool.com:3333",
        username: "worker1.backup",
        password: "x",
      },
      {
        id: "3",
        enabled: false,
        url: "stratum+ssl://f2pool.com:6688",
        username: "myworker",
        password: "x",
      },
    ],
  },
];
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/types.tsx apps/web/src/regex.tsx apps/web/src/mockData.tsx
git commit -m "feat(BR-4): add PoolConfig/PoolGroup types, stratum regex, and mock data"
```

---

### Task 2: Add i18n keys to all three locale files

**Files:**
- Modify: `apps/web/src/i18n/locales/en.json`
- Modify: `apps/web/src/i18n/locales/es.json`
- Modify: `apps/web/src/i18n/locales/de.json`

- [ ] **Step 1: Add pools namespace to en.json**

Add the following block after the `"log"` section (before the final `}`):

```json
  "pools": {
    "title": "Pools",
    "columns": {
      "url": "Pool URL",
      "username": "Username",
      "password": "Password",
      "actions": "Actions"
    },
    "addPool": "Add Pool",
    "save": "Save",
    "saveTodo": "todo",
    "validation": {
      "invalidUrl": "Must start with stratum+tcp:// or stratum+ssl://"
    },
    "deleteConfirm": "Are you sure you want to remove this pool?",
    "deleteYes": "Yes",
    "deleteNo": "No"
  }
```

- [ ] **Step 2: Add pools namespace to es.json**

Add after the `"log"` section:

```json
  "pools": {
    "title": "Pools",
    "columns": {
      "url": "URL del Pool",
      "username": "Usuario",
      "password": "Contraseña",
      "actions": "Acciones"
    },
    "addPool": "Agregar Pool",
    "save": "Guardar",
    "saveTodo": "todo",
    "validation": {
      "invalidUrl": "Debe comenzar con stratum+tcp:// o stratum+ssl://"
    },
    "deleteConfirm": "¿Estás seguro de que quieres eliminar este pool?",
    "deleteYes": "Sí",
    "deleteNo": "No"
  }
```

- [ ] **Step 3: Add pools namespace to de.json**

Add after the `"log"` section:

```json
  "pools": {
    "title": "Pools",
    "columns": {
      "url": "Pool-URL",
      "username": "Benutzername",
      "password": "Passwort",
      "actions": "Aktionen"
    },
    "addPool": "Pool hinzufügen",
    "save": "Speichern",
    "saveTodo": "todo",
    "validation": {
      "invalidUrl": "Muss mit stratum+tcp:// oder stratum+ssl:// beginnen"
    },
    "deleteConfirm": "Möchten Sie diesen Pool wirklich entfernen?",
    "deleteYes": "Ja",
    "deleteNo": "Nein"
  }
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/i18n/locales/en.json apps/web/src/i18n/locales/es.json apps/web/src/i18n/locales/de.json
git commit -m "feat(BR-4): add pools i18n keys to en/es/de locale files"
```

---

### Task 3: Create PoolsTable component

**Files:**
- Create: `apps/web/src/components/PoolsTable.tsx`

- [ ] **Step 1: Create PoolsTable.tsx**

Create `apps/web/src/components/PoolsTable.tsx`:

```typescript
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
                      className="tw-ml-3"
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/PoolsTable.tsx
git commit -m "feat(BR-4): create PoolsTable component with toggle, inputs, reorder, and inline delete confirmation"
```

---

### Task 4: Implement PoolsPage

**Files:**
- Modify: `apps/web/src/routes/configuration/PoolsPage.tsx`

- [ ] **Step 1: Replace PoolsPage stub with full implementation**

Replace the entire contents of `apps/web/src/routes/configuration/PoolsPage.tsx`:

```typescript
import { useState } from "react";
import { Button, Stack, Tile } from "@carbon/react";
import { Add } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import PageTitle from "@/components/PageTitle";
import TileTitle from "@/components/TileTitle";
import PoolsTable from "@/components/PoolsTable";
import { MOCK_POOL_GROUPS } from "@/mockData";
import type { PoolConfig, PoolGroup } from "@/types";

let nextId = 100;

export default function PoolsPage() {
  const { t } = useTranslation();
  const [draftGroups, setDraftGroups] = useState<PoolGroup[]>(
    () => MOCK_POOL_GROUPS.map((g) => ({ ...g, pools: [...g.pools] })),
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
      pools.map((p) =>
        p.id === poolId ? { ...p, enabled: !p.enabled } : p,
      ),
    );
  };

  const handleUpdate = (
    groupIndex: number,
    poolId: string,
    field: keyof PoolConfig,
    value: string,
  ) => {
    updateGroupPools(groupIndex, (pools) =>
      pools.map((p) =>
        p.id === poolId ? { ...p, [field]: value } : p,
      ),
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
    <Stack gap={1}>
      <PageTitle>{t("pools.title")}</PageTitle>

      {draftGroups.map((group, groupIndex) => (
        <div key={group.name}>
          <TileTitle>{group.name}</TileTitle>
          <Tile className="tw-p-0">
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/configuration/PoolsPage.tsx
git commit -m "feat(BR-4): implement PoolsPage with draft state, add/reorder/delete pool support"
```

---

### Task 5: Visual verification and polish

**Files:**
- Possibly modify: `apps/web/src/components/PoolsTable.tsx`
- Possibly modify: `apps/web/src/routes/configuration/PoolsPage.tsx`

- [ ] **Step 1: Start the dev server**

Run: `cd /home/adam/Git/my-fullstack-app && pnpm dev`

- [ ] **Step 2: Open http://localhost:5173/configuration/pools in browser and verify:**

1. Page title "Pools" is visible
2. "Default" group title is visible
3. Table shows 3 rows with correct mock data
4. Toggle switches work (disabled rows dim inputs but not action buttons)
5. ArrowUp disabled on first row, ArrowDown disabled on last row
6. 16px gap between arrow buttons and TrashCan icon
7. TrashCan hidden when only 1 pool remains
8. Clicking TrashCan shows inline "Are you sure?" confirmation
9. "No" cancels, "Yes" removes the row
10. "Add Pool" button appends a new empty enabled row
11. Pool URL validates on blur — invalid shows error text
12. "Save" button shows alert("todo")
13. Password field shows as masked input
14. Username and Password columns are same width

- [ ] **Step 3: Test i18n by switching to Spanish and German**

Verify all pool-related strings are translated (use the language switcher in the top bar).

- [ ] **Step 4: Fix any visual issues found**

Apply CSS/layout fixes as needed to match the approved mockup.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix(BR-4): visual polish for Pools page after manual verification"
```

Only commit this step if changes were made in step 4.
