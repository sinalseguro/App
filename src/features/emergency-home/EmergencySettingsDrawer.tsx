import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Archive, BellRing, CirclePlay, Settings, UserRound, Users } from "lucide-react-native";
import { theme } from "@/design/theme";
import type { EmergencyHomePanel, EmergencyHomeRoute } from "./routes";
import type {
  EmergencySettingsDrawerAction,
  EmergencySettingsDrawerActionKey,
  EmergencySettingsDrawerIconKey
} from "./emergencySettingsDrawerPresentationPolicy";
import {
  resolveEmergencySettingsDrawerPresentation
} from "./emergencySettingsDrawerPresentationPolicy";

type EmergencySettingsDrawerProps = {
  onNavigate: (route: EmergencyHomeRoute, panel?: EmergencyHomePanel) => void;
};

type DrawerActionTarget = {
  panel?: EmergencyHomePanel;
  route: EmergencyHomeRoute;
};

const drawerActionTargets: Record<EmergencySettingsDrawerActionKey, DrawerActionTarget> = {
  alerts: { route: "/alerta" },
  angels: { route: "/contatos" },
  player: { panel: "player", route: "/arquivos" },
  profiles: { route: "/perfis" },
  settings: { route: "/configuracoes" },
  vault: { panel: "cofre", route: "/arquivos" }
};

type MenuActionProps = {
  accessibilityRole: "button";
  action: EmergencySettingsDrawerAction;
  iconSize: number;
  labelTextFit: {
    maxFontSizeMultiplier: number;
    numberOfLines: number;
  };
  onPress: () => void;
};

function renderDrawerIcon(iconKey: EmergencySettingsDrawerIconKey, size: number): ReactNode {
  switch (iconKey) {
    case "alert":
      return <BellRing size={size} color={theme.colors.primary} />;
    case "angels":
      return <Users size={size} color={theme.colors.primary} />;
    case "archive":
      return <Archive size={size} color={theme.colors.primary} />;
    case "player":
      return <CirclePlay size={size} color={theme.colors.primary} />;
    case "profile":
      return <UserRound size={size} color={theme.colors.primary} />;
    case "settings":
      return <Settings size={size} color={theme.colors.primary} />;
  }
}

function MenuAction({ accessibilityRole, action, iconSize, labelTextFit, onPress }: MenuActionProps) {
  return (
    <Pressable accessibilityRole={accessibilityRole} onPress={onPress} style={styles.menuAction}>
      <View style={styles.menuIcon}>{renderDrawerIcon(action.iconKey, iconSize)}</View>
      <Text {...labelTextFit} style={styles.menuActionLabel}>
        {action.label}
      </Text>
    </Pressable>
  );
}

export function EmergencySettingsDrawer({
  onNavigate
}: EmergencySettingsDrawerProps) {
  const presentation = resolveEmergencySettingsDrawerPresentation();

  return (
    <View style={styles.drawer} testID={presentation.drawerTestID}>
      <View style={styles.menuActions}>
        {presentation.actions.map((action) => (
          <MenuAction
            accessibilityRole={presentation.actionAccessibilityRole}
            action={action}
            iconSize={presentation.iconSize}
            key={action.key}
            labelTextFit={presentation.labelTextFit}
            onPress={() => {
              const target = drawerActionTargets[action.key];
              onNavigate(target.route, target.panel);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    left: theme.spacing.lg,
    padding: theme.spacing.md,
    position: "absolute",
    right: theme.spacing.lg,
    top: 84,
    zIndex: 25,
    ...theme.shadow
  },
  menuIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  menuActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  menuAction: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    flexGrow: 1,
    gap: theme.spacing.sm,
    minHeight: 46,
    paddingHorizontal: theme.spacing.md
  },
  menuActionLabel: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  }
});
