import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type StatusBannerProps = {
  tone: "secure" | "warning" | "danger";
  title: string;
  text: string;
};

const toneColor = {
  secure: theme.colors.secure,
  warning: theme.colors.warning,
  danger: theme.colors.danger
};

export function StatusBanner({ tone, title, text }: StatusBannerProps) {
  return (
    <View style={[styles.banner, { borderLeftColor: toneColor[tone] }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderLeftWidth: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800"
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  }
});
