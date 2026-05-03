import { useEffect, useMemo, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { theme } from "@/design/theme";

type TraceConfig = {
  delay: number;
  duration: number;
  left: number;
  top: number;
  width: number;
  rotate: string;
};

const brandSymbol = require("../../assets/brand/sinalseguro-symbol.png");

const traceConfigs: TraceConfig[] = [
  { delay: 0, duration: 5200, left: 5, top: 18, width: 96, rotate: "-18deg" },
  { delay: 900, duration: 6100, left: 68, top: 12, width: 70, rotate: "22deg" },
  { delay: 1600, duration: 5600, left: 12, top: 66, width: 82, rotate: "16deg" },
  { delay: 2400, duration: 6800, left: 62, top: 74, width: 92, rotate: "-12deg" },
  { delay: 3100, duration: 7200, left: 38, top: 8, width: 64, rotate: "10deg" }
];

function AnimatedTrace({ config, value }: { config: TraceConfig; value: Animated.Value }) {
  const opacity = value.interpolate({
    inputRange: [0, 0.26, 0.72, 1],
    outputRange: [0.03, 0.12, 0.08, 0.03]
  });
  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18]
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.trace,
        {
          left: `${config.left}%`,
          opacity,
          top: `${config.top}%`,
          transform: [{ rotate: config.rotate }, { translateY }],
          width: config.width
        }
      ]}
    />
  );
}

type BrandBackgroundProps = {
  active?: boolean;
};

export function BrandBackground({ active = false }: BrandBackgroundProps) {
  const values = useMemo(() => traceConfigs.map(() => new Animated.Value(0)), []);
  const watermarkPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const watermarkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(watermarkPulse, {
          duration: 5200,
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(watermarkPulse, {
          duration: 5200,
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );
    watermarkLoop.start();

    const loops = values.map((value, index) => {
      const config = traceConfigs[index];
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(config.delay),
          Animated.timing(value, {
            duration: config.duration,
            toValue: 1,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            duration: 1,
            toValue: 0,
            useNativeDriver: true
          })
        ])
      );
      loop.start();
      return loop;
    });

    return () => {
      watermarkLoop.stop();
      loops.forEach((loop) => loop.stop());
    };
  }, [values, watermarkPulse]);

  const watermarkOpacity = watermarkPulse.interpolate({
    inputRange: [0, 1],
    outputRange: active ? [0.06, 0.1] : [0.04, 0.075]
  });
  const watermarkScale = watermarkPulse.interpolate({
    inputRange: [0, 1],
    outputRange: active ? [1.01, 1.045] : [1, 1.025]
  });
  const activeHaloOpacity = watermarkPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.28]
  });
  const activeHaloScale = watermarkPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.04]
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {active ? (
        <Animated.View
          style={[
            styles.activeHalo,
            {
              opacity: activeHaloOpacity,
              transform: [{ scale: activeHaloScale }]
            }
          ]}
        />
      ) : null}
      <Animated.View
        style={[
          styles.watermark,
          {
            opacity: watermarkOpacity,
            transform: [{ scale: watermarkScale }]
          }
        ]}
      >
        <Image accessibilityIgnoresInvertColors source={brandSymbol} style={styles.watermarkImage} />
      </Animated.View>
      {values.map((value, index) => (
        <AnimatedTrace key={index} config={traceConfigs[index]} value={value} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trace: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: 3,
    position: "absolute"
  },
  activeHalo: {
    backgroundColor: "rgba(22, 163, 74, 0.34)",
    borderRadius: theme.radius.pill,
    bottom: "18%",
    left: "10%",
    position: "absolute",
    right: "10%",
    top: "18%"
  },
  watermark: {
    height: "80%",
    left: "-4%",
    position: "absolute",
    top: "7%",
    width: "108%"
  },
  watermarkImage: {
    height: "100%",
    resizeMode: "contain",
    width: "100%"
  }
});
