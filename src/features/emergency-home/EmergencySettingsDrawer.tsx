import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Activity, Archive, ChevronDown, HelpCircle, Radio, Settings, UserPlus, Users } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyHomeRoute } from "./routes";

type EmergencySettingsDrawerProps = {
  active: boolean;
  outboxCount: number;
  recordingStatus: string;
  onNavigate: (route: EmergencyHomeRoute) => void;
  onOpenModeHelp: () => void;
  onOpenModeOptions: () => void;
};

type MenuMetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
  onHelp?: () => void;
  onPress?: () => void;
};

type MenuActionProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

function MenuMetric({ icon, label, value, onHelp, onPress }: MenuMetricProps) {
  const metricCopy = (
    <>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuMetricCopy}>
        <Text style={styles.menuMetricLabel}>{label}</Text>
        <Text style={styles.menuMetricValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      {onPress ? <ChevronDown size={16} color={theme.colors.primary} /> : null}
    </>
  );

  return (
    <View style={styles.menuMetric}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [
            styles.menuMetricMain,
            styles.menuMetricPressable,
            pressed && styles.menuMetricPressed
          ]}
        >
          {metricCopy}
        </Pressable>
      ) : (
        <View style={styles.menuMetricMain}>{metricCopy}</View>
      )}

      {onHelp ? (
        <Pressable
          accessibilityLabel={`Ajuda sobre ${label}`}
          accessibilityRole="button"
          onPress={onHelp}
          style={({ pressed }) => [styles.helpButton, pressed && styles.helpButtonPressed]}
        >
          <HelpCircle size={16} color={theme.colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function MenuAction({ icon, label, onPress }: MenuActionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuAction}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuActionLabel}>{label}</Text>
    </Pressable>
  );
}

export function EmergencySettingsDrawer({
  active,
  outboxCount,
  recordingStatus,
  onNavigate,
  onOpenModeHelp,
  onOpenModeOptions
}: EmergencySettingsDrawerProps) {
  return (
    <View style={styles.drawer} testID="home-settings-drawer">
      <MenuMetric
        icon={<Activity size={18} color={theme.colors.primary} />}
        label="Modo atual"
        value={active ? "Chamado local ativo" : "Discreto"}
        onHelp={onOpenModeHelp}
        onPress={onOpenModeOptions}
      />
      <MenuMetric
        icon={<Archive size={18} color={theme.colors.primary} />}
        label="Cofre local"
        value={`${outboxCount} pacote(s) preservado(s) no dispositivo`}
      />
      <MenuMetric icon={<Radio size={18} color={theme.colors.primary} />} label="Atividade" value={recordingStatus} />

      <View style={styles.menuActions}>
        <MenuAction
          icon={<Archive size={18} color={theme.colors.primary} />}
          label="Cofre e player"
          onPress={() => onNavigate("/arquivos")}
        />
        <MenuAction
          icon={<Users size={18} color={theme.colors.primary} />}
          label="Anjos"
          onPress={() => onNavigate("/contatos")}
        />
        <MenuAction
          icon={<UserPlus size={18} color={theme.colors.primary} />}
          label="Convites"
          onPress={() => onNavigate("/convite")}
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
  menuMetric: {
    alignItems: "center",
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  menuMetricMain: {
    alignItems: "center",
    borderRadius: theme.radius.md,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  helpButton: {
    alignItems: "center",
    borderRadius: theme.radius.pill,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  helpButtonPressed: {
    backgroundColor: theme.colors.surfaceMuted
  },
  menuMetricPressable: {
    paddingVertical: theme.spacing.xs
  },
  menuMetricPressed: {
    backgroundColor: theme.colors.surfaceMuted
  },
  menuMetricCopy: {
    flex: 1,
    gap: 1
  },
  menuMetricLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  menuMetricValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
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
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xs
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
