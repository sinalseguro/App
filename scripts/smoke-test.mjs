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
  "app/alerta.tsx",
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
  "src/features/emergency-home/emergencyCallHeroPolicy.ts",
  "src/features/emergency-home/EmergencySettingsDrawer.tsx",
  "src/features/emergency-home/EmergencyTopBar.tsx",
  "src/features/emergency-home/emergencyCallConfirmationPolicy.ts",
  "src/features/emergency-home/emergencyHomeActivityPolicy.ts",
  "src/features/emergency-home/emergencyStartFailureDialogPolicy.ts",
  "src/features/emergency-home/emergencyStartFailureActionsPolicy.ts",
  "src/features/emergency-home/emergencyStartRuntimePolicy.ts",
  "src/features/emergency-home/finishFlowProgressPolicy.ts",
  "src/features/emergency-home/finishProgressDialogPolicy.ts",
  "src/features/emergency-home/finishProgressStatePolicy.ts",
  "src/features/emergency-home/homeNavigationPolicy.ts",
  "src/features/emergency-home/emergencyStartPolicy.ts",
  "src/features/emergency-home/finishCodePolicy.ts",
  "src/features/emergency-home/finishCodeConfirmationActionsPolicy.ts",
  "src/features/emergency-home/finishConfirmationDialogPolicy.ts",
  "src/features/emergency-home/finishConfirmationFormPolicy.ts",
  "src/features/emergency-home/finishOutcomePolicy.ts",
  "src/features/emergency-home/finishRequestPolicy.ts",
  "src/features/emergency-home/mediaHandoffPolicy.ts",
  "src/features/emergency-home/mediaHandoffReleaseActionsPolicy.ts",
  "src/features/emergency-home/mediaHandoffStartActionsPolicy.ts",
  "src/features/emergency-home/mediaProcessingStatusPolicy.ts",
  "src/features/emergency-home/mediaReleaseWaiterPolicy.ts",
  "src/features/emergency-home/mediaReleaseWaiterCompletionPolicy.ts",
  "src/features/emergency-home/mediaReleaseTimeoutActionsPolicy.ts",
  "src/features/emergency-home/mediaStopPendingPolicy.ts",
  "src/features/emergency-home/mediaStopSignalPolicy.ts",
  "src/features/emergency-home/mediaStopSettlementRequestPolicy.ts",
  "src/features/emergency-home/mediaStopSettledActionsPolicy.ts",
  "src/features/emergency-home/mediaStopPendingRequestCompletionPolicy.ts",
  "src/features/emergency-home/mediaStopWaiterPolicy.ts",
  "src/features/emergency-home/finishActiveCallStartPolicy.ts",
  "src/features/emergency-home/finishActiveCallRuntimeStartPolicy.ts",
  "src/features/emergency-home/finishActiveCallRuntimeStateActionsPolicy.ts",
  "src/features/emergency-home/finishActiveCallCleanupPolicy.ts",
  "src/features/emergency-home/emergencyStartCreatedActionsPolicy.ts",
  "src/features/emergency-home/emergencyStartRemoteSyncActionsPolicy.ts",
  "src/features/emergency-home/finishMediaStopStartPolicy.ts",
  "src/features/emergency-home/finishMediaStopRequestActionsPolicy.ts",
  "src/features/emergency-home/finishMediaStopResultPolicy.ts",
  "src/features/emergency-home/finishRemoteSyncPolicy.ts",
  "src/features/emergency-home/finishRemoteSyncRequestActionsPolicy.ts",
  "src/features/emergency-home/finishRemoteSyncDirectActionsPolicy.ts",
  "src/features/emergency-home/finishRemoteSyncCompletionActionsPolicy.ts",
  "src/features/emergency-home/finishPackageResultPolicy.ts",
  "src/features/emergency-home/finishOutcomeInputPolicy.ts",
  "src/features/emergency-home/finishPackageOutcomeActionsPolicy.ts",
  "src/features/emergency-home/finishOwnerLiveEvidencePolicy.ts",
  "src/features/emergency-home/finishOwnerLiveAuditPolicy.ts",
  "src/features/emergency-home/finishOwnerCompletionPolicy.ts",
  "src/features/emergency-home/finishPostOutcomeActionsPolicy.ts",
  "src/features/emergency-home/finishNoMediaDiagnosticPolicy.ts",
  "src/features/emergency-home/finishCompletionActionsPolicy.ts",
  "src/features/emergency-home/finishMissingPackagePolicy.ts",
  "src/features/emergency-home/finishMissingPackageBranchActionsPolicy.ts",
  "src/features/emergency-home/finishFailureActionsPolicy.ts",
  "src/features/emergency-home/finishFailureCleanupActionsPolicy.ts",
  "src/features/emergency-home/activeRemoteSyncAttemptActionsPolicy.ts",
  "src/features/emergency-home/activeRemoteSyncCompletionActionsPolicy.ts",
  "src/features/emergency-home/ownerAutoCallAttemptActionsPolicy.ts",
  "src/features/emergency-home/ownerAutoCallPolicy.ts",
  "src/features/emergency-home/ownerAutoCallResultActionsPolicy.ts",
  "src/features/emergency-home/ownerLiveAuditMarkerActionsPolicy.ts",
  "src/features/emergency-home/ownerLiveAuditMarkerPolicy.ts",
  "src/features/emergency-home/ownerLiveCallLifecycleActionsPolicy.ts",
  "src/features/emergency-home/ownerLiveEvidenceUpdatePolicy.ts",
  "src/features/emergency-home/ownerLiveEvidencePolicy.ts",
  "src/features/emergency-home/ownerLiveVideoPreserveOutcomePolicy.ts",
  "src/features/emergency-home/ownerLiveVideoPreserveRequestPolicy.ts",
  "src/features/emergency-home/ownerLiveVideoStartOutcomePolicy.ts",
  "src/features/emergency-home/ownerLiveVideoStartRequestPolicy.ts",
  "src/features/emergency-home/liveCallCleanupActionsPolicy.ts",
  "src/features/emergency-home/liveCallCleanupPolicy.ts",
  "src/features/emergency-home/liveCallPanelPolicy.ts",
  "src/features/emergency-home/localSosPackageStatusPolicy.ts",
  "src/features/emergency-home/interruptedRecoveryProgressPolicy.ts",
  "src/features/emergency-home/liveCallWaitingDialogPolicy.ts",
  "src/features/emergency-home/panicTriggerPolicy.ts",
  "src/features/emergency-home/recordingConsentDialogPolicy.ts",
  "src/features/emergency-home/protectedRouteAccessPolicy.ts",
  "src/features/emergency-home/protectedRouteCodePolicy.ts",
  "src/features/emergency-home/protectedRouteUnlockActionsPolicy.ts",
  "src/features/emergency-home/protectedRouteDialogPolicy.ts",
  "src/features/emergency-home/protectedRouteFormPolicy.ts",
  "src/features/emergency-home/remoteSyncStatusPolicy.ts",
  "src/features/invitations/invitationService.ts",
  "src/features/invitations/trustedRelationshipStore.ts",
  "src/features/profiles/profilePolicy.ts",
  "src/features/profiles/profileStore.ts",
  "src/features/settings/settingsPresentationPolicy.ts",
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
  "src/features/live-call/incomingEmergencyNotification.ts",
  "src/features/live-call/liveCallHistory.ts",
  "src/features/live-call/liveCallHistoryPolicy.ts",
  "src/features/live-call/receivedAlertPresentationPolicy.ts",
  "src/features/live-call/receivedAlertRuntimePolicy.ts",
  "src/features/live-call/liveCallRolePolicy.ts",
  "src/features/live-call/liveCallStatePolicy.ts",
  "src/features/live-call/liveWebRtcPolicy.ts",
  "src/services/apiClient.ts",
  "src/services/appleIdentity.ts",
  "src/services/deviceBinding.ts",
  "src/services/deviceKeyProof.ts",
  "src/services/googleOidc.ts",
  "scripts/encrypted-video-store.test.ts",
  "scripts/device-key-proof.test.ts",
  "scripts/profile-policy.test.ts",
  "scripts/panic-trigger-policy.test.ts",
  "scripts/emergency-home-activity-policy.test.ts",
  "scripts/emergency-call-hero-policy.test.ts",
  "scripts/emergency-start-policy.test.ts",
  "scripts/emergency-start-runtime-policy.test.ts",
  "scripts/emergency-start-created-actions-policy.test.ts",
  "scripts/emergency-start-remote-sync-actions-policy.test.ts",
  "scripts/emergency-start-failure-actions-policy.test.ts",
  "scripts/remote-sync-status-policy.test.ts",
  "scripts/active-remote-sync-attempt-actions-policy.test.ts",
  "scripts/active-remote-sync-completion-actions-policy.test.ts",
  "scripts/owner-auto-call-attempt-actions-policy.test.ts",
  "scripts/owner-auto-call-policy.test.ts",
  "scripts/owner-auto-call-result-actions-policy.test.ts",
  "scripts/live-call-waiting-dialog-policy.test.ts",
  "scripts/owner-live-audit-marker-actions-policy.test.ts",
  "scripts/owner-live-audit-marker-policy.test.ts",
  "scripts/owner-live-call-lifecycle-actions-policy.test.ts",
  "scripts/owner-live-evidence-update-policy.test.ts",
  "scripts/owner-live-video-preserve-outcome-policy.test.ts",
  "scripts/owner-live-video-preserve-request-policy.test.ts",
  "scripts/owner-live-video-start-outcome-policy.test.ts",
  "scripts/owner-live-video-start-request-policy.test.ts",
  "scripts/live-call-cleanup-actions-policy.test.ts",
  "scripts/live-call-cleanup-policy.test.ts",
  "scripts/finish-progress-dialog-policy.test.ts",
  "scripts/finish-progress-state-policy.test.ts",
  "scripts/media-release-waiter-policy.test.ts",
  "scripts/media-release-waiter-completion-policy.test.ts",
  "scripts/media-release-timeout-actions-policy.test.ts",
  "scripts/finish-request-policy.test.ts",
  "scripts/finish-confirmation-form-policy.test.ts",
  "scripts/finish-code-policy.test.ts",
  "scripts/finish-code-confirmation-actions-policy.test.ts",
  "scripts/finish-confirmation-dialog-policy.test.ts",
  "scripts/protected-route-code-policy.test.ts",
  "scripts/protected-route-unlock-actions-policy.test.ts",
  "scripts/protected-route-form-policy.test.ts",
  "scripts/protected-route-dialog-policy.test.ts",
  "scripts/home-navigation-policy.test.ts",
  "scripts/media-handoff-release-actions-policy.test.ts",
  "scripts/media-handoff-start-actions-policy.test.ts",
  "scripts/media-stop-pending-policy.test.ts",
  "scripts/media-stop-signal-policy.test.ts",
  "scripts/media-stop-settlement-request-policy.test.ts",
  "scripts/media-stop-settled-actions-policy.test.ts",
  "scripts/media-stop-pending-request-completion-policy.test.ts",
  "scripts/media-stop-waiter-policy.test.ts",
  "scripts/finish-active-call-start-policy.test.ts",
  "scripts/finish-active-call-runtime-start-policy.test.ts",
  "scripts/finish-active-call-runtime-state-actions-policy.test.ts",
  "scripts/finish-active-call-cleanup-policy.test.ts",
  "scripts/finish-media-stop-start-policy.test.ts",
  "scripts/finish-media-stop-request-actions-policy.test.ts",
  "scripts/finish-media-stop-result-policy.test.ts",
  "scripts/finish-remote-sync-policy.test.ts",
  "scripts/finish-remote-sync-request-actions-policy.test.ts",
  "scripts/finish-remote-sync-direct-actions-policy.test.ts",
  "scripts/finish-remote-sync-completion-actions-policy.test.ts",
  "scripts/finish-package-result-policy.test.ts",
  "scripts/finish-outcome-input-policy.test.ts",
  "scripts/finish-package-outcome-actions-policy.test.ts",
  "scripts/finish-owner-live-evidence-policy.test.ts",
  "scripts/finish-owner-live-audit-policy.test.ts",
  "scripts/finish-owner-completion-policy.test.ts",
  "scripts/finish-post-outcome-actions-policy.test.ts",
  "scripts/finish-no-media-diagnostic-policy.test.ts",
  "scripts/finish-completion-actions-policy.test.ts",
  "scripts/finish-missing-package-policy.test.ts",
  "scripts/finish-missing-package-branch-actions-policy.test.ts",
  "scripts/finish-failure-actions-policy.test.ts",
  "scripts/finish-failure-cleanup-actions-policy.test.ts",
  "scripts/live-call-history-policy.test.ts",
  "scripts/received-alert-presentation-policy.test.ts",
  "scripts/received-alert-runtime-policy.test.ts",
  "scripts/live-call-state-policy.test.ts",
  "scripts/live-webrtc-policy.test.ts",
  "scripts/live-call-sensitive-logging.test.ts",
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
const emergencyCallConfirmationPolicy = await readFile("src/features/emergency-home/emergencyCallConfirmationPolicy.ts", "utf8");
const emergencyCallHeroPolicy = await readFile("src/features/emergency-home/emergencyCallHeroPolicy.ts", "utf8");
const emergencyHomeActivityPolicy = await readFile("src/features/emergency-home/emergencyHomeActivityPolicy.ts", "utf8");
const emergencyStartFailureDialogPolicy = await readFile("src/features/emergency-home/emergencyStartFailureDialogPolicy.ts", "utf8");
const emergencyStartFailureActionsPolicy = await readFile("src/features/emergency-home/emergencyStartFailureActionsPolicy.ts", "utf8");
const emergencyStartRuntimePolicy = await readFile("src/features/emergency-home/emergencyStartRuntimePolicy.ts", "utf8");
const finishFlowProgressPolicy = await readFile("src/features/emergency-home/finishFlowProgressPolicy.ts", "utf8");
const finishProgressDialogPolicy = await readFile("src/features/emergency-home/finishProgressDialogPolicy.ts", "utf8");
const finishProgressStatePolicy = await readFile("src/features/emergency-home/finishProgressStatePolicy.ts", "utf8");
const homeNavigationPolicy = await readFile("src/features/emergency-home/homeNavigationPolicy.ts", "utf8");
const emergencyStartPolicy = await readFile("src/features/emergency-home/emergencyStartPolicy.ts", "utf8");
const finishCodePolicy = await readFile("src/features/emergency-home/finishCodePolicy.ts", "utf8");
const finishCodeConfirmationActionsPolicy = await readFile("src/features/emergency-home/finishCodeConfirmationActionsPolicy.ts", "utf8");
const finishConfirmationDialogPolicy = await readFile("src/features/emergency-home/finishConfirmationDialogPolicy.ts", "utf8");
const finishConfirmationFormPolicy = await readFile("src/features/emergency-home/finishConfirmationFormPolicy.ts", "utf8");
const finishOutcomePolicy = await readFile("src/features/emergency-home/finishOutcomePolicy.ts", "utf8");
const finishRequestPolicy = await readFile("src/features/emergency-home/finishRequestPolicy.ts", "utf8");
const mediaHandoffPolicy = await readFile("src/features/emergency-home/mediaHandoffPolicy.ts", "utf8");
const mediaHandoffReleaseActionsPolicy = await readFile("src/features/emergency-home/mediaHandoffReleaseActionsPolicy.ts", "utf8");
const mediaHandoffStartActionsPolicy = await readFile("src/features/emergency-home/mediaHandoffStartActionsPolicy.ts", "utf8");
const mediaProcessingStatusPolicy = await readFile("src/features/emergency-home/mediaProcessingStatusPolicy.ts", "utf8");
const mediaReleaseWaiterPolicy = await readFile("src/features/emergency-home/mediaReleaseWaiterPolicy.ts", "utf8");
const mediaReleaseWaiterCompletionPolicy = await readFile("src/features/emergency-home/mediaReleaseWaiterCompletionPolicy.ts", "utf8");
const mediaReleaseTimeoutActionsPolicy = await readFile("src/features/emergency-home/mediaReleaseTimeoutActionsPolicy.ts", "utf8");
const mediaStopPendingPolicy = await readFile("src/features/emergency-home/mediaStopPendingPolicy.ts", "utf8");
const mediaStopSignalPolicy = await readFile("src/features/emergency-home/mediaStopSignalPolicy.ts", "utf8");
const mediaStopSettlementRequestPolicy = await readFile("src/features/emergency-home/mediaStopSettlementRequestPolicy.ts", "utf8");
const mediaStopSettledActionsPolicy = await readFile("src/features/emergency-home/mediaStopSettledActionsPolicy.ts", "utf8");
const mediaStopPendingRequestCompletionPolicy = await readFile("src/features/emergency-home/mediaStopPendingRequestCompletionPolicy.ts", "utf8");
const mediaStopWaiterPolicy = await readFile("src/features/emergency-home/mediaStopWaiterPolicy.ts", "utf8");
const finishActiveCallStartPolicy = await readFile("src/features/emergency-home/finishActiveCallStartPolicy.ts", "utf8");
const finishActiveCallRuntimeStartPolicy = await readFile("src/features/emergency-home/finishActiveCallRuntimeStartPolicy.ts", "utf8");
const finishActiveCallRuntimeStateActionsPolicy = await readFile("src/features/emergency-home/finishActiveCallRuntimeStateActionsPolicy.ts", "utf8");
const finishActiveCallCleanupPolicy = await readFile("src/features/emergency-home/finishActiveCallCleanupPolicy.ts", "utf8");
const emergencyStartCreatedActionsPolicy = await readFile("src/features/emergency-home/emergencyStartCreatedActionsPolicy.ts", "utf8");
const emergencyStartRemoteSyncActionsPolicy = await readFile("src/features/emergency-home/emergencyStartRemoteSyncActionsPolicy.ts", "utf8");
const finishMediaStopStartPolicy = await readFile("src/features/emergency-home/finishMediaStopStartPolicy.ts", "utf8");
const finishMediaStopRequestActionsPolicy = await readFile("src/features/emergency-home/finishMediaStopRequestActionsPolicy.ts", "utf8");
const finishMediaStopResultPolicy = await readFile("src/features/emergency-home/finishMediaStopResultPolicy.ts", "utf8");
const finishRemoteSyncPolicy = await readFile("src/features/emergency-home/finishRemoteSyncPolicy.ts", "utf8");
const finishRemoteSyncRequestActionsPolicy = await readFile(
  "src/features/emergency-home/finishRemoteSyncRequestActionsPolicy.ts",
  "utf8"
);
const finishRemoteSyncDirectActionsPolicy = await readFile(
  "src/features/emergency-home/finishRemoteSyncDirectActionsPolicy.ts",
  "utf8"
);
const finishRemoteSyncCompletionActionsPolicy = await readFile(
  "src/features/emergency-home/finishRemoteSyncCompletionActionsPolicy.ts",
  "utf8"
);
const finishPackageResultPolicy = await readFile("src/features/emergency-home/finishPackageResultPolicy.ts", "utf8");
const finishOutcomeInputPolicy = await readFile("src/features/emergency-home/finishOutcomeInputPolicy.ts", "utf8");
const finishPackageOutcomeActionsPolicy = await readFile(
  "src/features/emergency-home/finishPackageOutcomeActionsPolicy.ts",
  "utf8"
);
const finishOwnerLiveEvidencePolicy = await readFile("src/features/emergency-home/finishOwnerLiveEvidencePolicy.ts", "utf8");
const finishOwnerLiveAuditPolicy = await readFile("src/features/emergency-home/finishOwnerLiveAuditPolicy.ts", "utf8");
const finishOwnerCompletionPolicy = await readFile("src/features/emergency-home/finishOwnerCompletionPolicy.ts", "utf8");
const finishPostOutcomeActionsPolicy = await readFile("src/features/emergency-home/finishPostOutcomeActionsPolicy.ts", "utf8");
const finishNoMediaDiagnosticPolicy = await readFile("src/features/emergency-home/finishNoMediaDiagnosticPolicy.ts", "utf8");
const finishCompletionActionsPolicy = await readFile("src/features/emergency-home/finishCompletionActionsPolicy.ts", "utf8");
const finishMissingPackagePolicy = await readFile("src/features/emergency-home/finishMissingPackagePolicy.ts", "utf8");
const finishMissingPackageBranchActionsPolicy = await readFile(
  "src/features/emergency-home/finishMissingPackageBranchActionsPolicy.ts",
  "utf8"
);
const finishFailureActionsPolicy = await readFile("src/features/emergency-home/finishFailureActionsPolicy.ts", "utf8");
const finishFailureCleanupActionsPolicy = await readFile(
  "src/features/emergency-home/finishFailureCleanupActionsPolicy.ts",
  "utf8"
);
const activeRemoteSyncAttemptActionsPolicy = await readFile("src/features/emergency-home/activeRemoteSyncAttemptActionsPolicy.ts", "utf8");
const activeRemoteSyncCompletionActionsPolicy = await readFile("src/features/emergency-home/activeRemoteSyncCompletionActionsPolicy.ts", "utf8");
const ownerAutoCallAttemptActionsPolicy = await readFile("src/features/emergency-home/ownerAutoCallAttemptActionsPolicy.ts", "utf8");
const ownerAutoCallPolicy = await readFile("src/features/emergency-home/ownerAutoCallPolicy.ts", "utf8");
const ownerAutoCallResultActionsPolicy = await readFile("src/features/emergency-home/ownerAutoCallResultActionsPolicy.ts", "utf8");
const ownerLiveAuditMarkerActionsPolicy = await readFile("src/features/emergency-home/ownerLiveAuditMarkerActionsPolicy.ts", "utf8");
const ownerLiveAuditMarkerPolicy = await readFile("src/features/emergency-home/ownerLiveAuditMarkerPolicy.ts", "utf8");
const ownerLiveCallLifecycleActionsPolicy = await readFile("src/features/emergency-home/ownerLiveCallLifecycleActionsPolicy.ts", "utf8");
const ownerLiveEvidenceUpdatePolicy = await readFile("src/features/emergency-home/ownerLiveEvidenceUpdatePolicy.ts", "utf8");
const ownerLiveEvidencePolicy = await readFile("src/features/emergency-home/ownerLiveEvidencePolicy.ts", "utf8");
const ownerLiveVideoPreserveOutcomePolicy = await readFile("src/features/emergency-home/ownerLiveVideoPreserveOutcomePolicy.ts", "utf8");
const ownerLiveVideoPreserveRequestPolicy = await readFile("src/features/emergency-home/ownerLiveVideoPreserveRequestPolicy.ts", "utf8");
const ownerLiveVideoStartOutcomePolicy = await readFile("src/features/emergency-home/ownerLiveVideoStartOutcomePolicy.ts", "utf8");
const ownerLiveVideoStartRequestPolicy = await readFile("src/features/emergency-home/ownerLiveVideoStartRequestPolicy.ts", "utf8");
const liveCallCleanupActionsPolicy = await readFile("src/features/emergency-home/liveCallCleanupActionsPolicy.ts", "utf8");
const liveCallCleanupPolicy = await readFile("src/features/emergency-home/liveCallCleanupPolicy.ts", "utf8");
const liveCallPanelPolicy = await readFile("src/features/emergency-home/liveCallPanelPolicy.ts", "utf8");
const localSosPackageStatusPolicy = await readFile("src/features/emergency-home/localSosPackageStatusPolicy.ts", "utf8");
const interruptedRecoveryProgressPolicy = await readFile("src/features/emergency-home/interruptedRecoveryProgressPolicy.ts", "utf8");
const liveCallWaitingDialogPolicy = await readFile("src/features/emergency-home/liveCallWaitingDialogPolicy.ts", "utf8");
const panicTriggerPolicy = await readFile("src/features/emergency-home/panicTriggerPolicy.ts", "utf8");
const recordingConsentDialogPolicy = await readFile("src/features/emergency-home/recordingConsentDialogPolicy.ts", "utf8");
const protectedRouteAccessPolicy = await readFile("src/features/emergency-home/protectedRouteAccessPolicy.ts", "utf8");
const protectedRouteCodePolicy = await readFile("src/features/emergency-home/protectedRouteCodePolicy.ts", "utf8");
const protectedRouteUnlockActionsPolicy = await readFile("src/features/emergency-home/protectedRouteUnlockActionsPolicy.ts", "utf8");
const protectedRouteDialogPolicy = await readFile("src/features/emergency-home/protectedRouteDialogPolicy.ts", "utf8");
const protectedRouteFormPolicy = await readFile("src/features/emergency-home/protectedRouteFormPolicy.ts", "utf8");
const remoteSyncStatusPolicy = await readFile("src/features/emergency-home/remoteSyncStatusPolicy.ts", "utf8");
const alertScreen = await readFile("app/alerta.tsx", "utf8");
const incomingEmergencyNotification = await readFile("src/features/live-call/incomingEmergencyNotification.ts", "utf8");
const liveCallHistory = await readFile("src/features/live-call/liveCallHistory.ts", "utf8");
const liveCallHistoryPolicy = await readFile("src/features/live-call/liveCallHistoryPolicy.ts", "utf8");
const receivedAlertPresentationPolicy = await readFile("src/features/live-call/receivedAlertPresentationPolicy.ts", "utf8");
const receivedAlertRuntimePolicy = await readFile("src/features/live-call/receivedAlertRuntimePolicy.ts", "utf8");
const liveCallRolePolicy = await readFile("src/features/live-call/liveCallRolePolicy.ts", "utf8");
const liveCallStatePolicy = await readFile("src/features/live-call/liveCallStatePolicy.ts", "utf8");
const liveWebRtcPolicy = await readFile("src/features/live-call/liveWebRtcPolicy.ts", "utf8");
const liveCallControl = await readFile("src/services/liveCallControl.ts", "utf8");
const useLiveAudioCall = await readFile("src/features/live-call/useLiveAudioCall.ts", "utf8");
const liveWebRtcSession = await readFile("src/services/liveWebRtcSession.ts", "utf8");
const localFilesScreen = await readFile("app/arquivos.tsx", "utf8");
const settingsScreen = await readFile("app/configuracoes.tsx", "utf8");
const settingsPresentationPolicy = await readFile("src/features/settings/settingsPresentationPolicy.ts", "utf8");
const contactsScreen = await readFile("app/contatos.tsx", "utf8");
const invitationScreen = await readFile("app/convite.tsx", "utf8");
const accessGate = await readFile("src/features/access/AccessGate.tsx", "utf8");
const profilesScreen = await readFile("app/perfis.tsx", "utf8");
const deviceBinding = await readFile("src/services/deviceBinding.ts", "utf8");
const deviceKeyProof = await readFile("src/services/deviceKeyProof.ts", "utf8");
const profilePolicy = await readFile("src/features/profiles/profilePolicy.ts", "utf8");
const profileSurface = `${profilesScreen}\n${profilePolicy}`;
const ownerLiveCallStartIndex = useLiveAudioCall.indexOf("const startOwnerAudioCall");
const angelLiveCallStartIndex = useLiveAudioCall.indexOf("const startAngelAudioCall");
const ownerLiveCallBlock =
  ownerLiveCallStartIndex >= 0 && angelLiveCallStartIndex > ownerLiveCallStartIndex
    ? useLiveAudioCall.slice(ownerLiveCallStartIndex, angelLiveCallStartIndex)
    : "";
