import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type PanicButtonProps = {
  label: string;
  holdMs: number;
  onTrigger: () => void;
};

export function PanicButton({ label, holdMs, onTrigger }: PanicButtonProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

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
        style={[styles.button, holding && styles.buttonActive]}
      >
        <Text style={styles.sos}>SOS</Text>
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
    width: 176,
    ...theme.shadow
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
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center"
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
