import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

export function AppLaunchScreen() {
  const progress = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 900,
      toValue: 1,
      useNativeDriver: false
    }).start();
  }, [progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["18%", "100%"]
  });

  return (
    <View style={styles.screen}>
      <View style={styles.brand}>
        <Image source={require("../../assets/brand/sinalseguro-symbol.png")} style={styles.symbol} />
        <Text style={styles.name}>SinalSeguro</Text>
      </View>
      <View accessibilityRole="progressbar" accessibilityLabel="Carregando SinalSeguro" style={styles.loadingTrack}>
        <Animated.View style={[styles.loadingFill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    gap: theme.spacing.sm,
    width: "100%"
  },
  loadingFill: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: "100%"
  },
  loadingTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 8,
    marginTop: theme.spacing.xxl,
    overflow: "hidden",
    width: 220
  },
  name: {
    color: theme.colors.textOnDark,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center"
  },
  screen: {
    alignItems: "center",
    backgroundColor: theme.colors.splashBackground,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xxl
  },
  symbol: {
    height: 132,
    resizeMode: "contain",
    width: 132
  }
});