const angelLiveCallBlock =
  angelLiveCallStartIndex >= 0 ? useLiveAudioCall.slice(angelLiveCallStartIndex) : "";

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
  !homeScreen.includes("resolveInterruptedRecoveryFinishProgress") ||
  !interruptedRecoveryProgressPolicy.includes("sem reativar camera ou microfone")
) {
  throw new Error("Tela SOS precisa recuperar chamado interrompido no startup sem remontar camera automaticamente.");
}

if (
  !alertScreen.includes("listReceivedEmergencySessions") ||
  !alertScreen.includes("respondToEmergencySession") ||
  !alertScreen.includes("buildReceivedAlertCardPresentation") ||
  !receivedAlertPresentationPolicy.includes("Você é anjo de") ||
  !receivedAlertPresentationPolicy.includes("Atender como anjo")
) {
  throw new Error("Tela de alertas recebidos precisa listar pedidos roteados e permitir resposta do anjo.");
}

if (
  !alertScreen.includes("beginReceivedLiveCallArchive") ||
  !alertScreen.includes("listReceivedLiveCallArchives") ||
  !alertScreen.includes("autoAcceptingSessionIdsRef") ||
  !alertScreen.includes("autoRealtimeSessionIdsRef") ||
  !alertScreen.includes("buildReceivedAlertArchiveStatusUpdateDecision") ||
  !alertScreen.includes("buildReceivedAlertArchiveSyncDecision") ||
  !receivedAlertRuntimePolicy.includes("buildReceivedAlertRealtimeStartDecision") ||
  !receivedAlertRuntimePolicy.includes("shouldStartRealtimeForExistingRecord") ||
  !receivedAlertRuntimePolicy.includes("shouldEndArchive") ||
  !alertScreen.includes("activeLiveCall") ||
  !alertScreen.includes("notifyIncomingEmergency") ||
  !receivedAlertPresentationPolicy.includes("Entrar na chamada") ||
  !receivedAlertPresentationPolicy.includes("Você é o anjo") ||
  !alertScreen.includes("Share.share") ||
  !alertScreen.includes("openRealtimeCall")
) {
  throw new Error("Tela do anjo precisa notificar, registrar em background e preparar tempo real automaticamente.");
}

