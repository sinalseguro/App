import { useEffect, useMemo, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { theme } from "@/design/theme";

type TraceConfig = {
  delay: number;
  duration: number;
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  size: number;
};

const brandSymbol = require("../../assets/brand/sinalseguro-symbol.png");

const particleConfigs: TraceConfig[] = [
  { delay: 0, duration: 5400, left: 12, top: 20, driftX: 10, driftY: -22, size: 9 },
  { delay: 520, duration: 6800, left: 74, top: 22, driftX: -12, driftY: 18, size: 7 },
  { delay: 980, duration: 6200, left: 28, top: 68, driftX: 15, driftY: -16, size: 6 },
  { delay: 1420, duration: 7600, left: 82, top: 66, driftX: -18, driftY: -20, size: 8 },
  { delay: 1980, duration: 7000, left: 50, top: 16, driftX: -8, driftY: 24, size: 5 },
  { delay: 2380, duration: 6400, left: 18, top: 84, driftX: 20, driftY: -12, size: 4 },
  { delay: 2860, duration: 8000, left: 66, top: 82, driftX: -16, driftY: -18, size: 6 },
  { delay: 3320, duration: 7200, left: 42, top: 54, driftX: 9, driftY: -28, size: 5 }
];

function AnimatedBrandParticle({ config, value }: { config: TraceConfig; value: Animated.Value }) {
  const opacity = value.interpolate({
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: [0.04, 0.18, 0.12, 0.04]
  });
  const scale = value.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.72, 1.08, 0.84]
  });
  const translateX = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftX]
  });
  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftY]
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.trace,
        {
          height: config.size,
          left: `${config.left}%`,
          opacity,
          top: `${config.top}%`,
          transform: [{ translateX }, { translateY }, { scale }],
          width: config.size
        }
      ]}
    />
  );
}

type BrandBackgroundProps = {
  active?: boolean;
};

export function BrandBackground({ active = false }: BrandBackgroundProps) {
  const values = useMemo(() => particleConfigs.map(() => new Animated.Value(0)), []);
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
      const config = particleConfigs[index];
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
        <AnimatedBrandParticle key={index} config={particleConfigs[index]} value={value} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trace: {
    backgroundColor: "rgba(236, 64, 122, 0.56)",
    borderColor: "rgba(122, 31, 162, 0.22)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    position: "absolute"
  },
  activeHalo: {
    backgroundColor: "rgba(236, 64, 122, 0.2)",
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
