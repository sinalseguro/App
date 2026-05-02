import { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/design/theme";

type ButtonIconProps = Omit<PressableProps, "style"> & {
  icon: ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function ButtonIcon({ icon, label, style, ...props }: ButtonIconProps) {
  return (
    <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]} {...props}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  buttonPressed: {
    backgroundColor: theme.colors.surfaceMuted
  },
  icon: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.button,
    fontWeight: "700"
  }
});