if (
  !homeScreen.includes("ownerLiveCallAutoStartDelayMs") ||
  !homeScreen.includes("ownerLiveCallAutoRetryMs") ||
  !homeScreen.includes("activeRemoteSyncRetryMs") ||
  !homeScreen.includes("activeRemoteSyncInFlightRef") ||
  !homeScreen.includes("resolveLiveCallPanelPolicy") ||
  !homeScreen.includes("resolveLiveCallCleanupActions") ||
  !homeScreen.includes("resolveLiveCallCleanupDecision") ||
  !liveCallCleanupPolicy.includes('liveAudioCallStatus === "idle"') ||
  !homeScreen.includes("resolveActiveRemoteSyncAttemptActions") ||
  !homeScreen.includes("resolveActiveRemoteSyncPackageActions") ||
  !homeScreen.includes("resolveActiveRemoteSyncFailureActions") ||
  !homeScreen.includes("syncEmergencyPackageWithApi(packageActions.packageToSync)") ||
  !activeRemoteSyncAttemptActionsPolicy.includes("emergency_active_remote_sync_attempt") ||
  !activeRemoteSyncCompletionActionsPolicy.includes("activeRemoteSyncRetryMessage") ||
  !remoteSyncStatusPolicy.includes("Tentando avisar seus anjos pela internet") ||
  !homeScreen.includes("ownerAutoCallStartedSessionIdsRef") ||
  !homeScreen.includes("listAcceptedLiveRecipients") ||
  !homeScreen.includes("resolveOwnerAutoCallAttemptActions") ||
  !homeScreen.includes("resolveOwnerAutoCallRecipientActions") ||
  !homeScreen.includes("resolveOwnerAutoCallStartResultActions") ||
  !homeScreen.includes("prepareMediaForOwnerLiveCall") ||
  !homeScreen.includes("const started = await liveAudioCall.startOwnerAudioCall") ||
  !homeScreen.includes("startResultActions.shouldMarkStarted") ||
  !homeScreen.includes("resolveMediaHandoffStartActions") ||
  !mediaHandoffStartActionsPolicy.includes("emergency_live_call_media_handoff_start") ||
  !homeScreen.includes("waitForMediaRecorderRelease") ||
  !homeScreen.includes("mediaReleaseForLiveCallWaitTimeoutMs = 12000") ||
  !homeScreen.includes("resolveMediaProcessingPresentation") ||
  !mediaProcessingStatusPolicy.includes("Camera liberada. Abrindo video ao vivo para o anjo.") ||
  !ownerAutoCallAttemptActionsPolicy.includes("emergency_live_call_auto_start_attempt") ||
  !ownerAutoCallResultActionsPolicy.includes("resolveOwnerAutoCallStartResultActions") ||
  !ownerAutoCallPolicy.includes("Anjo entrou. Chamando agora.")
) {
  throw new Error("Tela SOS precisa sincronizar chamado ativo com EC2, liberar camera/microfone locais e conectar automaticamente uma unica chamada apos aceite do anjo.");
}

