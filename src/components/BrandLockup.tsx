import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

export function BrandLockup() {
  return (
    <View accessibilityRole="image" accessibilityLabel="SinalSeguro" style={styles.wrapper}>
      <Image source={require("../../assets/brand/sinalseguro-symbol.png")} style={styles.symbol} />
      <View style={styles.copy}>
        <Text style={styles.name}>SinalSeguro</Text>
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
  symbol: {
    height: 58,
    resizeMode: "contain",
    width: 50
  },
  copy: {
    flex: 1,
    gap: 2
  },
  name: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800"
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    textTransform: "uppercase"
  }
});
