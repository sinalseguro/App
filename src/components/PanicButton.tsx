import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/design/theme";

type PanicButtonProps = {
  label: string;
  holdMs: number;
  onTrigger: () => void;
};

export function PanicButton({ label, holdMs, onTrigger }: PanicButtonProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);

  function clearHold() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  }

  function startHold() {
    setHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      onTrigger();
    }, holdMs);
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPressIn={startHold}
        onPressOut={clearHold}
        style={[styles.button, holding && styles.buttonActive]}
      >
        <Text style={styles.label}>{holding ? "Continue segurando" : label}</Text>
      </Pressable>
      <Text style={styles.help}>Solte para cancelar antes da confirmacao.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    minHeight: 96,
    justifyContent: "center",
    padding: theme.spacing.xl,
    ...theme.shadow
  },
  buttonActive: {
    backgroundColor: theme.colors.danger
  },
  label: {
    color: theme.colors.textOnDark,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center"
  },
  help: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    textAlign: "center"
  }
});
