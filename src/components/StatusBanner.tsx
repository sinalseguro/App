import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";
import { buildStatusBannerPresentation, type StatusBannerTone } from "@/components/statusBannerPresentationPolicy";

type StatusBannerProps = {
  tone: StatusBannerTone;
  title: string;
  text: string;
};

export function StatusBanner({ tone, title, text }: StatusBannerProps) {
  const presentation = buildStatusBannerPresentation(tone);

  return (
    <View style={[styles.banner, { borderLeftColor: theme.colors[presentation.borderColorToken] }]}>
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
    fontWeight: "800",
    lineHeight: 24
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 24
  }
});
