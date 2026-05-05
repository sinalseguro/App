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
  "app/configuracoes.tsx",
  "app/convite.tsx",
  "app/funcionamento.tsx",
  "src/components/AppTopBar.tsx",
  "src/components/AppLaunchScreen.tsx",
  "src/components/BrandedDialog.tsx",
  "src/components/EmergencyCallButton.tsx",
  "src/components/EvidencePlayerCard.tsx",
  "src/components/LocalEvidenceRail.tsx",
  "src/components/ResourceTile.tsx",
  "src/design/tokens.ts",
  "src/components/PanicButton.tsx",
  "src/features/emergency-home/EmergencyCallDock.tsx",
  "src/features/emergency-home/EmergencyCallTarget.ts",
  "src/features/emergency-home/EmergencySettingsDrawer.tsx",
  "src/features/emergency-home/EmergencyTopBar.tsx",
  "src/features/invitations/invitationService.ts",
  "src/features/evidence/evidencePolicy.ts",
  "src/features/emergency/packagePresentation.ts",
  "src/features/emergency/emergencyPreferences.ts",
  "src/features/emergency/emergencyRecorder.ts",
  "src/features/emergency/emergencyOutbox.ts",
  "src/features/emergency/EmergencyMediaRecorder.tsx",
  "src/features/emergency/mediaCapture.ts",
  "src/storage/secureJsonStore.ts",
  "scripts/android-private-media-readiness.mjs",
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

if (!appConfig.includes("\"image\": \"./assets/brand/sinalseguro-splash-approved.png\"")) {
  throw new Error("Splash nativa precisa usar o layout aprovado por Tarcila com logo, nome e fundo institucional.");
}

const launchScreen = await readFile("src/components/AppLaunchScreen.tsx", "utf8");

if (!launchScreen.includes("Carregando SinalSeguro") || launchScreen.includes("glow")) {
  throw new Error("Splash custom precisa ter barra de loading e nao usar efeitos glow ornamentais.");
}

const localEvidenceRail = await readFile("src/components/LocalEvidenceRail.tsx", "utf8");
const localFilesScreen = await readFile("app/arquivos.tsx", "utf8");
const settingsScreen = await readFile("app/configuracoes.tsx", "utf8");

if (!localEvidenceRail.includes("onDeletePackage") || !localEvidenceRail.includes("Compartilhar")) {
  throw new Error("Cofre local precisa expor acoes de visualizar, compartilhar pelo app e excluir local.");
}

if (
  !localEvidenceRail.includes("Grade vertical de arquivos locais") ||
  !localEvidenceRail.includes("actionGrid") ||
  localEvidenceRail.includes("rayHub") ||
  localEvidenceRail.includes("rayAction")
) {
  throw new Error("Cofre local precisa usar grade vertical de icones com acoes agrupadas em linhas e colunas.");
}

if (!localEvidenceRail.includes("formatPackageDurationLabel") || !localEvidenceRail.includes("fileDuration")) {
  throw new Error("Grade do cofre precisa mostrar duracao/tempo de gravacao do arquivo.");
}

if (!localFilesScreen.includes("Excluir arquivo local?") || !localFilesScreen.includes("Finalize o chamado antes")) {
  throw new Error("Exclusao local de pacote precisa confirmar acao destrutiva e bloquear chamado ativo.");
}

if (
  !localFilesScreen.includes("Linking.canOpenURL") ||
  !localFilesScreen.includes("Google Maps") ||
  !localFilesScreen.includes("localizacao exata deste registro")
) {
  throw new Error("Abertura de mapa precisa validar plataforma e avisar envio de localizacao a app externo.");
}

if (
  !settingsScreen.includes("legalConsentItems") ||
  !settingsScreen.includes("Uso emergencial") ||
  !settingsScreen.includes("Privacidade") ||
  !settingsScreen.includes("Arquivos locais")
) {
  throw new Error("Termos e privacidade precisam exibir resumo visivel antes do aceite local.");
}

if (!settingsScreen.includes("Atalho de anjo desativado") || !settingsScreen.includes("Anjo 190 bloqueado ate aceite")) {
  throw new Error("Atalho de anjo precisa permanecer desativado ate gestao, aceite e contrato futuros.");
}

const panicButton = await readFile("src/components/PanicButton.tsx", "utf8");

if (!panicButton.includes("particleConfigs") || !panicButton.includes("buttonArmed")) {
  throw new Error("Botao SOS ativo precisa ter estado visual proprio e particulas discretas.");
}

