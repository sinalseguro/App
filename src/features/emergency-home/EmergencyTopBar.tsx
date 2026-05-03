import { Pressable, StyleSheet, Text, View } from "react-native";
import { Settings, X } from "lucide-react-native";
import { theme } from "@/design/theme";

type EmergencyTopBarProps = {
  active: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function EmergencyTopBar({ active, menuOpen, onToggleMenu }: EmergencyTopBarProps) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBrand}>
        <Text style={styles.topBrandName}>SinalSeguro</Text>
        <Text style={styles.topBrandMode} numberOfLines={1}>
          {active ? "Chamado ativo" : "Modo discreto"}
        </Text>
      </View>
      <Pressable
        accessibilityLabel={menuOpen ? "Fechar menu de configuracoes" : "Abrir menu de configuracoes"}
        accessibilityRole="button"
        onPress={onToggleMenu}
        style={({ pressed }) => [styles.settingsToggle, pressed && styles.settingsTogglePressed]}
        testID="home-settings-toggle"
      >
        {menuOpen ? (
          <X size={24} color={theme.colors.textOnDark} />
        ) : (
          <Settings size={24} color={theme.colors.textOnDark} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundStrong,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 76,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    zIndex: 30
  },
  topBrand: {
    flex: 1,
    gap: 2,
    paddingRight: theme.spacing.md
  },
  topBrandName: {
    color: theme.colors.textOnDark,
    fontSize: 22,
    fontWeight: "900"
  },
  topBrandMode: {
    color: theme.colors.textOnDarkMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  settingsToggle: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  settingsTogglePressed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  }
});