if (
  !homeScreen.includes("resolveMediaReleaseWaiterStart") ||
  !homeScreen.includes("resolveMediaReleaseWaiterCompletion") ||
  !homeScreen.includes("resolveMediaReleaseTimeoutActions") ||
  !homeScreen.includes("resolveMediaReleaseTimeout") ||
  !mediaReleaseWaiterPolicy.includes("resolveMediaReleaseWaiterStart") ||
  !mediaReleaseWaiterPolicy.includes("emergency_live_call_media_release_timeout") ||
  !mediaReleaseWaiterCompletionPolicy.includes("resolveMediaReleaseWaiterCompletion") ||
  !mediaReleaseWaiterCompletionPolicy.includes("shouldResolvePendingRequest") ||
  !mediaReleaseTimeoutActionsPolicy.includes("resolveMediaReleaseTimeoutActions") ||
  !mediaReleaseTimeoutActionsPolicy.includes("shouldResolvePendingRequest") ||
  !packageJson.scripts["test:media-release-waiter"] ||
  !packageJson.scripts["test:media-release-waiter-completion"] ||
  !packageJson.scripts["test:media-release-timeout-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para inicio, conclusao e timeout do waiter de liberacao de midia da chamada ao vivo.");
}

if (
  !incomingEmergencyNotification.includes("sinalseguro-emergency-alerts") ||
  !incomingEmergencyNotification.includes("AndroidImportance.HIGH") ||
  !incomingEmergencyNotification.includes("SOS recebido") ||
  !incomingEmergencyNotification.includes("scheduleNotificationAsync")
) {
  throw new Error("Notificacao local do chamado recebido precisa ficar explicita e prioritaria no Android.");
}

if (
  !appLayout.includes("IncomingEmergencyForegroundBridge") ||
  !appLayout.includes("listReceivedEmergencySessions") ||
  !appLayout.includes("shouldOpenIncomingEmergency") ||
  !appLayout.includes('router.push("/alerta")') ||
  !appLayout.includes("incomingEmergencyForegroundPollMs") ||
  !appLayout.includes("notifyIncomingEmergency")
) {
  throw new Error("App aberto no aparelho do anjo precisa detectar SOS recebido fora da tela de alertas e abrir o atendimento.");
}

if (
  !liveWebRtcSession.includes("shouldAddRecvOnlyVideoTransceiver") ||
  !liveWebRtcSession.includes('transceiverPeer.addTransceiver("video", { direction: "recvonly" })') ||
  !liveWebRtcSession.includes("remoteStreamFromTrackEvent") ||
  !liveWebRtcSession.includes("onaddstream") ||
  !liveWebRtcSession.includes('addEventListener("track"') ||
  !liveWebRtcSession.includes('addEventListener("iceconnectionstatechange"') ||
  !liveWebRtcSession.includes("remote_stream_${source}") ||
  !liveWebRtcSession.includes("liveMediaOpenTimeoutMs") ||
  !liveWebRtcSession.includes("getUserMediaWithTimeout") ||
  !liveWebRtcSession.includes("buildLiveMediaConstraints") ||
  !liveWebRtcSession.includes('options.videoFacingMode ?? "environment"') ||
  !liveWebRtcPolicy.includes('videoMode === "recvonly"') ||
  !liveWebRtcPolicy.includes("emergencyVideoConstraints") ||
  !liveWebRtcPolicy.includes("liveMediaOpenTimeoutMs") ||
  !liveWebRtcPolicy.includes('facingMode: videoFacingMode') ||
  !liveWebRtcPolicy.includes('value === "completed"') ||
  !liveWebRtcPolicy.includes('value === "checking"')
) {
  throw new Error("WebRTC precisa negociar video recebido, priorizar camera do evento e refletir estados ICE quando o connectionState nativo for instavel.");
}

if (
  !liveCallControl.includes("senderDeviceId") ||
  !liveCallControl.includes("recipientDeviceId") ||
  !liveCallControl.includes("senderRole") ||
  !liveCallControl.includes("recipientRole") ||
  !liveCallControl.includes("isAllowedLiveSignalRoute") ||
  !liveCallControl.includes("relationship_role === \"angel\"") ||
  !liveCallControl.includes("signal.payload.recipientDeviceId") ||
  !liveCallControl.includes("signal.payload.senderDeviceId") ||
  !deviceBinding.includes("requireRegisteredApiDeviceId") ||
  !homeScreen.includes("Chamar anjo") ||
  !emergencyStartPolicy.includes("Você pediu ajuda") ||
  !receivedAlertPresentationPolicy.includes("Você é anjo de") ||
  !receivedAlertPresentationPolicy.includes("Atender como anjo") ||
  !receivedAlertPresentationPolicy.includes("Entrar na chamada")
) {
  throw new Error("Chamada com anjo precisa ter rota por dispositivo/papel e UX clara de solicitante versus anjo.");
}

if (
  !liveCallRolePolicy.includes("canAngelAutoAcceptIncomingEmergency") ||
  !liveCallRolePolicy.includes("canAngelStartRealtime") ||
  !liveCallRolePolicy.includes("canOwnerStartLiveCallWithRecipient") ||
  !liveCallRolePolicy.includes("current_recipient") ||
  !liveCallRolePolicy.includes("relationship_role !== \"angel\"")
) {
  throw new Error("Politica de chamada precisa separar owner/anjo e impedir aceite local sem sessao recebida valida.");
}

if (!useLiveAudioCall.includes("requireRegisteredApiDeviceId")) {
  throw new Error("Videochamada precisa exigir dispositivo registrado antes de sinalizar.");
}

if (
  !useLiveAudioCall.includes("hasActiveCallForSession") ||
  !useLiveAudioCall.includes("stateRef") ||
  !useLiveAudioCall.includes("remoteStream,") ||
  !useLiveAudioCall.includes("remoteStreamUrl") ||
  !useLiveAudioCall.includes("streamUrlFrom") ||
  !useLiveAudioCall.includes("shouldRenderRemoteStream") ||
  !ownerLiveCallBlock.includes('audioMode: "sendrecv"') ||
  !ownerLiveCallBlock.includes('videoFacingMode: "environment"') ||
  !ownerLiveCallBlock.includes('videoMode: "sendrecv"') ||
  !angelLiveCallBlock.includes('audioMode: "recvonly"') ||
  !angelLiveCallBlock.includes('videoMode: "recvonly"') ||
  !useLiveAudioCall.includes("liveAudioRemoteStreamState") ||
  !liveCallStatePolicy.includes('status: current.remoteStream || current.remoteStreamUrl ? "connected" : "connecting"') ||
  !liveCallStatePolicy.includes("Transmitindo seu SOS para o anjo") ||
  !liveCallStatePolicy.includes('status: "connected"') ||
  !liveCallStatePolicy.includes('current.status === "connected"') ||
  !liveCallStatePolicy.includes("current.message")
) {
  throw new Error("Videochamada precisa manter owner como transmissor do SOS e anjo como receptor do video.");
}

if (
  !useLiveAudioCall.includes("answerAccepted") ||
  !useLiveAudioCall.includes("answerSignal") ||
  useLiveAudioCall.indexOf("const answerSignal") > useLiveAudioCall.indexOf('signal.signal_type === "ice"')
) {
  throw new Error("Solicitante precisa aplicar o answer antes de processar ICE do anjo.");
}

if (
  !liveCallHistory.includes("sinalseguro.live-call-archive.v1") ||
  !liveCallHistory.includes("getSecureRecord") ||
  !liveCallHistory.includes("saveSecureRecord") ||
  !liveCallHistory.includes("listSecureRecords")
) {
  throw new Error("Historico de chamadas recebidas precisa usar armazenamento local seguro.");
}

if (
  !liveCallHistoryPolicy.includes("allowedTargets: [\"autoridade\", \"usuario_protegido\"]") ||
  !liveCallHistoryPolicy.includes("Compartilhe somente") ||
  !liveCallHistoryPolicy.includes("backend nao recebe audio/video") ||
  !liveCallHistoryPolicy.includes("buildLiveCallShareText")
) {
  throw new Error("Historico de chamadas precisa preservar regras de compartilhamento e privacidade.");
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
  !settingsScreen.includes("buildSettingsLegalPanelState") ||
  !settingsScreen.includes("handleLegalPanelAction") ||
  !settingsPresentationPolicy.includes("\"accept-legal-consent\"") ||
  !settingsPresentationPolicy.includes("Uso emergencial") ||
  !settingsPresentationPolicy.includes("Privacidade") ||
  !settingsPresentationPolicy.includes("Arquivos locais")
) {
  throw new Error("Termos e privacidade precisam exibir resumo visivel antes do aceite local.");
}

