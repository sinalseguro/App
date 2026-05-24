import { Image, StyleSheet, View } from "react-native";
import { resolveBrandLockupPresentation } from "@/components/brandLockupPresentationPolicy";
import { theme } from "@/design/theme";

export function BrandLockup() {
  const presentation = resolveBrandLockupPresentation();

  return (
    <View
      accessibilityRole={presentation.accessibilityRole}
      accessibilityLabel={presentation.accessibilityLabel}
      style={styles.wrapper}
    >
      <Image
        resizeMode={presentation.logoResizeMode}
        source={require("../../assets/brand/sinalseguro-logo.png")}
        style={presentation.logoSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md
  }
});
