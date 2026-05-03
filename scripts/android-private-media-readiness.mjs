import { readFile } from "node:fs/promises";

const checks = [];

function addCheck(name, status, detail) {
  checks.push({ name, status, detail });
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const appJson = JSON.parse(await readFile("app.json", "utf8"));
const android = appJson.expo?.android ?? {};
const permissions = android.permissions ?? [];
const blockedPermissions = android.blockedPermissions ?? [];

const nodeVersion = process.versions.node.split(".").map(Number);
const nodeOk = nodeVersion[0] > 22 || (nodeVersion[0] === 22 && nodeVersion[1] >= 13);
addCheck(
  "node-local-debug",
  nodeOk ? "ok" : "pending",
  `Node atual: ${process.versions.node}; release publico exige >=22.13.0, build privado debug aceita pendencia local`
);

addCheck(
  "package-private",
  packageJson.private === true ? "ok" : "blocker",
  packageJson.private === true ? "package.json marcado como private" : "package.json precisa de private=true"
);

for (const permission of ["CAMERA", "RECORD_AUDIO"]) {
  addCheck(
    `app-json-public-default-${permission}`,
    permissions.includes(permission) ? "pending" : "ok",
    permissions.includes(permission)
      ? `${permission} declarada no app.json; preferir ativacao somente pelo Manifest privado`
      : `${permission} fora do app.json publico; build privado deve ativar via Manifest nativo`
  );
}

for (const permission of [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE"
]) {
  addCheck(
    `blocked-${permission}`,
    blockedPermissions.includes(permission) ? "ok" : "blocker",
    blockedPermissions.includes(permission)
      ? `${permission} segue bloqueada`
      : `${permission} precisa continuar bloqueada mesmo no build privado`
  );
}

for (const dependency of ["expo-camera", "expo-video", "expo-file-system", "expo-crypto"]) {
  addCheck(
    `dependency-${dependency}`,
    packageJson.dependencies?.[dependency] ? "ok" : "blocker",
    packageJson.dependencies?.[dependency] ? `${dependency} instalado` : `${dependency} ausente`
  );
}

addCheck(
  "script-build-private",
  Boolean(packageJson.scripts?.["build:android:private"]) ? "ok" : "blocker",
  packageJson.scripts?.["build:android:private"] ?? "script ausente"
);

const manifest = await readOptional("android/app/src/main/AndroidManifest.xml");
if (manifest) {
  for (const permission of ["android.permission.CAMERA", "android.permission.RECORD_AUDIO"]) {
    const hasPermission = manifest.includes(`android:name="${permission}"`);
    const removed = manifest.includes(`android:name="${permission}" tools:node="remove"`);
    addCheck(
      `manifest-${permission}`,
      hasPermission && !removed ? "ok" : "blocker",
      hasPermission && !removed
        ? `${permission} ativo no Manifest nativo`
        : `${permission} ausente ou removido no Manifest nativo; rode npm run build:android:private`
    );
  }

  addCheck(
    "manifest-backup",
    manifest.includes('android:allowBackup="false"') &&
      !manifest.includes("android:fullBackupContent=") &&
      !manifest.includes("android:dataExtractionRules=")
      ? "ok"
      : "blocker",
    "Manifest privado deve bloquear backup e nao referenciar regras de extracao para midia sensivel"
  );
} else {
  addCheck(
    "manifest-native",
    "pending",
    "Projeto Android ainda nao gerado; o build privado aplica as regras no prebuild/patch"
  );
}

const blockers = checks.filter((check) => check.status === "blocker");
const pending = checks.filter((check) => check.status === "pending");

console.log("Readiness Android privado com midia local - SinalSeguro");
for (const check of checks) {
  const marker = check.status === "ok" ? "OK" : check.status === "pending" ? "PENDENTE" : "BLOQUEIO";
  console.log(`- ${marker}: ${check.name} - ${check.detail}`);
}

if (blockers.length > 0) {
  console.error(`\nResultado: bloqueado (${blockers.length} bloqueio(s), ${pending.length} pendencia(s)).`);
  process.exit(1);
}

console.log(`\nResultado: pronto para build privado condicionado (${pending.length} pendencia(s)).`);
