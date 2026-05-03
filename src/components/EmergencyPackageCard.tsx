import { StyleSheet, Text, View } from "react-native";
import { Eye, Share2, Square, Trash2 } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { theme } from "@/design/theme";
import { EmergencyPackage } from "@/features/emergency/types";
import { summarizeCapture, summarizeDelivery, summarizeLocation } from "@/features/emergency/packagePresentation";

type EmergencyPackageCardProps = {
  packageRecord: EmergencyPackage;
  onFinish?: (packageId: string) => void;
};

export function EmergencyPackageCard({ packageRecord, onFinish }: EmergencyPackageCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacote {packageRecord.id.slice(0, 8)}</Text>
        <Text style={styles.status}>{packageRecord.status}</Text>
      </View>
      <Text style={styles.text}>Criado em {new Date(packageRecord.createdAt).toLocaleString("pt-BR")}</Text>
      <Text style={styles.text}>{summarizeCapture(packageRecord)}</Text>
      <Text style={styles.text}>{summarizeLocation(packageRecord)}</Text>
      <Text style={styles.text}>Midia real: {packageRecord.media.status}</Text>
      <Text style={styles.text}>{summarizeDelivery(packageRecord)}</Text>
      <Text style={styles.hash}>Hash tecnico {packageRecord.integrity.sha256.slice(0, 16)}...</Text>
      {packageRecord.status === "recording_local" && onFinish ? (
        <ButtonIcon
          icon={<Square size={18} color={theme.colors.danger} />}
          label="Finalizar chamado"
          onPress={() => onFinish(packageRecord.id)}
        />
      ) : null}
      <View style={styles.actions}>
        <ButtonIcon icon={<Eye size={18} color={theme.colors.primary} />} label="Revisar" />
        <ButtonIcon icon={<Share2 size={18} color={theme.colors.primary} />} label="Compartilhar autorizado" disabled />
        <ButtonIcon icon={<Trash2 size={18} color={theme.colors.danger} />} label="Excluir local" disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between"
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  status: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  },
  hash: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 18
  }
});
