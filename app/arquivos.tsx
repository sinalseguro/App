import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { EvidencePlayerCard } from "@/components/EvidencePlayerCard";
import { LocalEvidenceRail } from "@/components/LocalEvidenceRail";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { deleteEmergencyPackage, listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { finishEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { EmergencyPackage } from "@/features/emergency/types";

export default function LocalFilesScreen() {
  const [packages, setPackages] = useState<EmergencyPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [expandedPackageId, setExpandedPackageId] = useState<string | undefined>();
  const [showFileRail, setShowFileRail] = useState(true);
  const [status, setStatus] = useState("Carregando pacotes locais...");

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
    Alert.alert(
      "Compartilhamento interno futuro",
      `Pacote ${packageRecord.id.slice(0, 8)} so podera ser compartilhado por rota interna autenticada, com contrato, chaves e auditoria. Nenhum share externo foi aberto.`,
      [{ text: "Entendi" }]
    );
  }

  async function deleteLocalPackage(packageId: string) {
    await deleteEmergencyPackage(packageId);
    setSelectedPackageId((currentSelectedId) => (currentSelectedId === packageId ? undefined : currentSelectedId));
    setExpandedPackageId((currentExpandedId) => (currentExpandedId === packageId ? undefined : currentExpandedId));
    await refreshPackages();
    setStatus(`Pacote ${packageId.slice(0, 8)} removido deste dispositivo com registro local de exclusao.`);
  }

  const selectedPackage = packages.find((packageRecord) => packageRecord.id === selectedPackageId);

  return (
    <SafeScreen
      title="Cofre local"
      subtitle="Pacotes preservados neste dispositivo para revisao local e homologacao futura."
    >
      <StatusBanner tone="secure" title={`Pacotes gravados: ${packages.length}`} text={status} />
      <StatusBanner
        tone="warning"
        title="Protecao dos dados"
        text="Coordenadas completas e midia real exigem autenticacao forte, contrato eletronico e acesso auditado. Esta tela mostra apenas previa segura."
      />
      <View style={styles.playerArea}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Player seguro</Text>
          <Text style={styles.sectionMeta}>{selectedPackage ? `Pacote ${selectedPackage.id.slice(0, 8)}` : "Selecione um arquivo"}</Text>
        </View>
        <EvidencePlayerCard packageRecord={selectedPackage} />
      </View>

      <View style={styles.managerArea}>
        <View style={styles.managerHeader}>
          <View style={styles.managerTitleBlock}>
            <Text style={styles.sectionTitle}>Cofre local</Text>
            <Text style={styles.sectionMeta}>Toque no icone para abrir as acoes em raio.</Text>
          </View>
          <ButtonIcon
            icon={showFileRail ? <ChevronUp size={18} color={theme.colors.primary} /> : <ChevronDown size={18} color={theme.colors.primary} />}
            label={showFileRail ? "Recolher" : "Abrir"}
            onPress={() => setShowFileRail((currentValue) => !currentValue)}
            style={styles.headerButton}
          />
        </View>

        {showFileRail ? (
          <LocalEvidenceRail
            packages={packages}
            selectedPackageId={selectedPackageId}
            expandedPackageId={expandedPackageId}
            onSelectPackage={selectPackage}
            onToggleActions={togglePackageActions}
            onShareBlocked={showShareBlocked}
            onDeletePackage={(packageRecord) => {
              void deleteLocalPackage(packageRecord.id);
            }}
            onFinishPackage={finishPackage}
          />
        ) : null}
      </View>

      <ButtonIcon
        icon={<RefreshCw size={20} color={theme.colors.primary} />}
        label="Atualizar cofre"
        onPress={refreshPackages}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  managerArea: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  managerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between"
  },
  managerTitleBlock: {
    flex: 1,
    gap: theme.spacing.xs
  },
  playerArea: {
    gap: theme.spacing.md
  },
  sectionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between"
  },
  sectionMeta: {
    color: theme.colors.textMuted,
    flexShrink: 1,
    fontSize: theme.typography.small,
    lineHeight: 18,
    textAlign: "right"
  },
  sectionTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 20,
    fontWeight: "900"
  }
});
