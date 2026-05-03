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
  "src/components/LocalEvidenceRail.tsx",
  "src/design/tokens.ts",
  "src/components/PanicButton.tsx",
  "src/features/invitations/invitationService.ts",
  "src/features/evidence/evidencePolicy.ts",
  "src/features/emergency/packagePresentation.ts",
  "src/features/emergency/emergencyPreferences.ts",
  "src/features/emergency/emergencyRecorder.ts",
  "src/features/emergency/emergencyOutbox.ts",
  "src/storage/secureJsonStore.ts",
  "android/app/src/main/res/drawable-xxhdpi/splashscreen_logo.png"
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
const legacyDeliveryStatus = String.fromCharCode(113, 117, 101, 117, 101, 100, 95, 102, 111, 114, 95, 100, 101, 108, 105, 118, 101, 114, 121);

if (!emergencyRecorder.includes("stripIntegrity(activePackage)")) {
  throw new Error("Finalizacao de pacote precisa recalcular hash sem carregar integrity antigo.");
}

if (!emergencyRecorder.includes("locationConsentMode = \"foreground_when_triggered\"")) {
  throw new Error("Snapshot de consentimento de localizacao precisa ter padrao conservador.");
}

if (!emergencyRecorder.includes("blocked_until_contract_backend_audit") || emergencyRecorder.includes(legacyDeliveryStatus)) {
  throw new Error("Pacotes locais nao podem prometer entrega ou compartilhamento sem contrato/backend/auditoria.");
}

const locationCapture = await readFile("src/features/emergency/locationCapture.ts", "utf8");

if (!locationCapture.includes("background_location_not_declared_public_build")) {
  throw new Error("Leitura de background location precisa ser segura quando a permissao nao esta no manifest publico.");
}

if (locationCapture.includes(["error", "message"].join("."))) {
  throw new Error("Erros brutos de localizacao nao podem ser preservados em pacote local.");
}

const appConfig = await readFile("app.json", "utf8");

if (!appConfig.includes("\"image\": \"./assets/brand/sinalseguro-symbol.png\"")) {
  throw new Error("Splash nativa precisa exibir o simbolo discreto para evitar tela roxa vazia antes do React.");
}

const launchScreen = await readFile("src/components/AppLaunchScreen.tsx", "utf8");

if (!launchScreen.includes("Carregando SinalSeguro") || launchScreen.includes("glow")) {
  throw new Error("Splash custom precisa ter barra de loading e nao usar efeitos glow ornamentais.");
}

const localEvidenceRail = await readFile("src/components/LocalEvidenceRail.tsx", "utf8");

if (!localEvidenceRail.includes("onDeletePackage") || !localEvidenceRail.includes("Compartilhar")) {
  throw new Error("Cofre local precisa expor acoes de visualizar, compartilhar bloqueado e excluir local.");
}

if (!localEvidenceRail.includes("rayActionView") || !localEvidenceRail.includes("rayHub")) {
  throw new Error("Cofre local precisa manter menu de acoes em raios ancorado no icone do arquivo.");
}

const panicButton = await readFile("src/components/PanicButton.tsx", "utf8");

if (!panicButton.includes("particleConfigs") || !panicButton.includes("buttonArmed")) {
  throw new Error("Botao SOS ativo precisa ter estado visual proprio e particulas discretas.");
}

const emergencyPreferences = await readFile("src/features/emergency/emergencyPreferences.ts", "utf8");

if (!emergencyPreferences.includes("finishSafety") || !emergencyPreferences.includes("codeHash")) {
  throw new Error("Encerramento seguro precisa ser configuravel e usar hash local do codigo.");
}

const emergencyOutbox = await readFile("src/features/emergency/emergencyOutbox.ts", "utf8");

if (!emergencyOutbox.includes("deleteEmergencyPackage")) {
  throw new Error("Cofre local precisa ter exclusao local funcional e controlada.");
}

if (!emergencyOutbox.includes("removed_from_device")) {
  throw new Error("Exclusao de evidencia local precisa registrar tombstone/auditoria local.");
}

console.log("Smoke test mobile aprovado.");
