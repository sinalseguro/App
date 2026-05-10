import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Rect, Stop } from "react-native-svg";
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

const progressCircleRadius = 47.25;
const progressCircleCircumference = 2 * Math.PI * progressCircleRadius;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

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
          stroke="#FFEAF2"
          strokeOpacity={0.22}
          strokeWidth={1.55}
        />
        <G transform={rotationTransform}>
          <AnimatedCircle
            cx="50"
            cy="50"
            fill="none"
            r={progressCircleRadius}
            stroke="#FFF7FB"
            strokeDasharray={`${progressCircleCircumference} ${progressCircleCircumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeOpacity={0.72}
            strokeWidth={1.85}
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
  const triggeredRef = useRef(false);
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
    triggeredRef.current = false;
    progress.stopAnimation();
    progress.setValue(0);
    setHolding(false);
  }

  function fireTrigger() {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    progress.stopAnimation();
    progress.setValue(0);
    setHolding(false);
    onTrigger();
  }

  function startHold() {
    triggeredRef.current = false;
    setHolding(true);
    progress.setValue(0);
    Animated.timing(progress, {
      duration: holdMs,
      toValue: 1,
      useNativeDriver: false
    }).start();
    timerRef.current = setTimeout(fireTrigger, holdMs);
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
    outputRange: [0.18, 0.36]
  });
  const activeTextOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });
  const activeTextScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015]
  });

  return (
    <View style={styles.wrapper} testID="panic-button-area">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        delayLongPress={holdMs}
        onLongPress={fireTrigger}
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
        <View pointerEvents="none" style={styles.outerRim} />
        <CircularHoldProgress active={active} holding={holding} progress={progress} />
        <View pointerEvents="none" style={styles.depthLayer} />
        <View pointerEvents="none" style={styles.lowerDepthLayer} />
        <View pointerEvents="none" style={styles.sheenGradientLayer}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="sinalseguro-sos-sheen" x1="0" x2="0" y1="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.36" />
                <Stop offset="0.42" stopColor="#FFFFFF" stopOpacity="0.2" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect fill="url(#sinalseguro-sos-sheen)" height="100" rx="50" ry="50" width="100" />
          </Svg>
        </View>
        <View pointerEvents="none" style={styles.rimLightLayer} />
        <View pointerEvents="none" style={styles.innerGlowLayer} />
        {particleValues.map((value, index) => (
          <AnimatedParticle key={index} config={particleConfigs[index]} enabled={active} value={value} />
        ))}
        <AnimatedText
          style={[
            styles.sos,
            active && styles.sosActive,
            active && { opacity: activeTextOpacity, transform: [{ scale: activeTextScale }] }
          ]}
        >
          {active ? "ATIVO" : "SOS"}
        </AnimatedText>
        <AnimatedText style={[styles.label, active && styles.labelActive, active && { opacity: activeTextOpacity }]}>
          {holding ? "Mantenha pressionado" : label}
        </AnimatedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#C4155A",
    borderColor: theme.colors.accentSoft,
    borderRadius: theme.radius.pill,
    borderWidth: 7,
    gap: theme.spacing.xs,
    aspectRatio: 1,
    justifyContent: "center",
    maxWidth: 430,
    minWidth: 240,
    padding: theme.spacing.lg,
    overflow: "visible",
    width: "75%",
    shadowColor: "#1E1B2E",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.48,
    shadowRadius: 58,
    elevation: 18
  },
  buttonArmed: {
    backgroundColor: "#A6144E",
    borderColor: "#FFD3E1",
    shadowColor: "#EC407A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 36
  },
  buttonPressed: {
    elevation: 3,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    transform: [{ translateY: 5 }, { scale: 0.982 }]
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
    bottom: 16,
    left: 17,
    position: "absolute",
    right: 17,
    top: 19,
    zIndex: 0
  },
  outerRim: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 232, 241, 0.62)",
    borderRadius: theme.radius.pill,
    borderWidth: 1.15,
    bottom: 7,
    left: 7,
    position: "absolute",
    right: 7,
    top: 7,
    zIndex: 1
  },
  lowerDepthLayer: {
    backgroundColor: "rgba(45, 4, 28, 0.34)",
    borderBottomLeftRadius: theme.radius.pill,
    borderBottomRightRadius: theme.radius.pill,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    bottom: "6%",
    height: "42%",
    left: "11%",
    position: "absolute",
    right: "11%",
    zIndex: 1
  },
  armedGlow: {
    backgroundColor: "rgba(236, 64, 122, 0.24)",
    borderRadius: theme.radius.pill,
    bottom: -12,
    left: -12,
    position: "absolute",
    right: -12,
    top: -12,
    zIndex: 0
  },
  armedRing: {
    borderColor: "rgba(255, 211, 225, 0.8)",
    borderRadius: theme.radius.pill,
    borderWidth: 1.2,
    bottom: 6,
    left: 6,
    position: "absolute",
    right: 6,
    top: 6,
    zIndex: 3
  },
  sheenGradientLayer: {
    borderRadius: theme.radius.pill,
    height: "43%",
    left: "13%",
    overflow: "hidden",
    position: "absolute",
    right: "13%",
    top: "7%",
    zIndex: 1
  },
  rimLightLayer: {
    borderColor: "rgba(255, 235, 242, 0.34)",
    borderRadius: theme.radius.pill,
    borderTopWidth: 1,
    bottom: "7%",
    left: "7%",
    position: "absolute",
    right: "7%",
    top: "7%",
    zIndex: 1
  },
  innerGlowLayer: {
    backgroundColor: "rgba(255, 175, 205, 0.12)",
    borderRadius: theme.radius.pill,
    bottom: "15%",
    left: "16%",
    position: "absolute",
    right: "16%",
    top: "16%",
    zIndex: 1
  },
  labelActive: {
    color: "#FFF3F8",
    textShadowColor: theme.colors.secure,
    textShadowRadius: 12
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
    zIndex: 8
  },
  sos: {
    color: theme.colors.textOnDark,
    fontSize: 56,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(18, 10, 32, 0.62)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
    zIndex: 8
  },
  sosActive: {
    color: "#FFF3F8",
    textShadowColor: theme.colors.secure,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 18
  },
  particle: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 6,
    bottom: 22,
    position: "absolute",
    zIndex: 4
  },
});
