import { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/design/theme";

type ButtonIconProps = Omit<PressableProps, "style"> & {
  icon: ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function ButtonIcon({ icon, label, style, accessibilityState, ...props }: ButtonIconProps) {
  const disabled = Boolean(props.disabled);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled }}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style
      ]}
      {...props}
    >
      <View style={styles.icon}>{icon}</View>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    ...theme.buttonSurface,
    flexDirection: "row",
    gap: theme.spacing.md,
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  buttonPressed: {
    ...theme.buttonSurfacePressed
  },
  buttonDisabled: {
    opacity: 0.48
  },
  icon: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28
  },
  label: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: theme.typography.button,
    fontWeight: "700",
    minWidth: 0
  }
});
