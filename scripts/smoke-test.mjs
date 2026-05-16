import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "AGENTS.md",
  ".codex/AGENTS.md",
  ".codex/memory/CRISTINE.md",
  "app.config.js",
  "docs/00_PLANO_MOBILE.md",
  "docs/03_TIMELINE.md",
  "docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md",
  "docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md",
  "docs/api/openapi.yaml",
  "plugins/with-sinalseguro-media-engine.js",
  "plugins/native-media-engine/android/SinalSeguroMediaEngineModule.kt",
  "plugins/native-media-engine/android/SinalSeguroMediaEnginePackage.kt",
  "plugins/native-media-engine/ios/SinalSeguroMediaEngine.swift",
  "plugins/native-media-engine/ios/SinalSeguroMediaEngine.m",
  "app/_layout.tsx",
  "app/index.tsx",
  "app/arquivos.tsx",
  "app/configuracoes.tsx",
  "app/convite.tsx",
  "app/perfis.tsx",
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
  "src/features/invitations/trustedRelationshipStore.ts",
  "src/features/profiles/profilePolicy.ts",
  "src/features/profiles/profileStore.ts",
  "src/features/evidence/evidencePolicy.ts",
  "src/features/emergency/packagePresentation.ts",
  "src/features/emergency/mediaInterfacePresentation.ts",
  "src/features/emergency/emergencyPreferences.ts",
  "src/features/emergency/emergencyRecorder.ts",
  "src/features/emergency/RemoteSharingPlan.ts",
  "src/features/emergency/emergencyOutbox.ts",
  "src/features/emergency/emergencySyncQueue.ts",
  "src/features/emergency/EmergencyMediaRecorder.tsx",
  "src/features/emergency/mediaCapture.ts",
  "src/features/emergency/VideoCryptoService.ts",
  "src/features/emergency/CameraCaptureResidueCleaner.ts",
  "src/features/emergency/PlaintextMediaResidueCleaner.ts",
  "src/features/emergency/EncryptedVideoManifest.ts",
  "src/features/emergency/EncryptedVideoStore.ts",
  "src/features/emergency/EncryptedVideoDataSource.ts",
  "src/features/emergency/EncryptedVideoRangeHttp.ts",
  "src/features/emergency/EncryptedVideoLoopbackServer.ts",
  "src/features/emergency/EncryptedVideoPlaybackCache.ts",
  "src/features/emergency/SinalSeguroMediaEngine.ts",
  "src/features/emergency/SecureVideoThumbnailStore.ts",
  "src/services/apiClient.ts",
  "src/services/appleIdentity.ts",
  "src/services/deviceBinding.ts",
  "src/services/deviceKeyProof.ts",
  "src/services/googleOidc.ts",
  "scripts/encrypted-video-store.test.ts",
  "scripts/device-key-proof.test.ts",
  "scripts/profile-policy.test.ts",
  "src/storage/secureJsonStore.ts",
  "scripts/android-private-media-readiness.mjs"
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

