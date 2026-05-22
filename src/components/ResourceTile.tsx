import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";
import { buildResourceTilePresentation } from "@/components/resourceTilePresentationPolicy";

type ResourceTileProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
};

export function ResourceTile({ icon, label, description, onPress }: ResourceTileProps) {
  const presentation = buildResourceTilePresentation(description);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
    >
      <View style={styles.iconSlot}>{icon}</View>
      <Text
        adjustsFontSizeToFit={presentation.labelTextFit.adjustsFontSizeToFit}
        maxFontSizeMultiplier={presentation.labelTextFit.maxFontSizeMultiplier}
        minimumFontScale={presentation.labelTextFit.minimumFontScale}
        numberOfLines={presentation.labelTextFit.numberOfLines}
        style={styles.label}
      >
        {label}
      </Text>
      {presentation.shouldRenderDescription ? (
        <Text
          adjustsFontSizeToFit={presentation.descriptionTextFit.adjustsFontSizeToFit}
          maxFontSizeMultiplier={presentation.descriptionTextFit.maxFontSizeMultiplier}
          minimumFontScale={presentation.descriptionTextFit.minimumFontScale}
          numberOfLines={presentation.descriptionTextFit.numberOfLines}
          style={styles.description}
        >
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
    lineHeight: 18,
    textAlign: "center"
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: theme.radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 19,
    textAlign: "center"
  },
  tile: {
    alignItems: "center",
    ...theme.buttonSurface,
    flex: 1,
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 112,
    minWidth: 100,
    padding: theme.spacing.sm
  },
  tilePressed: {
    ...theme.buttonSurfacePressed
  }
});
