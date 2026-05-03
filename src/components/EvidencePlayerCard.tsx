import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, FileLock2, LockKeyhole, MapPin, Play, Video } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyPackage } from "@/features/emergency/types";
import { evidenceAccessPolicy } from "@/features/evidence/evidencePolicy";
import { summarizeCapture, summarizeLocation } from "@/features/emergency/packagePresentation";

type EvidencePlayerCardProps = {
  packageRecord?: EmergencyPackage;
  mode?: "local" | "received";
};

export function EvidencePlayerCard({ packageRecord, mode = "local" }: EvidencePlayerCardProps) {
  const [previewTouched, setPreviewTouched] = useState(false);
  const hasMedia = packageRecord?.media.status !== "blocked_public_build" && Boolean(packageRecord);
  const title = mode === "received" ? "Player seguro recebido" : "Player seguro local";
  const previewTitle = previewTouched && packageRecord ? "Pacote selecionado no player" : title;
  const previewText = packageRecord
    ? previewTouched
      ? "Visualizacao tecnica ativa. Midia real continua bloqueada neste build; metadados e integridade estao disponiveis abaixo."
      : hasMedia
        ? "Toque para reproduzir midia criptografada autorizada."
        : "Toque para revisar o pacote. Audio e video reais ficam bloqueados neste build."
    : "Audio e video reais ficam bloqueados neste build. O player preserva o fluxo para homologacao autorizada.";

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={packageRecord ? `Visualizar pacote ${packageRecord.id.slice(0, 8)} no player seguro` : "Player seguro sem arquivo selecionado"}
        accessibilityRole="button"
        accessibilityState={{ disabled: !packageRecord, selected: previewTouched && Boolean(packageRecord) }}
        disabled={!packageRecord}
        onPress={() => setPreviewTouched(true)}
        style={({ pressed }) => [
          styles.preview,
          previewTouched && packageRecord && styles.previewSelected,
          pressed && packageRecord && styles.previewPressed
        ]}
      >
        <View style={styles.playBadge}>
          {hasMedia ? <Play size={42} color={theme.colors.textOnDark} /> : <Video size={42} color={theme.colors.textOnDark} />}
        </View>
        <Text style={styles.previewTitle}>{previewTitle}</Text>
        {packageRecord ? <Text style={styles.packageId}>Pacote {packageRecord.id.slice(0, 8)}</Text> : null}
        <Text style={styles.previewText}>{previewText}</Text>
      </Pressable>

      {packageRecord ? (
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Clock size={17} color={theme.colors.primary} />
            <Text style={styles.detailText}>{summarizeCapture(packageRecord)}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={17} color={theme.colors.primary} />
            <Text style={styles.detailText}>{summarizeLocation(packageRecord)}</Text>
          </View>
          <View style={styles.detailItem}>
            <FileLock2 size={17} color={theme.colors.primary} />
            <Text style={styles.detailText}>Hash tecnico {packageRecord.integrity.sha256.slice(0, 16)}...</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum arquivo selecionado</Text>
          <Text style={styles.emptyText}>Abra a trilha retratil e toque em um icone para visualizar os dados preservados.</Text>
        </View>
      )}

      <View style={styles.metaBox}>
        <LockKeyhole size={18} color={theme.colors.primary} />
        <Text style={styles.metaText}>{evidenceAccessPolicy.encryptionModel}</Text>
      </View>

      <Text style={styles.policy}>{evidenceAccessPolicy.receiverCommitment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  detailGrid: {
    gap: theme.spacing.sm
  },
  detailItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  detailText: {
    color: theme.colors.textMuted,
    flex: 1,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  emptyState: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    padding: theme.spacing.md
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "800"
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
  previewPressed: {
    opacity: 0.9
  },
  previewSelected: {
    borderColor: theme.colors.accent,
    borderWidth: 2
  },
  packageId: {
    color: theme.colors.accentSoft,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
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
  },
  playBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 38,
    borderWidth: 1,
    height: 76,
    justifyContent: "center",
    width: 76
  }
});
