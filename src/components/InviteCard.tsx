import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, ShieldAlert, ShieldCheck, XCircle } from "lucide-react-native";
import { theme } from "@/design/theme";

type InviteCardProps = {
  detail?: string;
  icon?: ReactNode;
  name: string;
  onPress?: () => void;
  status: "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";
  description: string;
};

const statusLabel = {
  aceito: "Autorizado",
  compartilhado: "Compartilhado",
  expirado: "Expirado",
  pendente: "Pendente",
  revogado: "Revogado"
};

const statusTone = {
  aceito: theme.colors.secure,
  compartilhado: theme.colors.primary,
  expirado: theme.colors.warning,
  pendente: theme.colors.warning,
  revogado: theme.colors.danger
};

function defaultIcon(status: InviteCardProps["status"]) {
  const color = statusTone[status];
  if (status === "aceito") return <ShieldCheck size={20} color={color} />;
  if (status === "revogado") return <XCircle size={20} color={color} />;
  if (status === "expirado") return <ShieldAlert size={20} color={color} />;
  if (status === "compartilhado") return <CheckCircle2 size={20} color={color} />;
  return <Clock3 size={20} color={color} />;
}

export function InviteCard({ detail, icon, name, onPress, status, description }: InviteCardProps) {
  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.identity}>
          <View style={styles.iconSlot}>{icon ?? defaultIcon(status)}</View>
          <View style={styles.titleBlock}>
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>
            {detail ? <Text numberOfLines={1} style={styles.detail}>{detail}</Text> : null}
          </View>
        </View>
        <Text style={[styles.status, { color: statusTone[status] }]}>{statusLabel[status]}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    minHeight: 108,
    padding: theme.spacing.lg
  },
  cardPressed: {
    borderColor: theme.colors.primary,
    transform: [{ translateY: 1 }]
  },
  detail: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  identity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minWidth: 0
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  status: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  }
});
