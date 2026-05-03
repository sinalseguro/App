import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type PanicButtonProps = {
  active?: boolean;
  label: string;
  holdMs: number;
  onTrigger: () => void;
};

type ParticleConfig = {
  delay: number;
  duration: number;
  left: number;
  rise: number;
  size: number;
};

const particleConfigs: ParticleConfig[] = [
  { delay: 0, duration: 2600, left: 20, rise: -42, size: 5 },
  { delay: 360, duration: 3200, left: 45, rise: -54, size: 4 },
  { delay: 720, duration: 2900, left: 72, rise: -46, size: 6 },
  { delay: 980, duration: 3600, left: 30, rise: -62, size: 3 },
  { delay: 1280, duration: 3100, left: 58, rise: -50, size: 5 },
  { delay: 1660, duration: 3400, left: 84, rise: -58, size: 4 },
  { delay: 1960, duration: 3900, left: 12, rise: -48, size: 4 },
  { delay: 2260, duration: 3300, left: 66, rise: -66, size: 3 }
];

function AnimatedParticle({
  config,
  enabled,
  value
}: {
  config: ParticleConfig;
  enabled: boolean;
  value: Animated.Value;
}) {
  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.rise]
  });
  const opacity = value.interpolate({
    inputRange: [0, 0.18, 0.8, 1],
    outputRange: [0, 0.86, 0.58, 0]
  });

  if (!enabled) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          height: config.size,
          left: `${config.left}%`,
          opacity,
          transform: [{ translateY }],
          width: config.size
        }
      ]}
    />
  );
}

export function PanicButton({ active = false, label, holdMs, onTrigger }: PanicButtonProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);
  const particleValues = useMemo(() => particleConfigs.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    if (!active) {
      particleValues.forEach((value) => {
        value.stopAnimation();
        value.setValue(0);
      });
      return;
    }

    const loops = particleValues.map((value, index) => {
      const config = particleConfigs[index];
      value.setValue(0);
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
      loops.forEach((loop) => loop.stop());
      particleValues.forEach((value) => {
        value.stopAnimation();
        value.setValue(0);
      });
    };
  }, [active, particleValues]);

  function clearHold() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    progress.stopAnimation();
    progress.setValue(0);
    setHolding(false);
  }

  function startHold() {
    setHolding(true);
    progress.setValue(0);
    Animated.timing(progress, {
      duration: holdMs,
      toValue: 1,
      useNativeDriver: false
    }).start();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      progress.setValue(0);
      onTrigger();
    }, holdMs);
  }

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"]
  });

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPressIn={startHold}
        onPressOut={clearHold}
        style={[styles.button, active && styles.buttonArmed, holding && styles.buttonActive]}
      >
        {particleValues.map((value, index) => (
          <AnimatedParticle key={index} config={particleConfigs[index]} enabled={active} value={value} />
        ))}
        <Text style={styles.sos}>{active ? "ATIVO" : "SOS"}</Text>
        <Text style={styles.label}>{holding ? "Continue segurando" : label}</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </Pressable>
      <Text style={styles.help} numberOfLines={1}>
        Solte
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: theme.spacing.md
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.panic,
    borderColor: theme.colors.accentSoft,
    borderRadius: 88,
    borderWidth: 6,
    gap: theme.spacing.xs,
    height: 176,
    justifyContent: "center",
    padding: theme.spacing.lg,
    overflow: "visible",
    width: 176,
    ...theme.shadow
  },
  buttonArmed: {
    backgroundColor: theme.colors.backgroundStrong,
    borderColor: theme.colors.accent
  },
  buttonActive: {
    backgroundColor: theme.colors.danger
  },
  label: {
    color: theme.colors.textOnDark,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 17,
    textAlign: "center"
  },
  progressFill: {
    backgroundColor: theme.colors.textOnDark,
    borderRadius: theme.radius.pill,
    height: "100%",
    opacity: 0.86
  },
  progressTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.26)",
    borderRadius: theme.radius.pill,
    height: 5,
    marginTop: theme.spacing.xs,
    overflow: "hidden",
    width: 100
  },
  sos: {
    color: theme.colors.textOnDark,
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center"
  },
  particle: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 6,
    bottom: 30,
    position: "absolute"
  },
  help: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    maxWidth: 280,
    textAlign: "center",
    width: 280
  }
});
