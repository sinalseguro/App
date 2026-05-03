import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type ResourceTileProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
};

export function ResourceTile({ icon, label, description, onPress }: ResourceTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
    >
      <View style={styles.iconSlot}>{icon}</View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  description: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center"
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  tile: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 118,
    minWidth: 100,
    padding: theme.spacing.md,
    ...theme.shadow
  },
  tilePressed: {
    borderColor: theme.colors.primary,
    transform: [{ translateY: 1 }]
  }
});
