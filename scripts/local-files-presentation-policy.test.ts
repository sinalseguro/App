import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildLocalFilesMaintenanceStatus,
  buildLocalFilesMapDialogMessage,
  buildLocalFilesRefreshStatus,
  buildLocalFilesTopBarContextLabel,
  buildLocalFilesUpdateDialogMessage,
  localFilesResourceTiles,
  localFilesScreenCopy
} from "../src/features/emergency/localFilesPresentationPolicy";
import {
  buildLocalFilesResourceGridRows,
  localFilesResourceGridPresentation,
  resolveLocalFilesResourceGridIconPresentation
} from "../src/features/local-files/localFilesResourceGridPresentationPolicy";

assert.equal(localFilesResourceTiles.length, 4);
assert.deepEqual(
  localFilesResourceTiles.map((tile) => tile.id),
  ["player", "vault", "how-it-works", "app-updates"]
);
assert.deepEqual(
  localFilesResourceTiles.map((tile) => tile.iconKey),
  ["play", "archive", "book", "refresh"]
);
assert.equal(new Set(localFilesResourceTiles.map((tile) => tile.id)).size, localFilesResourceTiles.length);
assert.deepEqual(localFilesResourceGridPresentation.rowStartIndexes, [0, 2]);
assert.equal(localFilesResourceGridPresentation.tilesPerRow, 2);
assert.deepEqual(resolveLocalFilesResourceGridIconPresentation(), {
  colorToken: "primary",
  size: 24
});

const localFilesResourceRows = buildLocalFilesResourceGridRows(localFilesResourceTiles);
assert.deepEqual(
  localFilesResourceRows.map((row) => row.id),
  ["resource-row-0", "resource-row-2"]
);
assert.deepEqual(
  localFilesResourceRows.map((row) => row.tiles.map((tile) => tile.id)),
  [
    ["player", "vault"],
    ["how-it-works", "app-updates"]
  ]
);

assert.equal(buildLocalFilesTopBarContextLabel("player"), "Player seguro");
assert.equal(buildLocalFilesTopBarContextLabel("cofre"), "Cofre local");
assert.equal(buildLocalFilesTopBarContextLabel(null), "Cofre local");

assert.equal(buildLocalFilesRefreshStatus(2), localFilesScreenCopy.loadedStatus);
assert.equal(buildLocalFilesRefreshStatus(0), localFilesScreenCopy.emptyStatus);
assert.equal(buildLocalFilesRefreshStatus(0, "Status manual"), "Status manual");

assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: true,
    maintenanceAvailable: false
  }),
  "Volte ao SOS para recuperar o chamado ativo antes da limpeza."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    blockedReferencedCount: 1,
    maintenanceAvailable: true
  }),
  "Arquivos carregados. Ha midia clara legada referenciada que exige nova tentativa de migracao."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    maintenanceAvailable: true,
    migrationBlockedCount: 1
  }),
  "Arquivos carregados. Ha midia clara legada referenciada que exige nova tentativa de migracao."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    deletedCount: 1,
    maintenanceAvailable: true
  }),
  "Arquivos carregados. Midia legada foi protegida ou removida."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    maintenanceAvailable: true,
    migratedReferencedCount: 1
  }),
  "Arquivos carregados. Midia legada foi protegida ou removida."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    maintenanceAvailable: false
  }),
  "Arquivos carregados. Nao foi possivel concluir a verificacao de residuos."
);
assert.equal(
  buildLocalFilesMaintenanceStatus({
    activePackageDetected: false,
    maintenanceAvailable: true
  }),
  undefined
);

assert.equal(
  buildLocalFilesUpdateDialogMessage({
    currentVersionLabel: "0.1.15 (17)",
    latestVersionLabel: "0.1.16 (18)",
    message: "Atualizacao disponivel."
  }),
  "Atualizacao disponivel.\n\nInstalada: 0.1.15 (17)\nDisponivel: 0.1.16 (18)"
);
assert.equal(
  buildLocalFilesUpdateDialogMessage({
    currentVersionLabel: "0.1.15 (17)",
    latestVersionLabel: null,
    message: "Voce ja esta com a versao atual."
  }),
  "Voce ja esta com a versao atual.\n\nInstalada: 0.1.15 (17)"
);

assert.equal(
  buildLocalFilesMapDialogMessage(["Data e hora: 22/05/2026", "Localizacao salva neste arquivo."]),
  `Data e hora: 22/05/2026\nLocalizacao salva neste arquivo.\n\n${localFilesScreenCopy.mapExternalLocationWarning}`
);
assert.match(localFilesScreenCopy.deleteConfirmTitle, /Excluir arquivo local/);
assert.match(localFilesScreenCopy.mapExternalLocationWarning, /localizacao exata/);

const gridPolicySource = readFileSync(
  "src/features/local-files/localFilesResourceGridPresentationPolicy.ts",
  "utf8"
);
assert.ok(!gridPolicySource.includes("onOpen"));
assert.ok(!gridPolicySource.includes("router"));
assert.ok(!gridPolicySource.includes("deleteEmergencyPackage"));

console.log("local files presentation policy ok");
