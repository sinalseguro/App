import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ambulance, Flame, ShieldAlert } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyCallIcon, EmergencyCallTarget, emergencyCallTargets } from "./EmergencyCallTarget";
import { buildEmergencyCallDockTargetPresentation } from "./emergencyCallDockPresentationPolicy";

type EmergencyCallDockProps = {
  onCallTarget: (target: EmergencyCallTarget) => void;
};

function renderEmergencyIcon(icon: EmergencyCallIcon, size: number) {
  if (icon === "fire") {
    return <Flame size={size} color={theme.colors.primary} />;
  }

  if (icon === "samu") {
    return <Ambulance size={size} color={theme.colors.primary} />;
  }

  return <ShieldAlert size={size} color={theme.colors.primary} />;
}

export function EmergencyCallDock({ onCallTarget }: EmergencyCallDockProps) {
  return (
    <View style={styles.callDock}>
      {emergencyCallTargets.map((target) => {
        const presentation = buildEmergencyCallDockTargetPresentation(target);

        return (
          <Pressable
            accessibilityHint={presentation.accessibilityHint}
            accessibilityLabel={presentation.accessibilityLabel}
            accessibilityRole={presentation.accessibilityRole}
            key={target.number}
            onPress={() => onCallTarget(target)}
            style={({ pressed }) => [styles.callButton, pressed && styles.callButtonPressed]}
          >
            <View style={styles.callIcon}>{renderEmergencyIcon(target.icon, presentation.iconSize)}</View>
            <Text style={styles.callLabel} {...presentation.labelTextFit}>
              {target.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  callDock: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  callButton: {
    alignItems: "center",
    ...theme.buttonSurface,
    flex: 1,
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 74,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm
  },
  callButtonPressed: {
    ...theme.buttonSurfacePressed
  },
  callIcon: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28
  },
  callLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  }
});
