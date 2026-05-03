import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

export function BrandLockup() {
  return (
    <View accessibilityRole="image" accessibilityLabel="SinalSeguro" style={styles.wrapper}>
      <Image source={require("../../assets/brand/sinalseguro-logo.png")} style={styles.logo} />
      <View style={styles.copy}>
        <Text style={styles.tagline}>Rede de Protecao e Amparo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md
  },
  logo: {
    height: 72,
    resizeMode: "contain",
    width: 245
  },
  copy: {
    flex: 1,
    gap: 2
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    textTransform: "uppercase"
  }
});
