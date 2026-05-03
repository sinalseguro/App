import { access, readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const checks = [];

function addCheck(name, status, detail) {
  checks.push({ name, status, detail });
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  });

  return {
    ok: result.status === 0,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    status: result.status
  };
}

function isGitIgnored(candidate) {
  const result = run("git", ["check-ignore", "-q", candidate]);
  return result.status === 0;
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const appJson = JSON.parse(await readFile("app.json", "utf8"));
const easJson = JSON.parse(await readFile("eas.json", "utf8"));

function pluginOptions(pluginName) {
  const plugins = appJson.expo?.plugins ?? [];
  const plugin = plugins.find((item) => item === pluginName || (Array.isArray(item) && item[0] === pluginName));
  return Array.isArray(plugin) ? plugin[1] ?? {} : {};
}

const nodeVersion = process.versions.node.split(".").map(Number);
const nodeOk = nodeVersion[0] > 22 || (nodeVersion[0] === 22 && nodeVersion[1] >= 13);
addCheck("node", nodeOk ? "ok" : "blocker", `Node atual: ${process.versions.node}; requerido: >=22.13.0`);

const android = appJson.expo?.android;
const buildPropertiesAndroid = pluginOptions("expo-build-properties").android ?? {};
const minSdkVersion = android?.minSdkVersion ?? buildPropertiesAndroid.minSdkVersion;
const targetSdkVersion = android?.targetSdkVersion ?? buildPropertiesAndroid.targetSdkVersion;
addCheck(
  "android-package",
  android?.package === "br.com.sinalseguro.app" ? "ok" : "blocker",
  `package=${android?.package ?? "ausente"}`
);
addCheck(
  "android-sdk",
  minSdkVersion >= 24 && targetSdkVersion >= 36 ? "ok" : "blocker",
  `minSdk=${minSdkVersion ?? "ausente"} targetSdk=${targetSdkVersion ?? "ausente"}`
);

const preview = easJson.build?.preview;
addCheck(
  "eas-preview",
  preview?.distribution === "internal" && preview?.android?.buildType === "apk" ? "ok" : "blocker",
  `preview.distribution=${preview?.distribution ?? "ausente"} preview.android.buildType=${preview?.android?.buildType ?? "ausente"}`
);

const production = easJson.build?.production;
addCheck(
  "eas-production",
  production?.android?.buildType === "app-bundle" ? "ok" : "blocker",
  `production.android.buildType=${production?.android?.buildType ?? "ausente"}`
);

const blockedMediaPermissions = ["CAMERA", "RECORD_AUDIO"].filter((permission) =>
  android?.permissions?.includes(permission)
);
addCheck(
  "android-permissions-stage-1",
  blockedMediaPermissions.length === 0 ? "ok" : "blocker",
  blockedMediaPermissions.length
    ? `Permissoes prematuras para Etapa 1: ${blockedMediaPermissions.join(", ")}`
    : "Sem camera/microfone no primeiro instalavel"
);

const plugins = appJson.expo?.plugins ?? [];
const hasCameraPlugin = plugins.some(
  (plugin) => plugin === "expo-camera" || (Array.isArray(plugin) && plugin[0] === "expo-camera")
);
const hasMediaDependencies = ["expo-camera", "expo-video"].filter((dependency) =>
  Boolean(packageJson.dependencies?.[dependency])
);
addCheck(
  "android-media-public-gate",
  hasCameraPlugin || hasMediaDependencies.length > 0 ? "blocker" : "ok",
  hasCameraPlugin || hasMediaDependencies.length > 0
    ? `Workspace atual contem midia privada (${[
        hasCameraPlugin ? "expo-camera-plugin" : null,
        ...hasMediaDependencies
      ]
        .filter(Boolean)
        .join(", ")}); release publico exige perfil/branch sem midia`
    : "Sem plugin/dependencia de midia no release publico"
);

const remote = run("git", ["remote", "get-url", "origin"]);
addCheck(
  "git-origin",
  remote.ok && remote.stdout.includes("github-sinalseguro-admin:sinalseguro/App.git") ? "ok" : "blocker",
  remote.stdout || remote.stderr
);

const lsRemote = run("git", ["ls-remote", "origin", "refs/heads/main"]);
addCheck("git-remote-access", lsRemote.ok ? "ok" : "blocker", lsRemote.stdout || lsRemote.stderr);

const androidHome = process.env.ANDROID_HOME || path.join(process.env.HOME ?? "", "Library/Android/sdk");
const platformsDir = path.join(androidHome, "platforms");
let platforms = [];
if (await exists(platformsDir)) {
  platforms = (await readdir(platformsDir)).filter((item) => item.startsWith("android-"));
}
addCheck(
  "android-sdk-platforms",
  platforms.includes("android-36") ? "ok" : "pending",
  platforms.length
    ? `Plataformas: ${platforms.join(", ")}`
    : `Nenhuma plataforma encontrada em ${platformsDir}; obrigatorio apenas para build local`
);

const keyEnvVars = ["SINAL_APP_ANDROID_KEYSTORE_PATH", "SINAL_APP_ANDROID_KEY_ALIAS"];
const missingEnvVars = keyEnvVars.filter((name) => !process.env[name]);
addCheck(
  "signing-env",
  missingEnvVars.length === 0 ? "ok" : "pending",
  missingEnvVars.length ? `Variaveis pendentes: ${missingEnvVars.join(", ")}` : "Variaveis de assinatura declaradas"
);

const forbiddenFiles = [];
const generatedNativeDirs = [];
for (const candidate of ["android", "ios", ".env", ".env.local", "sinalseguro.keystore", "release.keystore"]) {
  if (await exists(candidate)) {
    const candidateStat = await stat(candidate);
    const displayName = `${candidate}${candidateStat.isDirectory() ? "/" : ""}`;
    if ((candidate === "android" || candidate === "ios") && candidateStat.isDirectory() && isGitIgnored(displayName)) {
      generatedNativeDirs.push(displayName);
    } else {
      forbiddenFiles.push(displayName);
    }
  }
}
addCheck(
  "repo-generated-native",
  generatedNativeDirs.length === 0 ? "ok" : "pending",
  generatedNativeDirs.length
    ? `Diretorios nativos gerados e ignorados pelo Git: ${generatedNativeDirs.join(", ")}`
    : "Sem diretorios nativos gerados no workspace"
);
addCheck(
  "repo-sensitive-files",
  forbiddenFiles.length === 0 ? "ok" : "blocker",
  forbiddenFiles.length ? `Arquivos sensiveis/gerados presentes: ${forbiddenFiles.join(", ")}` : "Sem artefatos sensiveis conhecidos no repo"
);

addCheck(
  "scripts",
  packageJson.scripts?.["assets:qr"] &&
    packageJson.scripts?.["release:android:readiness"] &&
    packageJson.scripts?.["build:android:preview"]
    ? "ok"
    : "blocker",
  "Scripts de QR, prontidao Android e build preview"
);

const blockers = checks.filter((check) => check.status === "blocker");
const pending = checks.filter((check) => check.status === "pending");

console.log("Readiness Android - SinalSeguro");
for (const check of checks) {
  const marker = check.status === "ok" ? "OK" : check.status === "pending" ? "PENDENTE" : "BLOQUEIO";
  console.log(`- ${marker}: ${check.name} - ${check.detail}`);
}

if (blockers.length > 0) {
  console.error(`\nResultado: bloqueado (${blockers.length} bloqueio(s), ${pending.length} pendencia(s)).`);
  process.exit(1);
}

console.log(`\nResultado: pronto para build condicionado (${pending.length} pendencia(s)).`);
