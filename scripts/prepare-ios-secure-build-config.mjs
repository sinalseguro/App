#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Gera um xcconfig temporario fora do Git com valores locais necessarios ao
// build iOS nativo. Nao imprime Client IDs nem URL schemes.
const mobileRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(mobileRoot, ".env.local");
const outputPath = process.env.IOS_SECURE_XCCONFIG_PATH || "/private/tmp/sinalseguro-ios-secrets.xcconfig";

const relativeOutputPath = path.relative(mobileRoot, path.resolve(outputPath));
if (!relativeOutputPath.startsWith("..") && !path.isAbsolute(relativeOutputPath)) {
  console.error("xcconfig_path=inside_repository");
  process.exit(1);
}

function parseDotenv(source) {
  const values = {};

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function readLocalEnv() {
  if (!fs.existsSync(envPath)) return {};
  return parseDotenv(fs.readFileSync(envPath, "utf8"));
}

const localEnv = readLocalEnv();

function getConfigValue(key) {
  return (process.env[key] ?? localEnv[key] ?? "").trim();
}

function requireConfigured(key, label, pattern) {
  const value = getConfigValue(key);

  if (!value) {
    console.error(`${label}=missing`);
    process.exit(1);
  }

  if (pattern && !pattern.test(value)) {
    console.error(`${label}=invalid`);
    process.exit(1);
  }

  return value;
}

requireConfigured(
  "EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID",
  "google_web_client_id",
  /^[A-Za-z0-9._-]+\.apps\.googleusercontent\.com$/
);
requireConfigured(
  "EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID",
  "google_ios_client_id",
  /^[A-Za-z0-9._-]+\.apps\.googleusercontent\.com$/
);
const googleIosUrlScheme = requireConfigured(
  "EXPO_PUBLIC_GOOGLE_OIDC_IOS_URL_SCHEME",
  "google_ios_url_scheme",
  /^com\.googleusercontent\.apps\.[A-Za-z0-9._-]+$/
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  [
    "// Generated locally by scripts/prepare-ios-secure-build-config.mjs.",
    "// Do not commit this file.",
    `GOOGLE_SIGNIN_IOS_URL_SCHEME = ${googleIosUrlScheme}`,
    "",
  ].join("\n"),
  { mode: 0o600 }
);
fs.chmodSync(outputPath, 0o600);

console.log("ios_secure_build_config=ok");
console.log(`xcconfig_path=${outputPath}`);
console.log("google_web_client_id=configured");
console.log("google_ios_client_id=configured");
console.log("google_ios_url_scheme=configured");
