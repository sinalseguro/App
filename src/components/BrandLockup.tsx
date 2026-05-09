import { Image, StyleSheet, View } from "react-native";
import { theme } from "@/design/theme";

export function BrandLockup() {
  return (
    <View accessibilityRole="image" accessibilityLabel="SinalSeguro" style={styles.wrapper}>
      <Image source={require("../../assets/brand/sinalseguro-logo.png")} style={styles.logo} />
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
  }
});
