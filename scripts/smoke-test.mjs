import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "AGENTS.md",
  ".codex/AGENTS.md",
  ".codex/memory/CRISTINE.md",
  "docs/00_PLANO_MOBILE.md",
  "docs/03_TIMELINE.md",
  "docs/api/openapi.yaml",
  "app/_layout.tsx",
  "app/index.tsx",
  "app/arquivos.tsx",
  "app/convite.tsx",
  "src/design/tokens.ts",
  "src/components/PanicButton.tsx",
  "src/features/invitations/invitationService.ts",
  "src/features/emergency/packagePresentation.ts",
  "src/features/emergency/emergencyRecorder.ts",
  "src/features/emergency/emergencyOutbox.ts",
  "src/storage/secureJsonStore.ts"
];

for (const file of requiredFiles) {
  await access(file);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.main !== "expo-router/entry") {
  throw new Error("Expo Router precisa continuar como entrypoint principal.");
}

if (!packageJson.dependencies.expo || !packageJson.dependencies["expo-router"]) {
  throw new Error("Dependencias Expo essenciais ausentes.");
}

console.log("Smoke test mobile aprovado.");