if (
  !panicButton.includes("theme.colors.secure") ||
  !panicButton.includes("zIndex: 8") ||
  panicButton.includes("activeStatusGlow")
) {
  throw new Error("Texto ATIVO precisa ficar acima das particulas e usar apenas sombra verde, sem faixa atras do texto.");
}

if (!panicButton.includes("width: \"75%\"") || !panicButton.includes("aspectRatio: 1")) {
  throw new Error("Botao SOS precisa ocupar area responsiva de destaque na home.");
}

if (
  !panicButton.includes("CircularHoldProgress") ||
  !panicButton.includes("strokeDashoffset") ||
  !panicButton.includes("translate(100 0) scale(-1 1)")
) {
  throw new Error("Botao SOS precisa usar progresso circular horario para acionar e anti-horario para encerrar.");
}

const homeScreen = await readFile("app/index.tsx", "utf8");

if (homeScreen.includes("<SafeScreen") || homeScreen.includes("Rede de apoio discreta")) {
  throw new Error("Home de emergencia nao pode usar tela rolavel nem manter titulo/subtitulo duplicados.");
}

if (homeScreen.includes("Alert.alert") || localFilesScreen.includes("Alert.alert")) {
  throw new Error("Fluxos criticos da Home e Cofre devem usar modal SinalSeguro, nao Alert nativo.");
}

if (homeScreen.includes("showPoliceShortcut={preferences.emergencyPhoneCall.call190ShortcutEnabled}")) {
  throw new Error("Home nao pode ocultar Policia 190; Policia, Bombeiros e SAMU devem vir ativos por padrao.");
}

const emergencyTopBar = await readFile("src/features/emergency-home/EmergencyTopBar.tsx", "utf8");
const emergencyDrawer = await readFile("src/features/emergency-home/EmergencySettingsDrawer.tsx", "utf8");
const emergencyCallTarget = await readFile("src/features/emergency-home/EmergencyCallTarget.ts", "utf8");
const emergencyCallDock = await readFile("src/features/emergency-home/EmergencyCallDock.tsx", "utf8");
const appTopBar = await readFile("src/components/AppTopBar.tsx", "utf8");

if (
  !appTopBar.includes("home-settings-toggle") ||
  !emergencyDrawer.includes('label="Cofre"') ||
  !emergencyDrawer.includes('label="Player"') ||
  !emergencyDrawer.includes('onNavigate("/arquivos", "cofre")') ||
  !emergencyDrawer.includes('onNavigate("/arquivos", "player")')
) {
  throw new Error("Home precisa manter engrenagem retratil com acesso separado a cofre, player, anjos e configuracoes.");
}

if (emergencyDrawer.includes("backend/P2P")) {
  throw new Error("Drawer da Home nao pode expor jargao tecnico backend/P2P para a usuaria.");
}

if (
  !emergencyCallTarget.includes("Policia") ||
  !emergencyCallTarget.includes("\"190\"") ||
  !emergencyCallTarget.includes("\"193\"") ||
  !emergencyCallTarget.includes("\"192\"")
) {
  throw new Error("Home precisa manter atalhos oficiais Policia, Bombeiros e SAMU com numeros preservados no fluxo de chamada.");
}

if (emergencyCallDock.includes("showPoliceShortcut") || emergencyCallDock.includes("target.number !== \"190\"")) {
  throw new Error("Dock de chamadas nao pode filtrar Policia 190 no padrao atual.");
}

if (!emergencyCallDock.includes("emergencyCallTargets.map")) {
  throw new Error("Dock de chamadas precisa renderizar Policia 190, Bombeiros 193 e SAMU 192 por padrao.");
}

const emergencyPreferences = await readFile("src/features/emergency/emergencyPreferences.ts", "utf8");
const protectedAccess = await readFile("src/security/protectedAccess.ts", "utf8");

if (
  !protectedAccess.includes("HASH_VERSION = \"v2\"") ||
  !protectedAccess.includes("KDF_ROUNDS") ||
  !protectedAccess.includes("MAX_FAILED_ATTEMPTS") ||
  !protectedAccess.includes("verifySecurityCodeStatus") ||
  !protectedAccess.includes("formatLockoutMessage")
) {
  throw new Error("Codigo de seguranca precisa usar hash versionado com sal, iteracoes e bloqueio comunicado.");
}
const emergencyMediaRecorder = await readFile("src/features/emergency/EmergencyMediaRecorder.tsx", "utf8");
const mediaCapture = await readFile("src/features/emergency/mediaCapture.ts", "utf8");
const packagePresentation = await readFile("src/features/emergency/packagePresentation.ts", "utf8");
const privateMediaReadiness = await readFile("scripts/android-private-media-readiness.mjs", "utf8");
const androidPrepare = await readFile("scripts/prepare-android-bundled-debug.mjs", "utf8");

