import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
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
  { delay: 0, duration: 3000, left: 20, rise: -178, size: 5 },
  { delay: 420, duration: 3600, left: 45, rise: -238, size: 4 },
  { delay: 760, duration: 3300, left: 72, rise: -198, size: 6 },
  { delay: 1080, duration: 4100, left: 30, rise: -268, size: 3 },
  { delay: 1400, duration: 3500, left: 58, rise: -214, size: 5 },
  { delay: 1840, duration: 3900, left: 84, rise: -252, size: 4 },
  { delay: 2140, duration: 4400, left: 12, rise: -190, size: 4 },
  { delay: 2460, duration: 3700, left: 66, rise: -260, size: 3 }
];

const progressCircleRadius = 49.2;
const progressCircleCircumference = 2 * Math.PI * progressCircleRadius;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CircularHoldProgress({
  active,
  holding,
  progress
}: {
  active: boolean;
  holding: boolean;
  progress: Animated.Value;
}) {
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [progressCircleCircumference, 0]
  });
  const rotationTransform = active ? "translate(100 0) scale(-1 1) rotate(-90 50 50)" : "rotate(-90 50 50)";

  if (!holding) return null;

  return (
    <View pointerEvents="none" style={styles.circularProgressLayer}>
      <Svg height="100%" style={styles.circularProgressSvg} viewBox="0 0 100 100" width="100%">
        <Circle
          cx="50"
          cy="50"
          fill="none"
          r={progressCircleRadius}
          stroke={theme.colors.accentSoft}
          strokeOpacity={0.1}
          strokeWidth={0.75}
        />
        <G transform={rotationTransform}>
          <AnimatedCircle
            cx="50"
            cy="50"
            fill="none"
            r={progressCircleRadius}
            stroke={theme.colors.accentSoft}
            strokeDasharray={`${progressCircleCircumference} ${progressCircleCircumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeOpacity={0.68}
            strokeWidth={0.85}
          />
        </G>
      </Svg>
    </View>
  );
}

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
  const pulse = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);
  const particleValues = useMemo(() => particleConfigs.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    if (!active) {
      pulse.stopAnimation();
      pulse.setValue(0);
      particleValues.forEach((value) => {
        value.stopAnimation();
        value.setValue(0);
      });
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 1800,
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          duration: 1800,
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );
    pulseLoop.start();

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
      pulseLoop.stop();
      pulse.stopAnimation();
      pulse.setValue(0);
      loops.forEach((loop) => loop.stop());
      particleValues.forEach((value) => {
        value.stopAnimation();
        value.setValue(0);
      });
    };
  }, [active, particleValues, pulse]);

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

  const armedGlowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.42]
  });
  const armedGlowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1.01, 1.08]
  });
  const armedRingOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.44, 0.9]
  });

  return (
    <View style={styles.wrapper} testID="panic-button-area">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPressIn={startHold}
        onPressOut={clearHold}
        style={({ pressed }) => [
          styles.button,
          active && styles.buttonArmed,
          (holding || pressed) && styles.buttonPressed
        ]}
        testID="panic-button"
      >
        {active ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.armedGlow,
                {
                  opacity: armedGlowOpacity,
                  transform: [{ scale: armedGlowScale }]
                }
              ]}
            />
            <Animated.View pointerEvents="none" style={[styles.armedRing, { opacity: armedRingOpacity }]} />
          </>
        ) : null}
        <CircularHoldProgress active={active} holding={holding} progress={progress} />
        <View pointerEvents="none" style={styles.depthLayer} />
        <View pointerEvents="none" style={styles.sheenLayer} />
        {particleValues.map((value, index) => (
          <AnimatedParticle key={index} config={particleConfigs[index]} enabled={active} value={value} />
        ))}
        <Text style={styles.sos}>{active ? "ATIVO" : "SOS"}</Text>
        <Text style={styles.label}>{holding ? "Continue segurando" : label}</Text>
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
    gap: theme.spacing.sm,
    width: "100%"
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.panic,
    borderColor: theme.colors.accentSoft,
    borderRadius: theme.radius.pill,
    borderWidth: 6,
    gap: theme.spacing.xs,
    aspectRatio: 1,
    justifyContent: "center",
    maxWidth: 430,
    minWidth: 240,
    padding: theme.spacing.lg,
    overflow: "visible",
    width: "75%",
    shadowColor: "#1E1B2E",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 28,
    elevation: 10
  },
  buttonArmed: {
    backgroundColor: "#9F174D",
    borderColor: "#FFD3E1",
    shadowColor: "#EC407A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.36,
    shadowRadius: 32
  },
  buttonPressed: {
    elevation: 3,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    transform: [{ translateY: 4 }, { scale: 0.985 }]
  },
  circularProgressLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    zIndex: 6
  },
  circularProgressSvg: {
    ...StyleSheet.absoluteFillObject
  },
  depthLayer: {
    backgroundColor: "rgba(18, 10, 32, 0.2)",
    borderRadius: theme.radius.pill,
    bottom: 14,
    left: 16,
    position: "absolute",
    right: 16,
    top: 18
  },
  armedGlow: {
    backgroundColor: "rgba(236, 64, 122, 0.34)",
    borderRadius: theme.radius.pill,
    bottom: -12,
    left: -12,
    position: "absolute",
    right: -12,
    top: -12,
    zIndex: 0
  },
  armedRing: {
    borderColor: "rgba(255, 128, 171, 0.86)",
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    bottom: 4,
    left: 4,
    position: "absolute",
    right: 4,
    top: 4,
    zIndex: 3
  },
  sheenLayer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: theme.radius.pill,
    height: "46%",
    left: "12%",
    position: "absolute",
    right: "12%",
    top: "9%"
  },
  label: {
    color: theme.colors.textOnDark,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 21,
    textAlign: "center",
    textShadowColor: "rgba(18, 10, 32, 0.56)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    zIndex: 2
  },
  sos: {
    color: theme.colors.textOnDark,
    fontSize: 56,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(18, 10, 32, 0.62)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
    zIndex: 2
  },
  particle: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 6,
    bottom: 22,
    position: "absolute",
    zIndex: 4
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