if (
  !settingsScreen.includes("buildSettingsDurationPanelState") ||
  !settingsScreen.includes("handleDurationPanelAction") ||
  !settingsPresentationPolicy.includes("durationSeconds") ||
  !settingsPresentationPolicy.includes("formatDuration(duration)")
) {
  throw new Error("Duracao precisa manter labels e selecao em policy pura com persistencia real na tela.");
}

if (
  !settingsScreen.includes("buildSettingsSharingPanelState") ||
  !settingsScreen.includes("buildSettingsStreamScopePreferenceUpdate") ||
  !settingsPresentationPolicy.includes("buildSettingsCall190PreferenceUpdate") ||
  !settingsPresentationPolicy.includes("status: \"homologation_blocked\"") ||
  !settingsPresentationPolicy.includes("Atalho de anjo desativado") ||
  !settingsPresentationPolicy.includes("Anjo 190 bloqueado ate aceite")
) {
  throw new Error("Atalho de anjo precisa permanecer desativado ate gestao, aceite e contrato futuros.");
}

if (
  !settingsScreen.includes("buildSettingsCameraModePreferenceUpdate") ||
  !settingsScreen.includes("buildSettingsLocalVideoRequestPreferenceUpdate") ||
  !settingsPresentationPolicy.includes("buildSettingsLocalVideoRequestPreferenceUpdate") ||
  !settingsPresentationPolicy.includes("status: \"enabled_local\"")
) {
  throw new Error("Video local precisa manter decisoes puras na policy e efeitos reais no painel Configuracoes.");
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
  !emergencyHomeActivityPolicy.includes("input.activePackageId") ||
  !emergencyHomeActivityPolicy.includes("input.finishInProgress")
) {
  throw new Error("Home precisa manter tela acordada enquanto chamado ativo ou encerramento estiver em progresso.");
}

if (
  !homeScreen.includes("waitForMediaRecorderStop") ||
  !homeScreen.includes("mediaStopWaitTimeoutMs") ||
  !homeScreen.includes("finishInProgressRef") ||
  !homeScreen.includes("resolveMediaStopTimeout") ||
  !mediaStopWaiterPolicy.includes("emergency_media_stop_timeout") ||
  homeScreen.indexOf("await waitForMediaRecorderStop(stopSerial)") > homeScreen.indexOf("finishEmergencyPackage(packageId")
) {
  throw new Error("Home iOS precisa aguardar stop da camera, bloquear duplo encerramento e finalizar pacote sem perder midia.");
}

