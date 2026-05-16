import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Archive, BellRing, CirclePlay, Settings, UserRound, Users } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyHomePanel, EmergencyHomeRoute } from "./routes";

type EmergencySettingsDrawerProps = {
  onNavigate: (route: EmergencyHomeRoute, panel?: EmergencyHomePanel) => void;
};

type MenuActionProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

function MenuAction({ icon, label, onPress }: MenuActionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuAction}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuActionLabel}>{label}</Text>
    </Pressable>
  );
}

export function EmergencySettingsDrawer({
  onNavigate
}: EmergencySettingsDrawerProps) {
  return (
    <View style={styles.drawer} testID="home-settings-drawer">
      <View style={styles.menuActions}>
        <MenuAction
          icon={<Archive size={18} color={theme.colors.primary} />}
          label="Cofre"
          onPress={() => onNavigate("/arquivos", "cofre")}
        />
        <MenuAction
          icon={<Users size={18} color={theme.colors.primary} />}
          label="Anjos"
          onPress={() => onNavigate("/contatos")}
        />
        <MenuAction
          icon={<BellRing size={18} color={theme.colors.primary} />}
          label="Alertas"
          onPress={() => onNavigate("/alerta")}
        />
        <MenuAction
          icon={<UserRound size={18} color={theme.colors.primary} />}
          label="Perfis"
          onPress={() => onNavigate("/perfis")}
        />
        <MenuAction
          icon={<CirclePlay size={18} color={theme.colors.primary} />}
          label="Player"
          onPress={() => onNavigate("/arquivos", "player")}
        />
        <MenuAction
          icon={<Settings size={18} color={theme.colors.primary} />}
          label="Configuracoes"
          onPress={() => onNavigate("/configuracoes")}
        />
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
