import { ReactNode, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Archive, BookOpen, CirclePlay, HelpCircle, LockKeyhole, MapPinned, RefreshCw, Share2, Trash2 } from "lucide-react-native";
import { AppTopBar } from "@/components/AppTopBar";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { EvidencePlayerCard } from "@/components/EvidencePlayerCard";
import { LocalEvidenceRail } from "@/components/LocalEvidenceRail";
import { ProtectedAccessGate } from "@/components/ProtectedAccessGate";
import { ResourceTile } from "@/components/ResourceTile";
import { theme } from "@/design/theme";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyHomePanel, EmergencyHomeRoute } from "@/features/emergency-home/routes";
import { deleteEmergencyPackage, listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { buildPackageMapLinks, buildTelemetrySummary } from "@/features/emergency/packagePresentation";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { finishEmergencyPackage, getActiveEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { runPlaintextMediaStorageMaintenance } from "@/features/emergency/PlaintextMediaResidueCleaner";
import { cleanupNativeMediaResidues } from "@/features/emergency/SinalSeguroMediaEngine";
import { EmergencyPackage } from "@/features/emergency/types";
import { isProtectedAccessUnlocked, verifySecurityCodeStatus } from "@/security/protectedAccess";
import { formatAppVersion } from "@/services/appUpdate";
import { checkAppUpdate } from "@/services/appUpdateService";

type VaultDialog = "player" | "cofre" | null;
type MapChoice = "platform" | "google";

type LocalDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  actions: BrandedDialogAction[];
};

export default function LocalFilesScreen() {
  const params = useLocalSearchParams<{ painel?: EmergencyHomePanel }>();
  const [packages, setPackages] = useState<EmergencyPackage[]>([]);
  const [packagesRefreshing, setPackagesRefreshing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [expandedPackageId, setExpandedPackageId] = useState<string | undefined>();
  const [activeDialog, setActiveDialog] = useState<VaultDialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Carregando arquivos locais...");
  const [dialog, setDialog] = useState<LocalDialog | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [finishPackageId, setFinishPackageId] = useState<string | null>(null);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishError, setFinishError] = useState("");
  const [mapPackage, setMapPackage] = useState<EmergencyPackage | null>(null);
  const [helpDialog, setHelpDialog] = useState<LocalDialog | null>(null);
  const [accessReady, setAccessReady] = useState(false);
  const [accessGateVisible, setAccessGateVisible] = useState(false);

  async function refreshPackages(nextStatus?: string) {
    setPackagesRefreshing(true);
    try {
      const records = await listEmergencyPackages();
      setPackages(records);
      setSelectedPackageId((currentSelectedId) => {
        if (!records.length) return undefined;
        if (currentSelectedId && records.some((record) => record.id === currentSelectedId)) return currentSelectedId;
        return records[0].id;
      });
      setExpandedPackageId((currentExpandedId) => {
        if (currentExpandedId && records.some((record) => record.id === currentExpandedId)) return currentExpandedId;
        return undefined;
      });
      setStatus(nextStatus ?? (records.length ? "Arquivos carregados." : "Nenhum arquivo local neste dispositivo."));
    } finally {
      setPackagesRefreshing(false);
    }
  }

  useEffect(() => {
    async function bootScreen() {
      const nextPreferences = await getEmergencyPreferences();
      setPreferences(nextPreferences);

      if (nextPreferences.finishSafety.requireCode && !(await isProtectedAccessUnlocked())) {
        setAccessGateVisible(true);
      }

      setAccessReady(true);
      const activePackage = await getActiveEmergencyPackage();
      setStatus(activePackage ? "Chamado ativo detectado. Volte ao SOS para finalizar a recuperacao." : "Verificando residuos de midia local...");
      const maintenance = activePackage
        ? null
        : await cleanupNativeMediaResidues()
            .then(() => runPlaintextMediaStorageMaintenance())
            .catch(() => null);
      const maintenanceStatus = maintenance
        ? maintenance.migrationBlockedCount > 0 || maintenance.blockedReferencedCount > 0
          ? "Arquivos carregados. Ha midia clara legada referenciada que exige nova tentativa de migracao."
          : maintenance.migratedReferencedCount > 0 || maintenance.deletedCount > 0
            ? "Arquivos carregados. Midia legada foi protegida ou removida."
            : undefined
        : activePackage
          ? "Volte ao SOS para recuperar o chamado ativo antes da limpeza."
          : "Arquivos carregados. Nao foi possivel concluir a verificacao de residuos.";
      await refreshPackages(maintenanceStatus);
    }

    void bootScreen();
  }, []);

  useEffect(() => {
    if (params.painel === "player" || params.painel === "cofre") {
      setActiveDialog(params.painel);
    }
  }, [params.painel]);

  useEffect(() => {
    if (activeDialog === "player" || activeDialog === "cofre") {
      void refreshPackages();
    }
  }, [activeDialog]);

  async function finishPackageNow(packageId: string) {
    const result = await finishEmergencyPackage(packageId, "manual_finish");
    await refreshPackages();

    if (!result) {
      setStatus("Nenhum chamado ativo encontrado para finalizar.");
      return;
    }

    setStatus("Chamado finalizado e preservado no cofre local.");
  }

  function requestFinishPackage(packageId: string) {
    setActiveDialog(null);
    setDialog(null);
    setFinishError("");
    setFinishCodeInput("");
    setFinishPackageId(packageId);
  }

  function closeFinishDialog() {
    setFinishPackageId(null);
    setFinishCodeInput("");
    setFinishError("");
  }

  async function confirmFinishPackage() {
    if (!finishPackageId) return;

    if (preferences.finishSafety.requireCode) {
      const verification = await verifySecurityCodeStatus(preferences, finishCodeInput);
      if (!verification.ok) {
        setFinishError(`${verification.message} O chamado continua ativo.`);
        return;
      }
    }

    const packageId = finishPackageId;
    closeFinishDialog();
    await finishPackageNow(packageId);
  }

  function selectPackage(packageRecord: EmergencyPackage) {
    setSelectedPackageId(packageRecord.id);
    setStatus("Arquivo selecionado.");
  }

  function openMenuRoute(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    setMenuOpen(false);
    if (route === "/arquivos") {
      setActiveDialog(panel ?? (selectedPackage ? "player" : "cofre"));
      return;
    }
    router.push(route);
  }

  function openPackageInPlayer(packageRecord: EmergencyPackage) {
    selectPackage(packageRecord);
    setActiveDialog("player");
  }

  async function checkForAppUpdates() {
    setStatus("Consultando atualizacoes no servico SinalSeguro...");
    const result = await checkAppUpdate();
    setStatus(result.message);
    setDialog({
      title: "Atualizacoes do app",
      message: result.latestVersion
        ? `${result.message}\n\nInstalada: ${formatAppVersion(result.currentVersion, result.currentVersionCode)}\nDisponivel: ${formatAppVersion(result.latestVersion, result.latestVersionCode)}`
        : `${result.message}\n\nInstalada: ${formatAppVersion(result.currentVersion, result.currentVersionCode)}`,
      icon: <RefreshCw size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function togglePackageActions(packageRecord: EmergencyPackage) {
    setExpandedPackageId((currentPackageId) => (currentPackageId === packageRecord.id ? undefined : packageRecord.id));
  }

  function showShareBlocked(packageRecord: EmergencyPackage) {
    setDialog({
      title: "Compartilhar pelo app",
      message: "O compartilhamento protegido sera liberado apenas para pessoas autorizadas dentro do SinalSeguro.",
      icon: <Share2 size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function showVaultHelp() {
    setHelpDialog({
      title: "Cofre local",
      message:
        "O cofre guarda arquivos deste aparelho. Toque em um item para visualizar, abrir mapa, compartilhar pelo app quando liberado ou excluir localmente.",
      icon: <HelpCircle size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function showPlayerHelp() {
    setHelpDialog({
      title: "Player seguro",
      message:
        "O player mostra a midia do arquivo selecionado e seus dados principais. Quando ainda nao houver video, abra o cofre e escolha outro item.",
      icon: <HelpCircle size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function openPackageMap(packageRecord: EmergencyPackage) {
    const links = buildPackageMapLinks(packageRecord);

    if (!links) {
      setDialog({
        title: "Sem localizacao",
        message: "Este arquivo nao possui localizacao preservada para abrir no mapa.",
        icon: <MapPinned size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      return;
    }

    setMapPackage(packageRecord);
  }

  function getPlatformMapUrl(links: NonNullable<ReturnType<typeof buildPackageMapLinks>>) {
    if (Platform.OS === "ios") return links.apple;
    if (Platform.OS === "android") return links.geo;
    return links.google;
  }

  async function openFirstAvailableMapUrl(urls: string[]) {
    for (const url of urls) {
      try {
        if (Platform.OS !== "web") {
          const canOpenUrl = await Linking.canOpenURL(url);
          if (!canOpenUrl) continue;
        }

        await Linking.openURL(url);
        return;
      } catch {
        continue;
      }
    }

    setDialog({
      title: "Mapa indisponivel",
      message: "Nao foi possivel abrir o aplicativo de mapa neste dispositivo.",
      icon: <MapPinned size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  async function openMapChoice(choice: MapChoice) {
    const links = mapPackage ? buildPackageMapLinks(mapPackage) : null;
    if (!links) return;

    const platformUrl = getPlatformMapUrl(links);
    await openFirstAvailableMapUrl(choice === "platform" ? [platformUrl, links.google] : [links.google]);
  }

  async function deleteLocalPackage(packageRecord: EmergencyPackage) {
    try {
      await deleteEmergencyPackage(packageRecord.id);
      setSelectedPackageId((currentSelectedId) =>
        currentSelectedId === packageRecord.id ? undefined : currentSelectedId
      );
      setExpandedPackageId((currentExpandedId) =>
        currentExpandedId === packageRecord.id ? undefined : currentExpandedId
      );
      await refreshPackages();
      setStatus("Arquivo removido deste dispositivo.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o arquivo. Revise o cofre e tente novamente.";
      setDialog({
        title: "Exclusao nao concluida",
        message,
        icon: <LockKeyhole size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      setStatus(message);
    }
  }

  function confirmDeleteLocalPackage(packageRecord: EmergencyPackage) {
    if (packageRecord.status === "recording_local") {
      setDialog({
        title: "Finalize o chamado antes",
        message: "Finalize o chamado antes de excluir o arquivo.",
        icon: <LockKeyhole size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      return;
    }

    setDialog({
      title: "Excluir arquivo local?",
      message: "O arquivo sera removido apenas deste dispositivo. Esta acao nao pode ser desfeita.",
      icon: <Trash2 size={18} color={theme.colors.danger} />,
      actions: [
        { label: "Cancelar", tone: "muted" },
        {
          label: "Excluir",
          tone: "danger",
          onPress: () => {
            void deleteLocalPackage(packageRecord);
          }
        }
      ]
    });
  }

  const selectedPackage = packages.find((packageRecord) => packageRecord.id === selectedPackageId);
  const topBarContextLabel = activeDialog === "player" ? "Player seguro" : "Cofre local";
  const platformMapLabel = Platform.OS === "ios" ? "Maps" : Platform.OS === "android" ? "Maps" : "Mapa";
  const mapDialogMessage = mapPackage
    ? `${buildTelemetrySummary(mapPackage).join("\n")}\n\nAo abrir um mapa externo, a localizacao exata deste registro sera enviada ao app ou servico escolhido.`
    : "";
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell} testID="local-files-screen">
        <AppTopBar
          contextLabel={topBarContextLabel}
          menuIcon="settings"
          menuOpen={menuOpen}
          onMenuPress={() => setMenuOpen((current) => !current)}
          showBack
          showMenu
        />

        {menuOpen ? (
          <>
            <Pressable
              accessibilityLabel="Fechar menu"
              onPress={() => setMenuOpen(false)}
              style={styles.menuBackdrop}
            />
            <EmergencySettingsDrawer onNavigate={openMenuRoute} />
          </>
        ) : null}

        <View style={styles.content}>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<CirclePlay size={24} color={theme.colors.primary} />}
              label="Player"
              description="Rever"
              onPress={() => setActiveDialog("player")}
            />
            <ResourceTile
              icon={<Archive size={24} color={theme.colors.primary} />}
              label="Cofre"
              description="Arquivos"
              onPress={() => setActiveDialog("cofre")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<BookOpen size={24} color={theme.colors.primary} />}
              label="Funcionamento"
              description="Privacidade"
              onPress={() => router.push("/funcionamento")}
            />
            <ResourceTile
              icon={<RefreshCw size={24} color={theme.colors.primary} />}
              label="Atualizar app"
              description="Atualizacoes"
              onPress={checkForAppUpdates}
            />
          </View>
        </View>

        <BrandedDialog
          actions={[
            { label: "Fechar", tone: "muted" },
            { autoClose: false, label: "Abrir cofre", onPress: () => setActiveDialog("cofre") }
          ]}
          icon={<CirclePlay size={18} color={theme.colors.primary} />}
          helpLabel="Ajuda do player"
          onHelpPress={showPlayerHelp}
          onClose={() => setActiveDialog(null)}
          title="Player seguro"
          visible={activeDialog === "player"}
        >
          <EvidencePlayerCard packageRecord={selectedPackage} />
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Archive size={18} color={theme.colors.primary} />}
          helpLabel="Ajuda do cofre"
          onHelpPress={showVaultHelp}
          onClose={() => setActiveDialog(null)}
          title="Cofre local"
          visible={activeDialog === "cofre"}
        >
          <LocalEvidenceRail
            expandedPackageId={expandedPackageId}
            loading={packagesRefreshing}
            onDeletePackage={confirmDeleteLocalPackage}
            onFinishPackage={requestFinishPackage}
            onOpenMapPackage={openPackageMap}
            onOpenPlayerPackage={openPackageInPlayer}
            onSelectPackage={selectPackage}
            onShareBlocked={showShareBlocked}
            onToggleActions={togglePackageActions}
            packages={packages}
            selectedPackageId={selectedPackageId}
          />
        </BrandedDialog>

        <BrandedDialog
          actions={[
            { label: "Cancelar", tone: "muted" },
            {
              autoClose: false,
              label: "Encerrar",
              tone: "danger",
              onPress: () => {
                void confirmFinishPackage();
              }
            }
          ]}
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          helpLabel="Ajuda para encerrar"
          onHelpPress={() =>
            setHelpDialog({
              title: "Encerrar chamado",
              message:
                "Encerrar finaliza apenas o chamado ativo. Os arquivos ja salvos continuam no cofre local, a menos que voce exclua depois.",
              icon: <LockKeyhole size={18} color={theme.colors.primary} />,
              actions: [{ label: "Entendi" }]
            })
          }
          message={
            preferences.finishSafety.requireCode
              ? "Informe o codigo de encerramento configurado para impedir que outra pessoa finalize o chamado sem autorizacao."
              : "O pacote sera encerrado e preservado no cofre local. Nenhuma evidencia sera apagada."
          }
          onClose={closeFinishDialog}
          title="Encerrar chamado ativo?"
          visible={Boolean(finishPackageId)}
        >
          {preferences.finishSafety.requireCode ? (
            <>
              <TextInput
                accessibilityLabel="Codigo para encerrar chamado pelo cofre"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                onChangeText={setFinishCodeInput}
                placeholder="Codigo de encerramento"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                style={styles.codeInput}
                value={finishCodeInput}
              />
              {finishError ? <Text style={styles.finishError}>{finishError}</Text> : null}
            </>
          ) : null}
        </BrandedDialog>

        <BrandedDialog
          actions={dialog?.actions ?? []}
          icon={dialog?.icon}
          message={dialog?.message}
          onClose={() => setDialog(null)}
          title={dialog?.title ?? ""}
          visible={Boolean(dialog)}
        />

        <BrandedDialog
          actions={[
            { label: "Fechar", tone: "muted" },
            {
              label: platformMapLabel,
              onPress: () => {
                void openMapChoice("platform");
              }
            },
            {
              label: "Google Maps",
              onPress: () => {
                void openMapChoice("google");
              }
            }
          ]}
          icon={<MapPinned size={18} color={theme.colors.primary} />}
          message={mapDialogMessage}
          onClose={() => setMapPackage(null)}
          title="Abrir localizacao"
          visible={Boolean(mapPackage)}
        />

        <BrandedDialog
          actions={helpDialog?.actions ?? []}
          icon={helpDialog?.icon}
          message={helpDialog?.message}
          onClose={() => setHelpDialog(null)}
          title={helpDialog?.title ?? ""}
          visible={Boolean(helpDialog)}
        />

        <ProtectedAccessGate
          message="Informe o codigo para abrir o cofre."
          onCancel={() => router.replace("/")}
          onUnlocked={() => setAccessGateVisible(false)}
          preferences={preferences}
          visible={accessReady && accessGateVisible}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    minHeight: 50,
    paddingHorizontal: theme.spacing.md
  },
  content: {
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: "center",
    padding: theme.spacing.lg
  },
  finishError: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 20
  },
  resourceGrid: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  shell: {
    backgroundColor: theme.colors.background,
    flex: 1,
    overflow: "hidden"
  }
});