if (
  !homeScreen.includes("resolveMediaStopWaiterStart") ||
  !homeScreen.includes("resolveMediaStopTimeout") ||
  !mediaStopWaiterPolicy.includes("resolveMediaStopWaiterStart") ||
  !mediaStopWaiterPolicy.includes("resolveMediaStopTimeout") ||
  !mediaStopWaiterPolicy.includes("emergency_media_stop_timeout") ||
  !packageJson.scripts["test:media-stop-waiter"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para waiter de parada do recorder.");
}

if (
  !homeScreen.includes("startInProgress") ||
  !homeScreen.includes("resolvePanicTriggerDecision") ||
  !panicTriggerPolicy.includes("ignore_start_in_progress") ||
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

if (
  !homeScreen.includes("resolvePanicTriggerDecision") ||
  !homeScreen.includes("panicButtonLabel") ||
  !panicTriggerPolicy.includes("shouldRequestRecordingConsent") ||
  !panicTriggerPolicy.includes("request_recording_consent") ||
  !panicTriggerPolicy.includes("show_media_protection_progress") ||
  !packageJson.scripts["test:panic-trigger"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para decisao do botao SOS e gate de consentimento.");
}

if (
  !homeScreen.includes("resolveRecordingConsentDialogPresentation") ||
  !recordingConsentDialogPolicy.includes("resolveRecordingConsentDialogPresentation") ||
  !recordingConsentDialogPolicy.includes("Revise e aceite os termos") ||
  !packageJson.scripts["test:recording-consent-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para apresentacao do consentimento de gravacao.");
}

if (
  !homeScreen.includes("resolveEmergencyCallConfirmation") ||
  !emergencyCallConfirmationPolicy.includes("resolveEmergencyCallConfirmation") ||
  !emergencyCallConfirmationPolicy.includes("Ligar para") ||
  !packageJson.scripts["test:emergency-call-confirmation"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para confirmacao de ligacao emergencial.");
}

if (
  !homeScreen.includes("resolveEmergencyCallHeroPresentation") ||
  !emergencyCallHeroPolicy.includes("resolveEmergencyCallHeroPresentation") ||
  !emergencyCallHeroPolicy.includes("accessibilityHint") ||
  !packageJson.scripts["test:emergency-call-hero"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para acessibilidade do numero emergencial.");
}

if (
  !homeScreen.includes("resolveInterruptedRecoveryFinishProgress") ||
  !homeScreen.includes("resolveInterruptedResidueRecoveryProgress") ||
  !interruptedRecoveryProgressPolicy.includes("resolveInterruptedRecoveryFinishProgress") ||
  !interruptedRecoveryProgressPolicy.includes("resolveInterruptedResidueRecoveryProgress") ||
  !packageJson.scripts["test:interrupted-recovery-progress"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para progresso de recuperacao de chamado interrompido.");
}

if (
  !finishActiveCallRuntimeStartPolicy.includes("resolveFinishRequestedProgress") ||
  !finishMediaStopRequestActionsPolicy.includes("resolveFinishMediaStopStartActions") ||
  !homeScreen.includes("resolveFinishMediaStopResultActions") ||
  !homeScreen.includes("resolveFinishRemoteSyncRequestActions") ||
  !finishRemoteSyncRequestActionsPolicy.includes("resolveFinishRemoteSyncStartActions") ||
  !finishMediaStopStartPolicy.includes("resolveFinishMediaStopSignaledProgress") ||
  !finishMediaStopResultPolicy.includes("resolveFinishMediaStopSettledProgress") ||
  !finishFlowProgressPolicy.includes("resolveMediaProtectionInProgress") ||
  !finishFlowProgressPolicy.includes("resolveFinishFailedProgress") ||
  !packageJson.scripts["test:finish-flow-progress"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para progresso de encerramento do chamado.");
}

if (
  !homeScreen.includes("resolveFinishProgressDialogPresentation") ||
  !finishProgressDialogPolicy.includes("resolveFinishProgressDialogPresentation") ||
  !finishProgressDialogPolicy.includes("normalizedProgress") ||
  !finishProgressDialogPolicy.includes("shouldShowPendingRow") ||
  !packageJson.scripts["test:finish-progress-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para apresentacao do dialogo de progresso do encerramento.");
}

if (
  !homeScreen.includes("resolveNextFinishProgressState") ||
  !homeScreen.includes("resolveClosedFinishProgressState") ||
  !homeScreen.includes("resolveVaultOpeningFinishProgressState") ||
  !finishProgressStatePolicy.includes("idleFinishProgressState") ||
  !finishProgressStatePolicy.includes("resolveNextFinishProgressState") ||
  !packageJson.scripts["test:finish-progress-state"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para estado do progresso de encerramento.");
}

if (
  !homeScreen.includes("resolveEmergencyStartRuntimeActions") ||
  !homeScreen.includes("resolveEmergencyStartRequestPolicy") ||
  !homeScreen.includes("resolveEmergencyStartPresentation") ||
  !homeScreen.includes("resolveEmergencyStartCreatedActions") ||
  !homeScreen.includes("resolveEmergencyStartRemoteSyncResultActions") ||
  !homeScreen.includes("resolveEmergencyStartRemoteSyncErrorActions") ||
  !emergencyStartRuntimePolicy.includes("emergency_start_requested") ||
  !emergencyStartRuntimePolicy.includes("shouldClearOwnerAutoCallState") ||
  !emergencyStartCreatedActionsPolicy.includes("emergency_start_package_created") ||
  !emergencyStartCreatedActionsPolicy.includes("recordingStatus") ||
  !emergencyStartRemoteSyncActionsPolicy.includes("emergency_remote_sync_start_result") ||
  !emergencyStartRemoteSyncActionsPolicy.includes("emergency_remote_sync_start_error") ||
  !emergencyStartRemoteSyncActionsPolicy.includes("source: \"initial\"") ||
  !emergencyStartPolicy.includes("resolveEmergencyStartRequestPolicy") ||
  !emergencyStartPolicy.includes("resolveEmergencyStartPresentation") ||
  !emergencyStartPolicy.includes("foreground_when_triggered") ||
  !emergencyStartPolicy.includes("shouldOpenEmergencyPhoneCall") ||
  !emergencyStartPolicy.includes("Localizacao preservada.") ||
  !emergencyStartPolicy.includes("Arquivo no cofre local") ||
  !packageJson.scripts["test:emergency-start-runtime"] ||
  !packageJson.scripts["test:emergency-start-created-actions"] ||
  !packageJson.scripts["test:emergency-start-remote-sync-actions"] ||
  !packageJson.scripts["test:emergency-start"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para inicio do chamado e apresentacao inicial.");
}

if (
  !homeScreen.includes("resolveEmergencyStartFailureActions") ||
  !emergencyStartFailureActionsPolicy.includes("resolveEmergencyStartFailureDialogPresentation") ||
  !emergencyStartFailureActionsPolicy.includes("emergency_start_error") ||
  !emergencyStartFailureDialogPolicy.includes("resolveEmergencyStartFailureDialogPresentation") ||
  !emergencyStartFailureDialogPolicy.includes("Use 190, 193 ou 192") ||
  !packageJson.scripts["test:emergency-start-failure-actions"] ||
  !packageJson.scripts["test:emergency-start-failure-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para apresentacao de falha ao iniciar chamado.");
}

if (
  !homeScreen.includes("resolveEmergencyHomeActivityPresentation") ||
  !emergencyHomeActivityPolicy.includes("resolveEmergencyHomeActivityPresentation") ||
  !emergencyHomeActivityPolicy.includes("shouldKeepAwake") ||
  !packageJson.scripts["test:emergency-home-activity"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para atividade visual e wake lock emergencial.");
}

if (
  !homeScreen.includes("resolveActiveRemoteSyncStatus") ||
  !homeScreen.includes("resolveActiveRemoteSyncAttemptActions") ||
  !homeScreen.includes("resolveActiveRemoteSyncResultActions") ||
  !activeRemoteSyncCompletionActionsPolicy.includes("resolveActiveRemoteSyncFailureActions") ||
  !remoteSyncStatusPolicy.includes("activeRemoteSyncStatusMessage") ||
  !remoteSyncStatusPolicy.includes("beginLiveEvidence") ||
  !remoteSyncStatusPolicy.includes("Pedido enviado para") ||
  !packageJson.scripts["test:remote-sync-status"] ||
  !packageJson.scripts["test:active-remote-sync-attempt-actions"] ||
  !packageJson.scripts["test:active-remote-sync-completion-actions"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para mensagens de sincronizacao remota do SOS ativo.");
}

if (
  !homeScreen.includes("resolveOwnerAutoCallAttemptActions") ||
  !homeScreen.includes("resolveOwnerAutoCallErrorActions") ||
  !homeScreen.includes("resolveOwnerAutoCallFinallyActions") ||
  !homeScreen.includes("resolveOwnerAutoCallRecipientActions") ||
  !ownerAutoCallPolicy.includes("shouldAttemptOwnerAutoCall") ||
  !ownerAutoCallPolicy.includes("ownerAutoCallRecipientStatus") ||
  !ownerAutoCallPolicy.includes("Anjo entrou. Chamando agora.") ||
  !ownerAutoCallPolicy.includes("Aguardando anjo") ||
  !ownerAutoCallAttemptActionsPolicy.includes("resolveOwnerAutoCallAttemptActions") ||
  !ownerAutoCallAttemptActionsPolicy.includes("ownerAutoCallAttemptMessage") ||
  !ownerAutoCallAttemptActionsPolicy.includes("emergency_live_call_auto_start_attempt") ||
  !ownerAutoCallResultActionsPolicy.includes("resolveOwnerAutoCallRecipientActions") ||
  !ownerAutoCallResultActionsPolicy.includes("resolveOwnerAutoCallErrorActions") ||
  !ownerAutoCallResultActionsPolicy.includes("emergency_live_call_auto_start_error") ||
  !packageJson.scripts["test:owner-auto-call"] ||
  !packageJson.scripts["test:owner-auto-call-attempt-actions"] ||
  !packageJson.scripts["test:owner-auto-call-result-actions"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para autochamada do solicitante apos aceite do anjo.");
}

if (
  !homeScreen.includes("resolveOwnerLiveAuditMarkerActions") ||
  !homeScreen.includes("resolveOwnerLiveAuditMarkerInput") ||
  !ownerLiveAuditMarkerActionsPolicy.includes("resolveOwnerLiveAuditMarkerActions") ||
  !ownerLiveAuditMarkerActionsPolicy.includes("shouldRecord") ||
  !ownerLiveAuditMarkerPolicy.includes("resolveOwnerLiveAuditMarkerInput") ||
  !ownerLiveAuditMarkerPolicy.includes("role: \"owner\"") ||
  !ownerLiveAuditMarkerPolicy.includes("localEvidenceStatus") ||
  !packageJson.scripts["test:owner-live-audit-marker"] ||
  !packageJson.scripts["test:owner-live-audit-marker-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para payload de auditoria local do solicitante.");
}

if (
  !homeScreen.includes("resolveOwnerLiveEvidenceUpdate") ||
  !homeScreen.includes("resolveOwnerLiveVideoPreserveCompletionActions") ||
  !homeScreen.includes("resolveOwnerLiveVideoPreserveErrorActions") ||
  !homeScreen.includes("resolveOwnerLiveVideoPreserveRequest") ||
  !homeScreen.includes("resolveOwnerLiveVideoPreserveStoppedActions") ||
  !homeScreen.includes("resolveOwnerLiveVideoStartOutcomeActions") ||
  !homeScreen.includes("resolveOwnerLiveVideoStartRequest") ||
  !homeScreen.includes("resolveOwnerLiveVideoEvidenceStart") ||
  !homeScreen.includes("startDecision.startInput") ||
  !homeScreen.includes("resolveOwnerLiveCallLifecycleActions") ||
  !homeScreen.includes("resolveOwnerLiveCallLifecycle") ||
  !homeScreen.includes("lifecycleActions.evidenceUpdate") ||
  !ownerLiveCallLifecycleActionsPolicy.includes("resolveOwnerLiveCallLifecycleActions") ||
  !ownerLiveCallLifecycleActionsPolicy.includes("stopLiveVideoEvidenceReason") ||
  !ownerLiveEvidenceUpdatePolicy.includes("resolveOwnerLiveEvidenceUpdate") ||
  !ownerLiveEvidenceUpdatePolicy.includes("shouldUpdate") ||
  !ownerLiveVideoPreserveOutcomePolicy.includes("resolveOwnerLiveVideoPreserveCompletionActions") ||
  !ownerLiveVideoPreserveOutcomePolicy.includes("live_video_recording_preserve_error") ||
  !ownerLiveVideoPreserveOutcomePolicy.includes("verificationMode: \"bounded\"") ||
  !ownerLiveVideoPreserveRequestPolicy.includes("resolveOwnerLiveVideoPreserveRequest") ||
  !ownerLiveVideoPreserveRequestPolicy.includes("await_pending_start") ||
  !ownerLiveVideoStartOutcomePolicy.includes("resolveOwnerLiveVideoStartOutcomeActions") ||
  !ownerLiveVideoStartOutcomePolicy.includes("live_video_recording_start_error") ||
  !ownerLiveVideoStartRequestPolicy.includes("resolveOwnerLiveVideoStartRequest") ||
  !ownerLiveVideoStartRequestPolicy.includes("replace_active_recording") ||
  !ownerLiveEvidencePolicy.includes("resolveOwnerLiveVideoEvidenceStart") ||
  !ownerLiveEvidencePolicy.includes("resolveOwnerLiveCallLifecycle") ||
  !ownerLiveEvidencePolicy.includes("missing_remote_session") ||
  !ownerLiveEvidencePolicy.includes("missing_stream_tag") ||
  !ownerLiveEvidencePolicy.includes("inactive_status") ||
  !ownerLiveEvidencePolicy.includes("status_not_actionable") ||
  !packageJson.scripts["test:owner-live-evidence"] ||
  !packageJson.scripts["test:owner-live-call-lifecycle-actions"] ||
  !packageJson.scripts["test:owner-live-evidence-update"] ||
  !packageJson.scripts["test:owner-live-video-preserve-request"] ||
  !packageJson.scripts["test:owner-live-video-preserve-outcome"] ||
  !packageJson.scripts["test:owner-live-video-start-request"] ||
  !packageJson.scripts["test:owner-live-video-start-outcome"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para evidencia local da chamada do solicitante.");
}

if (
  !homeScreen.includes("resolveLiveCallCleanupActions") ||
  !homeScreen.includes("resolveLiveCallCleanupDecision") ||
  !homeScreen.includes("cleanupActions.liveCallAction") ||
  !liveCallCleanupActionsPolicy.includes("resolveLiveCallCleanupActions") ||
  !liveCallCleanupActionsPolicy.includes("shouldClearAutoCallState") ||
  !liveCallCleanupPolicy.includes("resolveLiveCallCleanupDecision") ||
  !liveCallCleanupPolicy.includes("nothing_to_cleanup") ||
  !liveCallCleanupPolicy.includes("reset_idle_call_state") ||
  !liveCallCleanupPolicy.includes("stop_active_call") ||
  !packageJson.scripts["test:live-call-cleanup"] ||
  !packageJson.scripts["test:live-call-cleanup-actions"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para limpeza de chamada ao vivo sem chamado ativo.");
}

if (
  !homeScreen.includes("resolveLiveCallPanelPolicy") ||
  !homeScreen.includes("liveCallPanel.shouldRenderPanel") ||
  !homeScreen.includes("liveCallPanel.primaryActionDisabled") ||
  !liveCallPanelPolicy.includes("resolveLiveCallPanelPolicy") ||
  !liveCallPanelPolicy.includes("shouldAvoidMediaRecorderPanel") ||
  !liveCallPanelPolicy.includes("shouldRenderStatusBand") ||
  !packageJson.scripts["test:live-call-panel"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para exibicao e entrada do painel de chamada ao vivo.");
}

if (
  !homeScreen.includes("resolveLiveCallWaitingDialogPresentation") ||
  !liveCallWaitingDialogPolicy.includes("resolveLiveCallWaitingDialogPresentation") ||
  !liveCallWaitingDialogPolicy.includes("Quando um anjo entrar") ||
  !packageJson.scripts["test:live-call-waiting-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para dialogo de chamada aguardando anjo.");
}

if (
  !homeScreen.includes("initialLocalSosPackageStatus") ||
  !homeScreen.includes("resolveLocalSosPackageStatus") ||
  !localSosPackageStatusPolicy.includes("resolveLocalSosPackageStatus") ||
  !localSosPackageStatusPolicy.includes("Pronto para pedir ajuda.") ||
  !localSosPackageStatusPolicy.includes("finish_requested") ||
  !localSosPackageStatusPolicy.includes("live_call_recording_preserved") ||
  !packageJson.scripts["test:local-sos-package-status"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para mensagens do pacote SOS local.");
}

if (
  !homeScreen.includes("resolveMediaHandoffPolicy") ||
  !homeScreen.includes("mediaHandoff.shouldPrepare") ||
  !homeScreen.includes("resolveMediaHandoffReleaseCompletionActions") ||
  !homeScreen.includes("resolveMediaHandoffReleaseWaitActions") ||
  !homeScreen.includes("resolveMediaHandoffStartActions") ||
  !mediaHandoffPolicy.includes("resolveMediaHandoffPolicy") ||
  !mediaHandoffPolicy.includes("owner_media_handoff_start") ||
  !mediaHandoffPolicy.includes("owner_media_handoff_complete") ||
  !mediaHandoffPolicy.includes("local_capture_not_requested") ||
  !mediaHandoffReleaseActionsPolicy.includes("resolveMediaHandoffReleaseCompletionActions") ||
  !mediaHandoffReleaseActionsPolicy.includes("emergency_live_call_media_handoff_camera_released") ||
  !mediaHandoffReleaseActionsPolicy.includes("skip_missing_stop_serial") ||
  !mediaHandoffStartActionsPolicy.includes("resolveMediaHandoffStartActions") ||
  !mediaHandoffStartActionsPolicy.includes("live_call_handoff") ||
  !packageJson.scripts["test:media-handoff"] ||
  !packageJson.scripts["test:media-handoff-release-actions"] ||
  !packageJson.scripts["test:media-handoff-start-actions"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para preparacao da midia antes da chamada ao vivo.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishOutcomeInput") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishOutcomePolicy") ||
  !finishOutcomeInputPolicy.includes("attachedAssetsAfterFinish") ||
  !finishOutcomeInputPolicy.includes("remoteFinishFailed") ||
  !finishOutcomePolicy.includes("resolveFinishOutcomePolicy") ||
  !finishOutcomePolicy.includes("camera_no_file_returned") ||
  !finishOutcomePolicy.includes("local_evidence_metadata_only") ||
  !finishOutcomePolicy.includes("Confirmacao pendente") ||
  !finishOutcomePolicy.includes("Video local pendente") ||
  !packageJson.scripts["test:finish-outcome-input"] ||
  !packageJson.scripts["test:finish-package-outcome-actions"] ||
  !packageJson.scripts["test:finish-outcome"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para resultado final do encerramento do chamado.");
}

if (
  !homeScreen.includes("resolveFinishRequestDecision") ||
  !homeScreen.includes("resolveFinishRequestConfirmationFormPatch") ||
  !homeScreen.includes("shouldFinishImmediatelyAfterRequest") ||
  !finishRequestPolicy.includes("resolveFinishRequestDecision") ||
  !finishRequestPolicy.includes("open_security_confirmation") ||
  !finishRequestPolicy.includes("finish_now") ||
  !finishRequestPolicy.includes("finish_ref_in_progress") ||
  !finishConfirmationFormPolicy.includes("resolveFinishRequestConfirmationFormPatch") ||
  !finishConfirmationFormPolicy.includes("shouldFinishImmediatelyAfterRequest") ||
  !packageJson.scripts["test:finish-request"] ||
  !packageJson.scripts["test:finish-confirmation-form"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para solicitacao de encerramento do chamado.");
}

if (
  !homeScreen.includes("resolveFinishActiveCallStart") ||
  !homeScreen.includes("resolveFinishActiveCallRuntimeStartActions") ||
  !homeScreen.includes("finishStartDecision.shouldStart") ||
  !finishActiveCallStartPolicy.includes("remoteSessionIdToFinish") ||
  !finishActiveCallStartPolicy.includes("mediaWasHandedToLiveCall") ||
  !finishActiveCallRuntimeStartPolicy.includes("shouldClearOwnerAutoCallSession") ||
  !finishActiveCallRuntimeStartPolicy.includes("emergency_finish_button_pressed") ||
  !homeScreen.includes("resolveFinishActiveCallRuntimeStateActions") ||
  !finishActiveCallRuntimeStateActionsPolicy.includes("ownerAutoCallSessionIdToClear") ||
  !finishActiveCallRuntimeStateActionsPolicy.includes("stopOwnerLiveVideoEvidenceReason") ||
  !packageJson.scripts["test:finish-active-call-runtime-state-actions"] ||
  !packageJson.scripts["test:finish-active-call-runtime-start"] ||
  !packageJson.scripts["test:finish-active-call-start"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para guarda inicial do encerramento ativo.");
}

if (
  !homeScreen.includes("resolveFinishFinallyCleanupActions") ||
  !finishFailureCleanupActionsPolicy.includes("resolveFinishActiveCallCleanup") ||
  !finishActiveCallCleanupPolicy.includes("shouldClearMediaStopPurpose") ||
  !finishActiveCallCleanupPolicy.includes("shouldClearMediaStopPending") ||
  !finishActiveCallCleanupPolicy.includes("shouldReleaseFinishInProgress") ||
  !packageJson.scripts["test:finish-active-call-cleanup"] ||
  !packageJson.scripts["test:finish-failure-cleanup-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para limpeza final do encerramento ativo.");
}

if (
  !homeScreen.includes("resolveFinishMediaStopRequestActions") ||
  !homeScreen.includes("resolveFinishMediaStopSignaledActions") ||
  !finishMediaStopRequestActionsPolicy.includes("resolveFinishMediaStopStartActions") ||
  !finishMediaStopRequestActionsPolicy.includes("shouldSignalMediaRecorderStop") ||
  !finishMediaStopStartPolicy.includes("shouldLockCaptureStop") ||
  !finishMediaStopStartPolicy.includes("shouldSetMediaStopPending") ||
  !finishMediaStopStartPolicy.includes("mediaRecorderPackageId") ||
  !packageJson.scripts["test:finish-media-stop-request-actions"] ||
  !packageJson.scripts["test:finish-media-stop-start"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para inicio da parada de midia no encerramento.");
}

if (
  !homeScreen.includes("resolveFinishMediaStopResultActions") ||
  !finishMediaStopResultPolicy.includes("shouldClearMediaStopPending") ||
  !finishMediaStopResultPolicy.includes("emergency_media_stop_progress_result") ||
  !packageJson.scripts["test:finish-media-stop-result"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para resultado da parada de midia no encerramento.");
}

if (
  !homeScreen.includes("resolveFinishRemoteSyncRequestActions") ||
  !homeScreen.includes("resolveFinishRemoteSyncDirectRetryActions") ||
  !homeScreen.includes("resolveFinishRemoteSyncDirectResultActions") ||
  !homeScreen.includes("resolveFinishRemoteSyncPendingResultActions") ||
  !homeScreen.includes("resolveFinishRemoteSyncCompletionActions") ||
  !finishRemoteSyncRequestActionsPolicy.includes("resolveFinishRemoteSyncStartActions") ||
  !finishRemoteSyncRequestActionsPolicy.includes("resolveFinishRemoteSyncMode") ||
  !finishRemoteSyncDirectActionsPolicy.includes("shouldRetryRemoteFinishAfterDirect") ||
  !finishRemoteSyncDirectActionsPolicy.includes("resolveRemoteFinishStateAfterDirect") ||
  !finishRemoteSyncCompletionActionsPolicy.includes("resolveRemoteFinishStateFromSync") ||
  !finishRemoteSyncCompletionActionsPolicy.includes("resolveRemoteFinishFailureLog") ||
  !finishRemoteSyncPolicy.includes("shouldQueueForRemoteSync") ||
  !finishRemoteSyncPolicy.includes("direct_finish") ||
  !finishRemoteSyncPolicy.includes("pending_sync") ||
  !finishRemoteSyncPolicy.includes("shouldRetryRemoteFinishAfterDirect") ||
  !finishRemoteSyncPolicy.includes("emergency_remote_finish_sync_error") ||
  !packageJson.scripts["test:finish-remote-sync"] ||
  !packageJson.scripts["test:finish-remote-sync-request-actions"] ||
  !packageJson.scripts["test:finish-remote-sync-direct-actions"] ||
  !packageJson.scripts["test:finish-remote-sync-completion-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para sincronizacao remota final do encerramento.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishPackageResult") ||
  !finishPackageResultPolicy.includes("attachedAssetsAfterFinish") ||
  !finishPackageResultPolicy.includes("emergency_finish_package_result") ||
  !finishPackageResultPolicy.includes("mediaRecorded") ||
  !packageJson.scripts["test:finish-package-result"] ||
  !packageJson.scripts["test:finish-package-outcome-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para resumo do pacote finalizado.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishOwnerCompletionActions") ||
  !finishOwnerCompletionPolicy.includes("resolveFinishOwnerLiveEvidenceUpdate") ||
  !finishOwnerCompletionPolicy.includes("resolveFinishOwnerLiveAuditMarker") ||
  !finishOwnerLiveEvidencePolicy.includes("localEvidenceStatus") ||
  !finishOwnerLiveEvidencePolicy.includes("status: input.localEvidenceStatus") ||
  !packageJson.scripts["test:finish-owner-completion"] ||
  !packageJson.scripts["test:finish-owner-live-evidence"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para evidencia owner final do encerramento.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishOwnerCompletionActions") ||
  !finishOwnerCompletionPolicy.includes("resolveFinishOwnerLiveAuditMarker") ||
  !finishOwnerLiveAuditPolicy.includes('connectionState: "ended"') ||
  !finishOwnerLiveAuditPolicy.includes("localEvidenceStatus") ||
  !packageJson.scripts["test:finish-owner-completion"] ||
  !packageJson.scripts["test:finish-owner-live-audit"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para auditoria owner final do encerramento.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishPostOutcomeActions") ||
  !finishPostOutcomeActionsPolicy.includes("resolveFinishNoMediaDiagnosticRequest") ||
  !finishPostOutcomeActionsPolicy.includes("resolveFinishCompletionActions") ||
  !finishNoMediaDiagnosticPolicy.includes("shouldPersist") ||
  !finishNoMediaDiagnosticPolicy.includes("camera_no_file_returned") ||
  !packageJson.scripts["test:finish-post-outcome"] ||
  !packageJson.scripts["test:finish-no-media-diagnostic"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para diagnostico sem midia no encerramento.");
}

if (
  !homeScreen.includes("resolveFinishPackageOutcomeActions") ||
  !homeScreen.includes("resolveFinishCompletionConfirmationFormPatch") ||
  !finishPackageOutcomeActionsPolicy.includes("resolveFinishPostOutcomeActions") ||
  !finishPostOutcomeActionsPolicy.includes("resolveFinishCompletionActions") ||
  !finishConfirmationFormPolicy.includes("resolveFinishCompletionConfirmationFormPatch") ||
  !finishCompletionActionsPolicy.includes("shouldCloseFinishConfirmation") ||
  !finishCompletionActionsPolicy.includes("shouldClearFinishCodeInput") ||
  !finishCompletionActionsPolicy.includes("shouldClearFinishError") ||
  !packageJson.scripts["test:finish-post-outcome"] ||
  !packageJson.scripts["test:finish-confirmation-form"] ||
  !packageJson.scripts["test:finish-completion-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para acoes finais do encerramento.");
}

if (
  !homeScreen.includes("resolveFinishMissingPackageBranchActions") ||
  !finishMissingPackageBranchActionsPolicy.includes("resolveFinishMissingPackageActions") ||
  !finishMissingPackageBranchActionsPolicy.includes("shouldReturnAfterApply") ||
  !finishMissingPackagePolicy.includes("shouldShowMissingPackageProgress") ||
  !finishMissingPackagePolicy.includes("finish_missing_package") ||
  !packageJson.scripts["test:finish-missing-package"] ||
  !packageJson.scripts["test:finish-missing-package-branch-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para pacote ausente no encerramento.");
}

if (
  !homeScreen.includes("resolveFinishFailureRuntimeActions") ||
  !homeScreen.includes("resolveFinishFinallyCleanupActions") ||
  !finishFailureCleanupActionsPolicy.includes("resolveFinishFailureActions") ||
  !finishFailureCleanupActionsPolicy.includes("resolveFinishActiveCallCleanup") ||
  !finishFailureActionsPolicy.includes("emergency_finish_package_error") ||
  !finishFailureActionsPolicy.includes("finish_failed") ||
  !packageJson.scripts["test:finish-failure-actions"] ||
  !packageJson.scripts["test:finish-failure-cleanup-actions"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para falha controlada no encerramento.");
}

if (
  !homeScreen.includes("resolveFinishCodeConfirmationDecision") ||
  !homeScreen.includes("resolveFinishCodeConfirmationActions") ||
  !finishCodePolicy.includes("resolveFinishCodeConfirmationDecision") ||
  !finishCodePolicy.includes("Codigo de seguranca nao verificado.") ||
  !finishCodePolicy.includes("O chamado continua ativo.") ||
  !finishCodeConfirmationActionsPolicy.includes("resolveFinishCodeConfirmationActions") ||
  !finishCodeConfirmationActionsPolicy.includes("shouldFinishActiveCall") ||
  !finishCodeConfirmationActionsPolicy.includes("finishError") ||
  !packageJson.scripts["test:finish-code"] ||
  !packageJson.scripts["test:finish-code-confirmation-actions"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para confirmacao e acao de encerramento por codigo.");
}

if (
  !homeScreen.includes("resolveFinishConfirmationDialogPresentation") ||
  !finishConfirmationDialogPolicy.includes("resolveFinishConfirmationDialogPresentation") ||
  !finishConfirmationDialogPolicy.includes("Encerrar chamado") ||
  !packageJson.scripts["test:finish-confirmation-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para apresentacao do dialogo de encerramento por codigo.");
}

if (
  !homeScreen.includes("resolveProtectedRouteAccessDecision") ||
  !protectedRouteAccessPolicy.includes("resolveProtectedRouteAccessDecision") ||
  !protectedRouteAccessPolicy.includes("request_security_code") ||
  !packageJson.scripts["test:protected-route-access"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para acesso inicial a rotas protegidas.");
}

if (
  !homeScreen.includes("resolveProtectedRouteCodeDecision") ||
  !homeScreen.includes("resolveProtectedRouteUnlockActions") ||
  !homeScreen.includes("resolveProtectedRouteRequestFormPatch") ||
  !homeScreen.includes("resolveProtectedRouteClosedFormPatch") ||
  !protectedRouteCodePolicy.includes("resolveProtectedRouteCodeDecision") ||
  !protectedRouteCodePolicy.includes("ignore_missing_request") ||
  !protectedRouteCodePolicy.includes("unlock_and_navigate") ||
  !protectedRouteCodePolicy.includes("Area protegida bloqueada.") ||
  !protectedRouteUnlockActionsPolicy.includes("resolveProtectedRouteUnlockActions") ||
  !protectedRouteUnlockActionsPolicy.includes("resolveProtectedRouteAcceptedFormPatch") ||
  !protectedRouteUnlockActionsPolicy.includes("resolveProtectedRouteErrorFormPatch") ||
  !protectedRouteUnlockActionsPolicy.includes("shouldUnlockProtectedAccess") ||
  !protectedRouteFormPolicy.includes("resolveProtectedRouteRequestFormPatch") ||
  !protectedRouteFormPolicy.includes("resolveProtectedRouteAcceptedFormPatch") ||
  !protectedRouteFormPolicy.includes("resolveProtectedRouteClosedFormPatch") ||
  !protectedRouteFormPolicy.includes("resolveProtectedRouteErrorFormPatch") ||
  !packageJson.scripts["test:protected-route-code"] ||
  !packageJson.scripts["test:protected-route-unlock-actions"] ||
  !packageJson.scripts["test:protected-route-form"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para decisao e acao de rotas protegidas por codigo.");
}

if (
  !homeScreen.includes("resolveProtectedRouteDialogPresentation") ||
  !protectedRouteDialogPolicy.includes("resolveProtectedRouteDialogPresentation") ||
  !protectedRouteDialogPolicy.includes("Codigo para abrir area protegida") ||
  !packageJson.scripts["test:protected-route-dialog"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para apresentacao do dialogo de rota protegida.");
}

if (
  !homeScreen.includes("resolveEmergencyHomeNavigationTarget") ||
  !homeNavigationPolicy.includes("resolveEmergencyHomeNavigationTarget") ||
  !homeNavigationPolicy.includes("with_panel") ||
  !homeNavigationPolicy.includes("painel") ||
  !packageJson.scripts["test:home-navigation"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para decisao de navegacao com painel.");
}

if (
  !homeScreen.includes("resolveMediaProcessingPresentation") ||
  !homeScreen.includes("shouldResolveMediaReleaseWaiter") ||
  !homeScreen.includes("resolveMediaStopSettledActions") ||
  !mediaStopSettledActionsPolicy.includes("shouldHandleMediaStopSettlement") ||
  !mediaStopSettledActionsPolicy.includes("resolveMediaStopSettlementPresentation") ||
  !homeScreen.includes("resolveMediaStopSettlementFinishProgress") ||
  !mediaProcessingStatusPolicy.includes("resolveFinishMediaProcessingPresentation") ||
  !mediaProcessingStatusPolicy.includes("resolveLiveCallHandoffMediaStatus") ||
  !mediaProcessingStatusPolicy.includes("shouldHandleMediaStopSettlement") ||
  !mediaProcessingStatusPolicy.includes("resolveMediaStopSettlementPresentation") ||
  !mediaProcessingStatusPolicy.includes("resolveMediaStopSettlementFinishProgress") ||
  !mediaProcessingStatusPolicy.includes("Midia protegida e cofre atualizado.") ||
  !mediaProcessingStatusPolicy.includes("Video finalizado e preservado no cofre local.") ||
  !mediaProcessingStatusPolicy.includes("Falha tecnica saneada durante a preservacao") ||
  !packageJson.scripts["test:media-processing-status"]
) {
  throw new Error("Home/SOS precisa manter politica pura testavel para mensagens de processamento de midia.");
}

if (
  !homeScreen.includes("resolveMediaStopPendingState") ||
  !mediaStopPendingPolicy.includes("resolveMediaStopPendingState") ||
  !mediaStopPendingPolicy.includes("shouldClearMediaRecorderPackageId") ||
  !packageJson.scripts["test:media-stop-pending"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para estado de midia pendente.");
}

if (
  !homeScreen.includes("resolveMediaStopSignal") ||
  !mediaStopSignalPolicy.includes("resolveMediaStopSignal") ||
  !mediaStopSignalPolicy.includes("emergency_media_stop_signal") ||
  !mediaStopSignalPolicy.includes("requestLocalVideoOnSos") ||
  !packageJson.scripts["test:media-stop-signal"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para sinalizacao de parada do recorder.");
}

if (
  !homeScreen.includes("resolveMediaStopSettledActions") ||
  !homeScreen.includes("resolveMediaStopPendingRequestCompletion") ||
  !mediaStopSettledActionsPolicy.includes("resolveMediaStopSettlementLog") ||
  !mediaStopPendingRequestCompletionPolicy.includes("shouldClearTimeout") ||
  !mediaStopPendingRequestCompletionPolicy.includes("shouldClearPendingRequest") ||
  !mediaStopSettlementRequestPolicy.includes("resolveMediaStopSettlementLog") ||
  !mediaStopSettlementRequestPolicy.includes("resolvePendingMediaStopRequestSettlement") ||
  !mediaStopSettlementRequestPolicy.includes("emergency_media_stop_settled") ||
  !packageJson.scripts["test:media-stop-settled-actions"] ||
  !packageJson.scripts["test:media-stop-pending-request-completion"] ||
  !packageJson.scripts["test:media-stop-settlement-request"]
) {
  throw new Error("Home/SOS precisa manter policy pura testavel para settlement da requisicao de parada do recorder.");
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

if (
  !emergencyPreferences.includes("schemaVersion: 9") ||
  !emergencyPreferences.includes("call190ShortcutEnabled: true") ||
  !emergencyPreferences.includes('cameraMode: "back"') ||
  !emergencyPreferences.includes("storedSchemaVersion < 9")
) {
  throw new Error("Preferencias precisam migrar para camera traseira do SOS e atalhos oficiais ativos por padrao.");
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
const apiClient = [
  await readFile("src/services/apiClient.ts", "utf8"),
  await readFile("src/services/api/authClient.ts", "utf8"),
  await readFile("src/services/api/contactsClient.ts", "utf8"),
  await readFile("src/services/api/contracts.ts", "utf8"),
  await readFile("src/services/api/core.ts", "utf8"),
  await readFile("src/services/api/devicesClient.ts", "utf8"),
  await readFile("src/services/api/emergencyClient.ts", "utf8"),
  await readFile("src/services/api/profilesClient.ts", "utf8"),
  await readFile("src/services/api/releasesClient.ts", "utf8"),
  await readFile("src/services/api/sessionStore.ts", "utf8"),
  await readFile("src/services/api/utils.ts", "utf8")
].join("\n");
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
  !settingsScreen.includes("buildSettingsLoginPanelState") ||
  !settingsScreen.includes("handleLoginPanelAction") ||
  !settingsPresentationPolicy.includes("Dispositivo autenticado registrado") ||
  !settingsPresentationPolicy.includes("\"validate-session\"") ||
  !settingsScreen.includes("clearRegisteredDeviceSession")
) {
  throw new Error("Login precisa registrar dispositivo, sincronizar consentimentos e limpar vinculo remoto no logout.");
}

if (
  !settingsScreen.includes("buildSettingsUpdatePanelState") ||
  !settingsScreen.includes("handleUpdatePanelAction") ||
  !settingsPresentationPolicy.includes("\"verify-update\"") ||
  !settingsPresentationPolicy.includes("\"download-update\"")
) {
  throw new Error("Atualizacao precisa manter a policy de acoes e os handlers reais no painel Configuracoes.");
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
process.exit(0);
