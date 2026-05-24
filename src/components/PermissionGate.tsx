import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";
import { buildPermissionGatePresentation, type PermissionGateStatus } from "@/components/permissionGatePresentationPolicy";

type PermissionGateProps = {
  title: string;
  text: string;
  status: PermissionGateStatus;
};

export function PermissionGate({ title, text, status }: PermissionGateProps) {
  const presentation = buildPermissionGatePresentation(status);

  return (
    <View style={styles.card}>
      <Text
        adjustsFontSizeToFit={presentation.statusTextFit.adjustsFontSizeToFit}
        maxFontSizeMultiplier={presentation.statusTextFit.maxFontSizeMultiplier}
        minimumFontScale={presentation.statusTextFit.minimumFontScale}
        numberOfLines={presentation.statusTextFit.numberOfLines}
        style={styles.status}
      >
        {presentation.statusLabel}
      </Text>
      <Text
        adjustsFontSizeToFit={presentation.titleTextFit.adjustsFontSizeToFit}
        maxFontSizeMultiplier={presentation.titleTextFit.maxFontSizeMultiplier}
        minimumFontScale={presentation.titleTextFit.minimumFontScale}
        numberOfLines={presentation.titleTextFit.numberOfLines}
        style={styles.title}
      >
        {title}
      </Text>
      <Text
        adjustsFontSizeToFit={presentation.textTextFit.adjustsFontSizeToFit}
        maxFontSizeMultiplier={presentation.textTextFit.maxFontSizeMultiplier}
        minimumFontScale={presentation.textTextFit.minimumFontScale}
        numberOfLines={presentation.textTextFit.numberOfLines}
        style={styles.text}
      >
        {text}
      </Text>
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
  status: {
    color: theme.colors.accent,
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