if (!emergencyPreferences.includes("finishSafety") || !emergencyPreferences.includes("codeHash")) {
  throw new Error("Encerramento seguro precisa ser configuravel e usar hash local do codigo.");
}

if (!emergencyPreferences.includes("schemaVersion: 8") || !emergencyPreferences.includes("call190ShortcutEnabled: true")) {
  throw new Error("Preferencias precisam migrar para atalhos oficiais ativos por padrao.");
}

if (
  !emergencyPreferences.includes("durationOptions: EmergencyDurationSeconds[] = [0, 60, 300, 900, 1800, 3600]")
) {
  throw new Error("Tempo de gravacao precisa manter opcoes Ilimitado, 1, 5, 15, 30 e 60 minutos.");
}

if (
  !packagePresentation.includes("formatPackageDurationLabel") ||
  !packagePresentation.includes("getPackageVideoDurationMs") ||
  !packagePresentation.includes("geo:")
) {
  throw new Error("Apresentacao do pacote precisa expor duracao e links de mapa multiplataforma.");
}

if (/const DEFAULT_FINISH_CODE_HASH = "e41d64/.test(emergencyPreferences)) {
  throw new Error("Codigo universal de encerramento nao pode permanecer como padrao valido.");
}

const secureStorage = await readFile("src/security/secureStorage.ts", "utf8");

if (secureStorage.includes("sessionStorage") || !secureStorage.includes("Platform.OS !== \"web\"")) {
  throw new Error("SecureStore web precisa ser simulador volatil em memoria, sem sessionStorage/localStorage.");
}

if (!secureStorage.includes("nativeSecretKey") || !secureStorage.includes("nativeSecureStoreAllowedKey")) {
  throw new Error("SecureStore nativo precisa normalizar chaves para evitar caracteres invalidos no Android.");
}

if (!emergencyRecorder.includes("activeStartPromise") || !emergencyRecorder.includes("Ja existe chamado local ativo")) {
  throw new Error("Servico de emergencia precisa impor singleton/idempotencia para chamado ativo local.");
}

if (
  emergencyMediaRecorder.includes("!cancelled && result?.uri") ||
  !emergencyMediaRecorder.includes("preserveLocalVideoAsset")
) {
  throw new Error("Encerramento manual do SOS nao pode descartar video antes de anexar ao cofre.");
}

if (
  !mediaCapture.includes("MAX_INLINE_MEDIA_HASH_BYTES") ||
  !mediaCapture.includes("metadata_sha256_pending_streaming") ||
  !mediaCapture.includes("content_sha256") ||
  !mediaCapture.includes("Falha ao indexar video local no cofre") ||
  !mediaCapture.includes("copiedToPrivateSandbox")
) {
  throw new Error("Captura de midia precisa limitar hash inline, registrar integridade e limpar arquivo sem indice no cofre.");
}

if (
  !emergencyMediaRecorder.includes("requestedCameraMode === \"both\"") ||
  !emergencyMediaRecorder.includes("frontCameraRef") ||
  !emergencyMediaRecorder.includes("backCameraRef") ||
  !emergencyMediaRecorder.includes("Captura dupla limitada pelo aparelho")
) {
  throw new Error("Midia privada precisa configurar frontal, traseira e tentativa de duas cameras com fallback seguro.");
}

if (!mediaCapture.includes("EncodingType.Base64") || !mediaCapture.includes("deleteAsync(sourceUri")) {
  throw new Error("Midia local precisa gerar hash de conteudo e remover arquivo temporario da camera.");
}

if (
  !privateMediaReadiness.includes("CAMERA") ||
  !privateMediaReadiness.includes("RECORD_AUDIO") ||
  !androidPrepare.includes('android:allowBackup="false"')
) {
  throw new Error("Build privado de midia precisa ter gate proprio e bloquear backup Android.");
}

const emergencyOutbox = await readFile("src/features/emergency/emergencyOutbox.ts", "utf8");

if (!emergencyOutbox.includes("deleteEmergencyPackage")) {
  throw new Error("Cofre local precisa ter exclusao local funcional e controlada.");
}

if (
  !emergencyOutbox.includes("status === \"recording_local\"") ||
  !emergencyOutbox.includes("Nao foi possivel remover todos os arquivos locais")
) {
  throw new Error("Exclusao local precisa bloquear chamado ativo e manter pacote se algum asset nao for removido.");
}

if (!emergencyOutbox.includes("removed_from_device")) {
  throw new Error("Exclusao de evidencia local precisa registrar tombstone/auditoria local.");
}

console.log("Smoke test mobile aprovado.");
