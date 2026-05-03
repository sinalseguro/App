import { ReactNode, useEffect, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
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
import { finishEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { EmergencyPackage } from "@/features/emergency/types";

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
  }, []);

  async function finishPackage(packageId: string) {
    await finishEmergencyPackage(packageId, "manual_finish");
    await refreshPackages();
    setStatus(`Chamado ${packageId.slice(0, 8)} finalizado e preservado no cofre local.`);
  }

  function selectPackage(packageRecord: EmergencyPackage) {
    setSelectedPackageId(packageRecord.id);
    setStatus(`Pacote ${packageRecord.id.slice(0, 8)} selecionado para previa segura no player.`);
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
    setStatus(`Pacote ${packageRecord.id.slice(0, 8)} removido deste dispositivo com registro local de exclusao.`);
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
  const selectedSummary = selectedPackage
    ? `Pacote ${selectedPackage.id.slice(0, 8)} selecionado para revisao segura.`
    : "Nenhum arquivo selecionado.";

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
              text="Coordenadas completas e midia real exigem autenticacao forte, contrato eletronico e acesso auditado."
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
          <View style={styles.summary}>
            <Archive size={24} color={theme.colors.primary} />
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>Arquivos locais</Text>
              <Text style={styles.summaryText}>{selectedSummary}</Text>
            </View>
          </View>

          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<CirclePlay size={24} color={theme.colors.primary} />}
              label="Player"
              description="Abrir revisao segura"
              onPress={() => setActiveDialog("player")}
            />
            <ResourceTile
              icon={<Archive size={24} color={theme.colors.primary} />}
              label="Cofre"
              description="Arquivos em trilha"
              onPress={() => setActiveDialog("cofre")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<BookOpen size={24} color={theme.colors.primary} />}
              label="Funcionamento"
              description="Privacidade e fluxo"
              onPress={() => router.push("/funcionamento")}
            />
            <ResourceTile
              icon={<RefreshCw size={24} color={theme.colors.primary} />}
              label="Atualizar"
              description="Recarregar cofre"
              onPress={refreshPackages}
            />
          </View>
        </View>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<CirclePlay size={18} color={theme.colors.primary} />}
          message="Area local para revisar arquivos gravados ou recebidos. Midia real segue bloqueada neste build publico."
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
            onFinishPackage={finishPackage}
            onSelectPackage={selectPackage}
            onShareBlocked={showShareBlocked}
            onToggleActions={togglePackageActions}
            packages={packages}
            selectedPackageId={selectedPackageId}
          />
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
  },
  summary: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md
  },
  summaryCopy: {
    flex: 1,
    gap: theme.spacing.xs
  },
  summaryText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "900"
  }
});
