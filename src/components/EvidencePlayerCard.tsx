import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { Download, LockKeyhole, PhoneCall, Play, Share2, Trash2, Video } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { theme } from "@/design/theme";
import { EmergencyPackage } from "@/features/emergency/types";
import { evidenceAccessPolicy } from "@/features/evidence/evidencePolicy";

type EvidencePlayerCardProps = {
  packageRecord?: EmergencyPackage;
  mode?: "local" | "received";
};

export function EvidencePlayerCard({ packageRecord, mode = "local" }: EvidencePlayerCardProps) {
  const hasMedia = packageRecord?.media.status !== "blocked_public_build" && Boolean(packageRecord);
  const title = mode === "received" ? "Player de evidencia recebida" : "Player do pacote local";

  function call190() {
    Alert.alert(
      "Ligar para 190",
      "Acione o canal oficial apenas quando houver risco imediato ou base legal para ajudar a pessoa protegida.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ligar",
          onPress: () => {
            void Linking.openURL("tel:190");
          }
        }
      ]
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.preview}>
        <Video size={36} color={theme.colors.textOnDark} />
        <Text style={styles.previewTitle}>{title}</Text>
        <Text style={styles.previewText}>
          {hasMedia
            ? "Midia criptografada pronta para reproducao autorizada."
            : "Audio e video reais ficam bloqueados no build publico ate contrato, backend, chaves e auditoria."}
        </Text>
      </View>

      <View style={styles.metaBox}>
        <LockKeyhole size={18} color={theme.colors.primary} />
        <Text style={styles.metaText}>{evidenceAccessPolicy.encryptionModel}</Text>
      </View>

      <View style={styles.actionGrid}>
        <ButtonIcon icon={<Play size={18} color={theme.colors.primary} />} label="Reproduzir" disabled={!hasMedia} />
        <ButtonIcon icon={<Download size={18} color={theme.colors.primary} />} label="Salvar criptografado" disabled={!hasMedia} />
        <ButtonIcon icon={<Share2 size={18} color={theme.colors.primary} />} label="Compartilhar autorizado" disabled={!hasMedia} />
        <ButtonIcon icon={<Trash2 size={18} color={theme.colors.danger} />} label="Excluir local" disabled={!hasMedia} />
        <ButtonIcon icon={<PhoneCall size={18} color={theme.colors.primary} />} label="Ligar 190" onPress={call190} />
      </View>

      <Text style={styles.policy}>{evidenceAccessPolicy.receiverCommitment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    gap: theme.spacing.sm
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  metaBox: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  metaText: {
    color: theme.colors.textMuted,
    flex: 1,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  policy: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  preview: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundStrong,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    minHeight: 180,
    justifyContent: "center",
    padding: theme.spacing.lg
  },
  previewText: {
    color: theme.colors.textOnDarkMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    textAlign: "center"
  },
  previewTitle: {
    color: theme.colors.textOnDark,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center"
  }
});
