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
  "src/components/AppLaunchScreen.tsx",
  "src/components/EmergencyCallButton.tsx",
  "src/components/EvidencePlayerCard.tsx",
  "src/design/tokens.ts",
  "src/components/PanicButton.tsx",
  "src/features/invitations/invitationService.ts",
  "src/features/evidence/evidencePolicy.ts",
  "src/features/emergency/packagePresentation.ts",
  "src/features/emergency/emergencyPreferences.ts",
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

const emergencyRecorder = await readFile("src/features/emergency/emergencyRecorder.ts", "utf8");

if (!emergencyRecorder.includes("stripIntegrity(activePackage)")) {
  throw new Error("Finalizacao de pacote precisa recalcular hash sem carregar integrity antigo.");
}

if (!emergencyRecorder.includes("locationConsentMode = \"foreground_when_triggered\"")) {
  throw new Error("Snapshot de consentimento de localizacao precisa ter padrao conservador.");
}

const locationCapture = await readFile("src/features/emergency/locationCapture.ts", "utf8");

if (!locationCapture.includes("background_location_not_declared_public_build")) {
  throw new Error("Leitura de background location precisa ser segura quando a permissao nao esta no manifest publico.");
}

const launchScreen = await readFile("src/components/AppLaunchScreen.tsx", "utf8");

if (!launchScreen.includes("Carregando SinalSeguro") || launchScreen.includes("glow")) {
  throw new Error("Splash custom precisa ter barra de loading e nao usar efeitos glow ornamentais.");
}

console.log("Smoke test mobile aprovado.");
