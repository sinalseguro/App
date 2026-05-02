import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type ConsentCardProps = {
  title: string;
  text: string;
  status: "obrigatorio" | "opcional" | "bloqueado";
};

export function ConsentCard({ title, text, status }: ConsentCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.meta}>{status}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  meta: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  }
});
