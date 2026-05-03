import { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, Menu, Settings, X } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/design/theme";

type AppTopBarProps = {
  contextLabel?: string;
  showBack?: boolean;
  showMenu?: boolean;
  menuOpen?: boolean;
  menuIcon?: "menu" | "settings";
  rightSlot?: ReactNode;
  onBack?: () => void;
  onMenuPress?: () => void;
};

const brandSymbol = require("../../assets/brand/sinalseguro-symbol.png");

export function AppTopBar({
  contextLabel,
  showBack = false,
  showMenu = false,
  menuOpen = false,
  menuIcon = "menu",
  rightSlot,
  onBack,
  onMenuPress
}: AppTopBarProps) {
  function goBack() {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  }

  const MenuIcon = menuOpen ? X : menuIcon === "settings" ? Settings : Menu;

  return (
    <View style={styles.topBar}>
      {showBack ? (
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={goBack}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
        >
          <ChevronLeft size={25} color={theme.colors.textOnDark} />
        </Pressable>
      ) : null}
      <View style={styles.brandArea}>
        <Image accessibilityIgnoresInvertColors source={brandSymbol} style={styles.brandSymbol} />
        <View style={styles.brandCopy}>
          <Text style={styles.brandName} numberOfLines={1}>
            SinalSeguro
          </Text>
          {contextLabel ? (
            <Text style={styles.contextLabel} numberOfLines={1}>
              {contextLabel}
            </Text>
          ) : null}
        </View>
      </View>
      {rightSlot}
      {showMenu ? (
        <Pressable
          accessibilityLabel={menuOpen ? "Fechar menu" : "Abrir menu"}
          accessibilityRole="button"
          onPress={onMenuPress}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
          testID={menuIcon === "settings" ? "home-settings-toggle" : "app-menu-toggle"}
        >
          <MenuIcon size={25} color={theme.colors.textOnDark} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brandArea: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minWidth: 0
  },
  brandCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  brandName: {
    color: theme.colors.textOnDark,
    fontSize: 21,
    fontWeight: "900"
  },
  brandSymbol: {
    height: 38,
    width: 38
  },
  contextLabel: {
    color: theme.colors.textOnDarkMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  roundButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  roundButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ translateY: 1 }]
  },
  topBar: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundStrong,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
    minHeight: 76,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    zIndex: 30
  }
});