if (!packageJson.dependencies["expo-keep-awake"]) {
  throw new Error("Chamado ativo precisa manter tela acordada para permitir encerramento manual.");
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

const remoteSharingPlan = await readFile("src/features/emergency/RemoteSharingPlan.ts", "utf8");

if (
  !remoteSharingPlan.includes("planned_ec2_coordination") ||
  !remoteSharingPlan.includes("key_envelope_distribution") ||
  !remoteSharingPlan.includes("p2p_signaling") ||
  !remoteSharingPlan.includes("e2ee_required_before_transport") ||
  !remoteSharingPlan.includes("share_only_while_emergency_recording_local") ||
  !remoteSharingPlan.includes("rbac_mfa_audit_retention_required")
) {
  throw new Error("Plano remoto precisa modelar EC2, chaves, P2P, E2EE, compartilhamento ativo e conveniados futuros.");
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

if (!appConfig.includes("./plugins/with-sinalseguro-media-engine")) {
  throw new Error("Motor nativo de midia precisa estar registrado como config plugin persistente.");
}

const launchScreen = await readFile("src/components/AppLaunchScreen.tsx", "utf8");

if (!launchScreen.includes("Carregando SinalSeguro") || launchScreen.includes("glow")) {
  throw new Error("Splash custom precisa ter barra de loading e nao usar efeitos glow ornamentais.");
}

const localEvidenceRail = await readFile("src/components/LocalEvidenceRail.tsx", "utf8");
const evidencePlayerCard = await readFile("src/components/EvidencePlayerCard.tsx", "utf8");
const mediaInterfacePresentation = await readFile("src/features/emergency/mediaInterfacePresentation.ts", "utf8");
const appLayout = await readFile("app/_layout.tsx", "utf8");
const homeScreen = await readFile("app/index.tsx", "utf8");
const localFilesScreen = await readFile("app/arquivos.tsx", "utf8");
const settingsScreen = await readFile("app/configuracoes.tsx", "utf8");
const contactsScreen = await readFile("app/contatos.tsx", "utf8");
const invitationScreen = await readFile("app/convite.tsx", "utf8");
const accessGate = await readFile("src/features/access/AccessGate.tsx", "utf8");
const profilesScreen = await readFile("app/perfis.tsx", "utf8");
const deviceBinding = await readFile("src/services/deviceBinding.ts", "utf8");
const deviceKeyProof = await readFile("src/services/deviceKeyProof.ts", "utf8");
const profilePolicy = await readFile("src/features/profiles/profilePolicy.ts", "utf8");
const profileSurface = `${profilesScreen}\n${profilePolicy}`;

if (
  !deviceKeyProof.includes("ed25519-v1") ||
  !deviceKeyProof.includes("buildDeviceKeyProof") ||
  !deviceKeyProof.includes("verifyDeviceKeyProof") ||
  !deviceBinding.includes("legacyPublicKeySha256") ||
  !deviceBinding.includes("replacesPublicKeySha256")
) {
  throw new Error("Vinculo de dispositivo precisa usar Ed25519, prova de posse e migracao do hash legado.");
}

if (!localEvidenceRail.includes("onDeletePackage") || !localEvidenceRail.includes("Compartilhar")) {
  throw new Error("Cofre local precisa expor acoes de visualizar, compartilhar pelo app e excluir local.");
}

if (
  !homeScreen.includes("recoverInterruptedActiveRecordingOnLaunch") ||
  !homeScreen.includes("recoverInterruptedCameraResidue") ||
  !homeScreen.includes("findRecoverableCameraVideos") ||
  !homeScreen.includes("emergency_interrupted_media_recovery_success") ||
  !homeScreen.includes("interrupted_on_launch") ||
  !homeScreen.includes("emergency_interrupted_active_recovered") ||
  !homeScreen.includes("sem reativar camera ou microfone")
) {
  throw new Error("Tela SOS precisa recuperar chamado interrompido no startup sem remontar camera automaticamente.");
}

const interruptedRecoveryIndex = homeScreen.indexOf("await recoverInterruptedCameraResidue(");
const interruptedFinishIndex = homeScreen.indexOf("await finishEmergencyPackage(interruptedPackage.id, \"interrupted_on_launch\")");
if (interruptedRecoveryIndex < 0 || interruptedFinishIndex < 0 || interruptedRecoveryIndex > interruptedFinishIndex) {
  throw new Error("Tela SOS precisa recuperar residuos de Camera antes de finalizar pacote interrompido.");
}

const startupRecoveryCallIndex = homeScreen.indexOf("await recoverInterruptedActiveRecordingOnLaunch(nextPreferences)");
const startupNativeCleanupIndex = homeScreen.indexOf("await cleanupNativeMediaResidues()");
if (startupRecoveryCallIndex < 0 || startupNativeCleanupIndex < 0 || startupRecoveryCallIndex > startupNativeCleanupIndex) {
  throw new Error("Tela SOS precisa tentar recuperacao interrompida antes da limpeza nativa de residuos.");
}

if (!homeScreen.includes("cleanupResidueSourceOnly: true")) {
  throw new Error("Recuperacao interrompida precisa apagar somente o video temporario ja preservado.");
}

if (appLayout.includes("CameraCaptureResidueCleaner") || appLayout.includes("cleanupAfterSuccessfulPreservation")) {
  throw new Error("Root layout nao pode limpar residuos de camera antes da Home tentar recuperar chamado interrompido.");
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

if (
  !localEvidenceRail.includes("getPackageMediaProtectionLabel") ||
  !localEvidenceRail.includes("mediaBadgeProtected") ||
  !localEvidenceRail.includes("FileLock2")
) {
  throw new Error("Grade do cofre precisa identificar arquivos de midia protegidos sem jargao tecnico.");
}

if (
  !evidencePlayerCard.includes("isEncryptedVideoAsset") ||
  !evidencePlayerCard.includes("Arquivo protegido") ||
  !evidencePlayerCard.includes("EncryptedVideoLoopbackServer") ||
  !evidencePlayerCard.includes("openNativeEncryptedAsset") ||
  !evidencePlayerCard.includes("nativePlaybackHandleRef") ||
  !evidencePlayerCard.includes("loopbackSessionRef") ||
  !evidencePlayerCard.includes("replaceAsync") ||
  !evidencePlayerCard.includes("getAssetStorageLabel") ||
  !evidencePlayerCard.includes("preparingPlayback")
) {
  throw new Error("Player precisa tratar video protegido, legado e ausencia de midia com estados distintos.");
}

if (
  !mediaInterfacePresentation.includes("Player seguro pendente") ||
  !mediaInterfacePresentation.includes("Player seguro nativo") ||
  !mediaInterfacePresentation.includes("Arquivo protegido") ||
  !mediaInterfacePresentation.includes("isUnifiedNativePackageVideo") ||
  !mediaInterfacePresentation.includes("getPackageMediaProtectionLabel")
) {
  throw new Error("Apresentacao de midia precisa centralizar rotulos de protecao, armazenamento e playback.");
}

if (
  !localFilesScreen.includes("Excluir arquivo local?") ||
  !localFilesScreen.includes("Finalize o chamado antes") ||
  !localFilesScreen.includes("topBarContextLabel")
) {
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

if (
  !profilePolicy.includes("minor_cannot_invite") ||
  !profilePolicy.includes("minor_cannot_act_as_angel") ||
  !profilePolicy.includes("responsible_minor_allowed") ||
  !profilePolicy.includes("canReceiveFutureEmergencyDelivery") ||
  !profilePolicy.includes("authorizationStatus === \"authorized\"") ||
  !profilePolicy.includes("contactStatus === \"accepted\"")
) {
  throw new Error("Politica de perfis precisa bloquear menor como anjo/convite e exigir autorizacao vigente.");
}

if (
  !contactsScreen.includes("canCreateTrustedContactInvitation") ||
  !contactsScreen.includes("getActiveProtectionProfile") ||
  !contactsScreen.includes("profile_block") ||
  !contactsScreen.includes("router.push(\"/perfis\")")
) {
  throw new Error("Tela de anjos precisa passar pelo gate de perfil antes de criar convite.");
}

if (
  !invitationScreen.includes("canAcceptAngelInvitation") ||
  !invitationScreen.includes("getActiveProtectionProfile") ||
  !invitationScreen.includes("validateBackendInvitationToken") ||
  !invitationScreen.includes("Configurar perfil")
) {
  throw new Error("Aceite de convite precisa bloquear menor e perfil ausente antes de atuar como anjo.");
}

if (
  !profileSurface.includes("Sou adulto usando para mim") ||
  (!profileSurface.includes("Sou responsavel por menor") && !profileSurface.includes("Sou responsável por menor")) ||
  !profileSurface.includes("Sou menor protegido") ||
  profilesScreen.includes("Data de nascimento")
) {
  throw new Error("Tela de perfis precisa configurar papeis minimos sem coletar dado sensivel de idade.");
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

if (homeScreen.includes("<SafeScreen") || homeScreen.includes("Rede de apoio discreta")) {
  throw new Error("Home de emergencia nao pode usar tela rolavel nem manter titulo/subtitulo duplicados.");
}

if (homeScreen.includes("Alert.alert") || localFilesScreen.includes("Alert.alert")) {
  throw new Error("Fluxos criticos da Home e Cofre devem usar modal SinalSeguro, nao Alert nativo.");
}

if (homeScreen.includes("showPoliceShortcut={preferences.emergencyPhoneCall.call190ShortcutEnabled}")) {
  throw new Error("Home nao pode ocultar Policia 190; Policia, Bombeiros e SAMU devem vir ativos por padrao.");
}

if (
  !homeScreen.includes("useKeepAwake") ||
  !homeScreen.includes("EmergencyRecordingWakeLock") ||
  !homeScreen.includes("activePackageId || finishInProgress")
) {
  throw new Error("Home precisa manter tela acordada enquanto chamado ativo ou encerramento estiver em progresso.");
}

if (
  !homeScreen.includes("waitForMediaRecorderStop") ||
  !homeScreen.includes("mediaStopWaitTimeoutMs") ||
  !homeScreen.includes("finishInProgressRef") ||
  !homeScreen.includes("emergency_media_stop_timeout") ||
  homeScreen.indexOf("await waitForMediaRecorderStop(stopSerial)") > homeScreen.indexOf("finishEmergencyPackage(packageId")
) {
  throw new Error("Home iOS precisa aguardar stop da camera, bloquear duplo encerramento e finalizar pacote sem perder midia.");
}

if (
  !homeScreen.includes("startInProgress") ||
  !homeScreen.includes("if (startInProgress) return") ||
  !homeScreen.includes("setStartInProgress(true)") ||
  !homeScreen.includes("setStartInProgress(false)")
) {
  throw new Error("Home precisa bloquear duplo acionamento enquanto o pacote SOS ainda esta sendo criado.");
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
  !packagePresentation.includes("durationsByCamera") ||
  !packagePresentation.includes("geo:")
) {
  throw new Error("Apresentacao do pacote precisa expor duracao e links de mapa multiplataforma.");
}

if (/const DEFAULT_FINISH_CODE_HASH = "e41d64/.test(emergencyPreferences)) {
  throw new Error("Codigo universal de encerramento nao pode permanecer como padrao valido.");
}

const secureStorage = await readFile("src/security/secureStorage.ts", "utf8");
const apiClient = await readFile("src/services/apiClient.ts", "utf8");
const invitationService = await readFile("src/features/invitations/invitationService.ts", "utf8");
const trustedRelationshipStore = await readFile("src/features/invitations/trustedRelationshipStore.ts", "utf8");
const emergencySyncQueue = await readFile("src/features/emergency/emergencySyncQueue.ts", "utf8");

if (secureStorage.includes("sessionStorage") || !secureStorage.includes("Platform.OS !== \"web\"")) {
  throw new Error("SecureStore web precisa ser simulador volatil em memoria, sem sessionStorage/localStorage.");
}

if (!secureStorage.includes("nativeSecretKey") || !secureStorage.includes("nativeSecureStoreAllowedKey")) {
  throw new Error("SecureStore nativo precisa normalizar chaves para evitar caracteres invalidos no Android.");
}

if (
  !apiClient.includes("loginWithGoogleIdToken") ||
  !apiClient.includes("loginWithAppleIdentityToken") ||
  !apiClient.includes("createConsentRecord") ||
  !apiClient.includes("createTrustedContact") ||
  !apiClient.includes("getInvitationStatus") ||
  !apiClient.includes("acceptInvitation") ||
  !apiClient.includes("\"login\"") ||
  !apiClient.includes("Sem conexao com a internet")
) {
  throw new Error("Cliente API POO precisa cobrir Google real, consentimentos, anjos e aceite de convite.");
}

if (
  !accessGate.includes("validationError instanceof ApiRequestError && validationError.status === 401") ||
  !accessGate.includes("Sessao local preservada") ||
  !accessGate.includes("Depois do primeiro login")
) {
  throw new Error("Gate de acesso precisa preservar sessao local valida quando a internet falhar.");
}

if (
  !contactsScreen.includes("Promise.allSettled") ||
  !contactsScreen.includes("listCachedTrustedContactRelationships") ||
  !contactsScreen.includes("cacheTrustedContactRelationships") ||
  !invitationScreen.includes("cacheTrustedContactRelationship")
) {
  throw new Error("Vinculos de anjos precisam usar cache local e nao depender de uma unica chamada remota.");
}

if (
  !trustedRelationshipStore.includes("sinalseguro.trusted-contact-relationships.v1") ||
  !trustedRelationshipStore.includes("listAcceptedOwnerRelationshipsForDelivery") ||
  !trustedRelationshipStore.includes("refreshTrustedContactRelationshipsFromApi")
) {
  throw new Error("Relacionamentos aceitos precisam ficar disponiveis localmente para UI e SOS offline.");
}

if (
  !homeScreen.includes("listAcceptedOwnerRelationshipsForDelivery") ||
  !homeScreen.includes("queueEmergencyPackageForRemoteSync") ||
  !homeScreen.includes("syncPendingEmergencyPackagesWithApi") ||
  !emergencySyncQueue.includes("sent_to_ec2") ||
  !emergencySyncQueue.includes("blocked_login")
) {
  throw new Error("SOS offline precisa enfileirar sincronizacao remota e carregar anjos aceitos no pacote local.");
}

if (
  !deviceBinding.includes("class DeviceBindingService") ||
  !deviceBinding.includes("DEVICE_PRIVATE_SECRET_KEY") ||
  !deviceBinding.includes("createPrivateRecord") ||
  !deviceBinding.includes("publicKeySha256") ||
  !deviceBinding.includes("completeAuthenticatedBootstrap") ||
  !deviceBinding.includes("privateSeedHex")
) {
  throw new Error("Bootstrap autenticado precisa registrar dispositivo sem exportar chave privada local.");
}

if (
  !settingsScreen.includes("completeDeviceBootstrap") ||
  !settingsScreen.includes("Dispositivo autenticado registrado") ||
  !settingsScreen.includes("clearRegisteredDeviceSession")
) {
  throw new Error("Login precisa registrar dispositivo, sincronizar consentimentos e limpar vinculo remoto no logout.");
}

if (
  !invitationService.includes("createBackendInvitation") ||
  !invitationService.includes("backend_single_use_enforced") ||
  !invitationService.includes("acceptBackendInvitation") ||
  !invitationService.includes("validateBackendInvitationToken") ||
  invitationService.includes("createLocalPreInvitation") ||
  !invitationService.includes("registerAuthenticatedDevice")
) {
  throw new Error("Convites de anjo precisam ser API-backed, validar status no servidor e exigir dispositivo registrado no aceite.");
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
  !mediaCapture.includes("EncryptedVideoStore") ||
  !mediaCapture.includes("preserveEncryptedVideoAsset") ||
  !mediaCapture.includes("encryptedStore.deleteEncryptedAsset") ||
  !mediaCapture.includes("Falha ao indexar video local no cofre") ||
  mediaCapture.includes("MAX_INLINE_MEDIA_HASH_BYTES") ||
  mediaCapture.includes("metadata_sha256_pending_streaming")
) {
  throw new Error("Captura de midia precisa preservar video em chunks criptografados e limpar arquivos sem indice no cofre.");
}

if (
  !emergencyMediaRecorder.includes("requestedCameraMode === \"both\"") ||
  !emergencyMediaRecorder.includes("frontCameraRef") ||
  !emergencyMediaRecorder.includes("backCameraRef") ||
  !emergencyMediaRecorder.includes("Captura dupla limitada pelo aparelho")
) {
  throw new Error("Midia privada precisa configurar frontal, traseira e tentativa de duas cameras com fallback seguro.");
}

const recorderStartEffectDependencyList =
  emergencyMediaRecorder.match(/void startRecording\(\);[\s\S]*?\}, \[([\s\S]*?)\]\);/)?.[1] ?? "";

if (
  !emergencyMediaRecorder.includes("onMediaAttachedRef") ||
  !emergencyMediaRecorder.includes("onStatusChangeRef") ||
  !emergencyMediaRecorder.includes("stopRequestSerial") ||
  !emergencyMediaRecorder.includes("stopActiveRecording") ||
  !emergencyMediaRecorder.includes("iosRecordStartWarmupMs") ||
  !emergencyMediaRecorder.includes("capture_record_async_retry") ||
  !emergencyMediaRecorder.includes("shouldRetryIosRecordAsync") ||
  !emergencyMediaRecorder.includes('if (Platform.OS === "android") return undefined') ||
  !emergencyMediaRecorder.includes("ERROR_DURATION_LIMIT_REACHED") ||
  !emergencyMediaRecorder.includes("continuous_until_stop") ||
  !emergencyMediaRecorder.includes("capture_segment_cycle_continue") ||
  !emergencyMediaRecorder.includes('const iosRecordingVideoCodec: VideoCodec = "avc1"') ||
  !emergencyMediaRecorder.includes('const recordingVideoQuality: VideoQuality = "480p"') ||
  !emergencyMediaRecorder.includes("const mobileSegmentDurationSeconds = 12") ||
  !emergencyMediaRecorder.includes("const recordingVideoBitrate = 650_000") ||
  !emergencyMediaRecorder.includes("shouldContinueSegmentedRecording") ||
  !emergencyMediaRecorder.includes("iosEncryptedChunkSizeBytes") ||
  !emergencyMediaRecorder.includes('verificationMode: Platform.OS === "ios" ? "bounded" : "full"') ||
  !emergencyMediaRecorder.includes("videoQuality={recordingVideoQuality}") ||
  !emergencyMediaRecorder.includes("videoBitrate={recordingVideoBitrate}") ||
  recorderStartEffectDependencyList.includes("onMediaAttached") ||
  recorderStartEffectDependencyList.includes("onStatusChange")
) {
  throw new Error("Gravador precisa parar por sinal explicito, nao reiniciar por callback, e limitar peso da midia local.");
}

const videoCryptoService = await readFile("src/features/emergency/VideoCryptoService.ts", "utf8");
const cameraCaptureResidueCleaner = await readFile("src/features/emergency/CameraCaptureResidueCleaner.ts", "utf8");
const plaintextMediaResidueCleaner = await readFile("src/features/emergency/PlaintextMediaResidueCleaner.ts", "utf8");
const encryptedVideoStore = await readFile("src/features/emergency/EncryptedVideoStore.ts", "utf8");
const encryptedVideoDataSource = await readFile("src/features/emergency/EncryptedVideoDataSource.ts", "utf8");
const encryptedVideoLoopbackServer = await readFile("src/features/emergency/EncryptedVideoLoopbackServer.ts", "utf8");
const encryptedVideoPlaybackCache = await readFile("src/features/emergency/EncryptedVideoPlaybackCache.ts", "utf8");
const sinalSeguroMediaEngine = await readFile("src/features/emergency/SinalSeguroMediaEngine.ts", "utf8");
const mediaEnginePlugin = await readFile("plugins/with-sinalseguro-media-engine.js", "utf8");
const androidMediaEngine = await readFile("plugins/native-media-engine/android/SinalSeguroMediaEngineModule.kt", "utf8");
const iosMediaEngine = await readFile("plugins/native-media-engine/ios/SinalSeguroMediaEngine.swift", "utf8");
const secureVideoThumbnailStore = await readFile("src/features/emergency/SecureVideoThumbnailStore.ts", "utf8");
const encryptedVideoTests = await readFile("scripts/encrypted-video-store.test.ts", "utf8");
const secureJsonStore = await readFile("src/storage/secureJsonStore.ts", "utf8");

if (
  !videoCryptoService.includes("xchacha20poly1305") ||
  !videoCryptoService.includes("encryptedVideoKeyBytes = 32") ||
  !videoCryptoService.includes("encryptedVideoNonceBytes = 24") ||
  !videoCryptoService.includes("Falha de autenticacao do chunk criptografado")
) {
  throw new Error("Criptografia de video precisa usar chave simetrica forte, nonce unico e AEAD autenticado por chunk.");
}

if (
  !mediaEnginePlugin.includes("syncSinalSeguroMediaEngine") ||
  !mediaEnginePlugin.includes("withDangerousMod") ||
  !mediaEnginePlugin.includes("SinalSeguroMediaEnginePackage") ||
  !mediaEnginePlugin.includes("SinalSeguroNativeMediaResidueCleaner") ||
  !mediaEnginePlugin.includes("ios_startup_playback_residue_cleanup") ||
  !mediaEnginePlugin.includes("project.pbxproj")
) {
  throw new Error("Config plugin do motor nativo precisa sincronizar Android/iOS e poder ser chamado pelos scripts locais.");
}

if (mediaEnginePlugin.includes("cleanupPlaintextCameraResidues") || mediaEnginePlugin.includes('appendingPathComponent("Camera"')) {
  throw new Error("Config plugin iOS nao pode gerar limpeza nativa de Camera antes da recuperacao JS.");
}

if (
  !encryptedVideoStore.includes("EncodingType.Base64") ||
  !encryptedVideoStore.includes("position") ||
  !encryptedVideoStore.includes("length") ||
  !encryptedVideoStore.includes("manifestNonce") ||
  !encryptedVideoStore.includes("manifestTag") ||
  !encryptedVideoStore.includes("chunked_plaintext_sha256") ||
  !encryptedVideoStore.includes("recipientKeyEnvelopes") ||
  !encryptedVideoStore.includes('storageEngine: "js_chunked_v1"') ||
  !encryptedVideoStore.includes("keyId: keyRef") ||
  !encryptedVideoStore.includes('envelopeScope: "media_asset"') ||
  !encryptedVideoStore.includes("verifyPreservedEncryptedVideo") ||
  !encryptedVideoStore.includes("deletePlaintextAfterVerifiedPreservation") ||
  !encryptedVideoStore.includes("plaintextCleanup") ||
  !encryptedVideoStore.includes("cleanup_pending")
) {
  throw new Error("Store criptografado precisa ler por faixa, cifrar manifesto/chunks, verificar integridade e limpar plaintext so apos preservacao segura.");
}

if (
  !sinalSeguroMediaEngine.includes("encryptSegmentWithNativeMediaEngine") ||
  !sinalSeguroMediaEngine.includes("openNativeEncryptedAsset") ||
  !sinalSeguroMediaEngine.includes("openNativeEncryptedAssets") ||
  !sinalSeguroMediaEngine.includes("cleanupNativeMediaResidues") ||
  !sinalSeguroMediaEngine.includes("keyBase64") ||
  !sinalSeguroMediaEngine.includes("ciphertextSha256") ||
  !sinalSeguroMediaEngine.includes("native_segmented_v1") ||
  !sinalSeguroMediaEngine.includes("native_encrypted_source") ||
  !sinalSeguroMediaEngine.includes("inputPackageIds") ||
  !sinalSeguroMediaEngine.includes("resolveNativeSegmentSourceUri") ||
  !sinalSeguroMediaEngine.includes("native_playback_source_uri_rebased")
) {
  throw new Error("Ponte JS do motor nativo precisa expor cifragem, playback e limpeza com fallback seguro.");
}

if (
  !androidMediaEngine.includes("AES/GCM/NoPadding") ||
  !androidMediaEngine.includes("CipherOutputStream") ||
  !androidMediaEngine.includes("decryptAesGcmFile") ||
  !androidMediaEngine.includes("cipher.update(buffer, 0, read)") ||
  androidMediaEngine.includes("CipherInputStream") ||
  !androidMediaEngine.includes("sha256HexFile") ||
  !androidMediaEngine.includes("privateFileFromUri") ||
  !androidMediaEngine.includes("file_outside_app_private_storage") ||
  !androidMediaEngine.includes("cleanupMediaResidues") ||
  !androidMediaEngine.includes("openEncryptedAsset") ||
  !androidMediaEngine.includes("openEncryptedAssets") ||
  !androidMediaEngine.includes("MediaMuxer") ||
  !androidMediaEngine.includes("writeTrackSamples") ||
  !androidMediaEngine.includes("SinalSeguroNativeMediaResidueCleaner") ||
  !androidMediaEngine.includes("validateMuxSegmentCompatibility") ||
  androidMediaEngine.includes("externalCacheDir") ||
  androidMediaEngine.includes("getExternalFilesDir") ||
  androidMediaEngine.includes("val plaintext = sourceFile.readBytes()")
) {
  throw new Error("Motor nativo Android precisa cifrar em blocos, restringir storage privado e abrir handles saneados/unificados.");
}

if (
  !iosMediaEngine.includes("AES.GCM.seal") ||
  !iosMediaEngine.includes("AES.GCM.open") ||
  !iosMediaEngine.includes("protectMediaFile") ||
  !iosMediaEngine.includes("isExcludedFromBackup") ||
  !iosMediaEngine.includes("privateFileURL") ||
  !iosMediaEngine.includes("file_outside_app_private_storage") ||
  !iosMediaEngine.includes("cleanupMediaResidues") ||
  !iosMediaEngine.includes("openEncryptedAsset") ||
  !iosMediaEngine.includes("openEncryptedAssets") ||
  !iosMediaEngine.includes("AVMutableComposition") ||
  !iosMediaEngine.includes("shortPlaybackFileStem") ||
  !iosMediaEngine.includes("makeMergedPlaybackExportSession") ||
  !iosMediaEngine.includes("AVAssetExportPresetMediumQuality") ||
  !iosMediaEngine.includes("normalizedRenderGeometry") ||
  !iosMediaEngine.includes("stagingURL")
) {
  throw new Error("Motor nativo iOS precisa cifrar segmento, restringir storage privado e abrir handles saneados/unificados sem nomes longos ou export passthrough fragil.");
}

if (iosMediaEngine.includes("cleanupPlaintextCameraResidues") || androidMediaEngine.includes("cleanupPlaintextCameraResidues")) {
  throw new Error("Cleanup nativo generico nao pode apagar residuos de Camera; recuperacao de chamados interrompidos decide isso antes.");
}

if (
  !cameraCaptureResidueCleaner.includes("CameraCaptureResidueCleaner") ||
  !cameraCaptureResidueCleaner.includes("findRecoverableCameraVideos") ||
  !cameraCaptureResidueCleaner.includes("isSafeCameraEntryName") ||
  !cameraCaptureResidueCleaner.includes("maxTotalSizeBytes") ||
  !cameraCaptureResidueCleaner.includes("sourceOnly") ||
  !cameraCaptureResidueCleaner.includes("cacheDirectory") ||
  !cameraCaptureResidueCleaner.includes('cameraCacheDirectoryName = "Camera"') ||
  !cameraCaptureResidueCleaner.includes(".mp4") ||
  cameraCaptureResidueCleaner.includes("sinalseguro-media-encrypted")
) {
  throw new Error("Limpeza de residuos precisa ficar restrita a MP4 temporario do cache da camera.");
}

if (
  !plaintextMediaResidueCleaner.includes("PlaintextMediaResidueCleaner") ||
  !plaintextMediaResidueCleaner.includes("legacyPlaintextMediaDirectory") ||
  !plaintextMediaResidueCleaner.includes("runPlaintextMediaStorageMaintenance") ||
  !plaintextMediaResidueCleaner.includes("replaceLocalMediaAsset") ||
  !plaintextMediaResidueCleaner.includes("cleanupPlaintextSource: false") ||
  !plaintextMediaResidueCleaner.includes("blockedReferencedCount")
) {
  throw new Error("Residuos de MP4 claro legado precisam ser migrados quando referenciados e limpos quando nao referenciados.");
}

if (
  !secureJsonStore.includes("xchacha20poly1305") ||
  !secureJsonStore.includes("encryptedItemKey") ||
  !secureJsonStore.includes("getOrCreateNamespaceKey") ||
  !secureJsonStore.includes("readRecord") ||
  secureJsonStore.includes("await saveSecret(itemKey(namespace")
) {
  throw new Error("Registros JSON grandes do cofre precisam sair do payload direto do SecureStore e ficar cifrados no AsyncStorage.");
}

if (
  !secureVideoThumbnailStore.includes("SecureVideoThumbnailStore") ||
  !secureVideoThumbnailStore.includes("expo-video-thumbnails") ||
  !secureVideoThumbnailStore.includes("thumbnail.sseg") ||
  !secureVideoThumbnailStore.includes("encryptedVideoThumbnailAad") ||
  !secureVideoThumbnailStore.includes("finally") ||
  !secureVideoThumbnailStore.includes("delete(plaintextThumbnailUri")
) {
  throw new Error("Thumbnail segura precisa cifrar o derivado e apagar a imagem clara temporaria.");
}

if (
  !encryptedVideoDataSource.includes("readRange") ||
  !encryptedVideoDataSource.includes("streamRange") ||
  !encryptedVideoDataSource.includes("readChunk") ||
  !encryptedVideoDataSource.includes("Chunk de video corrompido") ||
  !encryptedVideoDataSource.includes("integridade")
) {
  throw new Error("Fonte de video criptografado precisa suportar range/seek e erros de autenticacao.");
}

if (
  !encryptedVideoLoopbackServer.includes("127.0.0.1") ||
  !encryptedVideoLoopbackServer.includes("parseSingleRange") ||
  !encryptedVideoLoopbackServer.includes("streamRange") ||
  !encryptedVideoLoopbackServer.includes("GET") ||
  !encryptedVideoLoopbackServer.includes("HEAD")
) {
  throw new Error("Player criptografado precisa usar loopback local com Range e descriptografia sob demanda.");
}

if (
  !evidencePlayerCard.includes("preparePlayableUri(") ||
  !evidencePlayerCard.includes("temporary_playback_cache") ||
  !evidencePlayerCard.includes("player_loopback_skipped") ||
  !evidencePlayerCard.includes("native_engine_playback_prepare") ||
  !evidencePlayerCard.includes("canUseUnifiedPackagePlayback") ||
  !evidencePlayerCard.includes("openNativeEncryptedAssets") ||
  !evidencePlayerCard.includes("isNativeEncryptedPlaybackAsset") ||
  !evidencePlayerCard.includes("playback_prepare_error") ||
  !evidencePlayerCard.includes("persistPlaybackDiagnosticsForAssets") ||
  !evidencePlayerCard.includes("getTemporaryPlaybackTtlMs") ||
  !evidencePlayerCard.includes("1 video protegido") ||
  !evidencePlayerCard.includes("Arquivo protegido unificado")
) {
  throw new Error("EvidencePlayerCard precisa preparar fonte tocavel unificada com progresso antes do play e manter loopback so como fallback.");
}

if (
  evidencePlayerCard.includes("iosUnifiedPackagePlaybackMaxSegments") ||
  evidencePlayerCard.includes("canUseUnifiedNativePackagePlayback")
) {
  throw new Error("Player seguro nao pode voltar a expor segmentos nativos por limite artificial no iOS.");
}

if (
  !encryptedVideoPlaybackCache.includes("preparePlayableUri") ||
  !encryptedVideoPlaybackCache.includes("writeBytes") ||
  !encryptedVideoPlaybackCache.includes("deletePlayableUri") ||
  !encryptedVideoPlaybackCache.includes("sinalseguro-player-cache")
) {
  throw new Error("Player precisa preparar cache temporario a partir dos chunks criptografados e limpar o arquivo de reproducao.");
}

if (
  !encryptedVideoTests.includes("readRange") ||
  !encryptedVideoTests.includes("streamRange") ||
  !encryptedVideoTests.includes("wrongKey") ||
  !encryptedVideoTests.includes("corruptedChunk") ||
  !encryptedVideoTests.includes("replayRange") ||
  !encryptedVideoTests.includes("SecureVideoThumbnailStore") ||
  !encryptedVideoTests.includes("CameraCaptureResidueCleaner")
) {
  throw new Error("Testes de midia criptografada precisam cobrir chunks, seek, replay, thumbnail, limpeza e falha de autenticacao.");
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
