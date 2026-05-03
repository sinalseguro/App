import { ReactNode, useEffect, useState } from "react";
import { router } from "expo-router";
import * as Crypto from "expo-crypto";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Archive, BookOpen, CirclePlay, LockKeyhole, RefreshCw, Share2, Trash2 } from "lucide-react-native";
import { AppTopBar } from "@/components/AppTopBar";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { ButtonIcon } from "@/components/ButtonIcon";
import { EvidencePlayerCard } from "@/components/EvidencePlayerCard";
import { LocalEvidenceRail } from "@/components/LocalEvidenceRail";
import { ResourceTile } from "@/components/ResourceTile";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { deleteEmergencyPackage, listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { finishEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { EmergencyPackage } from "@/features/emergency/types";
import { checkAppUpdate } from "@/services/appUpdateService";

type VaultDialog = "player" | "cofre" | null;

type LocalDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  actions: BrandedDialogAction[];
};

export default function LocalFilesScreen() {
  const [packages, setPackages] = useState<EmergencyPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [expandedPackageId, setExpandedPackageId] = useState<string | undefined>();
  const [activeDialog, setActiveDialog] = useState<VaultDialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Carregando pacotes locais...");
  const [dialog, setDialog] = useState<LocalDialog | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [finishPackageId, setFinishPackageId] = useState<string | null>(null);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishError, setFinishError] = useState("");

  async function refreshPackages() {
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
    setStatus(
      records.length
        ? "Cofre local carregado. Visualizacao local ativa; compartilhamento externo segue bloqueado neste build."
        : "Nenhum pacote local gravado neste dispositivo."
    );
  }

  useEffect(() => {
    void refreshPackages();
    void getEmergencyPreferences().then(setPreferences);
  }, []);

  async function finishPackageNow(packageId: string) {
    const result = await finishEmergencyPackage(packageId, "manual_finish");
    await refreshPackages();

    if (!result) {
      setStatus("Nenhum chamado ativo encontrado para finalizar.");
      return;
    }

    setStatus(`Chamado ${packageId.slice(0, 8)} finalizado e preservado no cofre local.`);
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
      const codeHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, finishCodeInput.trim());

      if (codeHash !== preferences.finishSafety.codeHash) {
        setFinishError("Codigo incorreto. O chamado continua ativo.");
        return;
      }
    }

    const packageId = finishPackageId;
    closeFinishDialog();
    await finishPackageNow(packageId);
  }

  function selectPackage(packageRecord: EmergencyPackage) {
    setSelectedPackageId(packageRecord.id);
    setStatus(`Pacote ${packageRecord.id.slice(0, 8)} selecionado para previa segura no player.`);
  }

  function openPackageInPlayer(packageRecord: EmergencyPackage) {
    selectPackage(packageRecord);
    setActiveDialog("player");
  }

  async function checkForAppUpdates() {
    setStatus("Consultando atualizacoes do app na API SinalSeguro...");
    const result = await checkAppUpdate();
    setStatus(result.message);
    setDialog({
      title: "Atualizacoes do app",
      message: result.latestVersion
        ? `${result.message}\n\nVersao instalada: ${result.currentVersion}\nVersao API: ${result.latestVersion}`
        : `${result.message}\n\nVersao instalada: ${result.currentVersion}`,
      icon: <RefreshCw size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function togglePackageActions(packageRecord: EmergencyPackage) {
    setExpandedPackageId((currentPackageId) => (currentPackageId === packageRecord.id ? undefined : packageRecord.id));
  }

  function showShareBlocked(packageRecord: EmergencyPackage) {
    setDialog({
      title: "Compartilhamento interno futuro",
      message: `Pacote ${packageRecord.id.slice(0, 8)} so podera ser compartilhado por rota interna autenticada, com contrato, chaves e auditoria. Nenhum share externo foi aberto.`,
      icon: <Share2 size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  async function deleteLocalPackage(packageRecord: EmergencyPackage) {
    await deleteEmergencyPackage(packageRecord.id);
    setSelectedPackageId((currentSelectedId) => (currentSelectedId === packageRecord.id ? undefined : currentSelectedId));
    setExpandedPackageId((currentExpandedId) => (currentExpandedId === packageRecord.id ? undefined : currentExpandedId));
    await refreshPackages();
    setStatus(`Pacote ${packageRecord.id.slice(0, 8)} removido deste dispositivo com arquivos locais e auditoria de exclusao.`);
  }

  function confirmDeleteLocalPackage(packageRecord: EmergencyPackage) {
    if (packageRecord.status === "recording_local") {
      setDialog({
        title: "Finalize o chamado antes",
        message: "Um chamado ativo nao pode ser excluido. Finalize o chamado e revise o pacote no cofre local.",
        icon: <LockKeyhole size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      return;
    }

    setDialog({
      title: "Excluir pacote local?",
      message: `O pacote ${packageRecord.id.slice(0, 8)} sera removido apenas deste dispositivo. A acao registra auditoria local e nao pode ser desfeita neste build.`,
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell} testID="local-files-screen">
        <AppTopBar
          contextLabel="Cofre local"
          menuOpen={menuOpen}
          onMenuPress={() => setMenuOpen((current) => !current)}
          showBack
          showMenu
        />

        {menuOpen ? (
          <View style={styles.drawer}>
            <StatusBanner tone="secure" title={`Pacotes gravados: ${packages.length}`} text={status} />
            <StatusBanner
              tone="warning"
              title="Protecao dos dados"
              text="Midia local e coordenadas completas exigem autenticacao forte, contrato eletronico e acesso auditado antes de qualquer envio externo."
            />
            <ButtonIcon
              icon={<BookOpen size={18} color={theme.colors.primary} />}
              label="Como funciona"
              onPress={() => {
                setMenuOpen(false);
                router.push("/funcionamento");
              }}
            />
          </View>
        ) : null}

        <View style={styles.content}>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<CirclePlay size={24} color={theme.colors.primary} />}
              label="Player"
              description="Revisao"
              onPress={() => setActiveDialog("player")}
            />
            <ResourceTile
              icon={<Archive size={24} color={theme.colors.primary} />}
              label="Cofre"
              description="Trilha"
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
              description="API"
              onPress={checkForAppUpdates}
            />
          </View>
        </View>

        <BrandedDialog
          actions={[
            { label: "Fechar", tone: "muted" },
            { label: "Abrir cofre", onPress: () => setActiveDialog("cofre") }
          ]}
          icon={<CirclePlay size={18} color={theme.colors.primary} />}
          message="Area local para revisar arquivos gravados ou recebidos. Videos autorizados pelo SOS ficam no sandbox privado do app."
          onClose={() => setActiveDialog(null)}
          title={selectedPackage ? `Player do pacote ${selectedPackage.id.slice(0, 8)}` : "Player seguro"}
          visible={activeDialog === "player"}
        >
          <EvidencePlayerCard packageRecord={selectedPackage} />
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Archive size={18} color={theme.colors.primary} />}
          message="Toque no icone do pacote para abrir as acoes em raio: visualizar, compartilhar interno futuro, excluir ou finalizar quando ativo."
          onClose={() => setActiveDialog(null)}
          title="Cofre local"
          visible={activeDialog === "cofre"}
        >
          <LocalEvidenceRail
            expandedPackageId={expandedPackageId}
            onDeletePackage={confirmDeleteLocalPackage}
            onFinishPackage={requestFinishPackage}
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
  drawer: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    left: theme.spacing.lg,
    padding: theme.spacing.md,
    position: "absolute",
    right: theme.spacing.lg,
    top: 84,
    zIndex: 25,
    ...theme.shadow
  },
  finishError: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800"
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
