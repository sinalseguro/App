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

const brandLogo = require("../../assets/brand/sinalseguro-logo.png");

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
      <Pressable
        accessibilityHint="Volta para a tela inicial do botao de panico"
        accessibilityLabel="SinalSeguro"
        accessibilityRole="button"
        onPress={() => router.push("/")}
        style={({ pressed }) => [styles.brandArea, showBack && styles.brandAreaWithBack, pressed && styles.brandAreaPressed]}
      >
        <View style={styles.brandCopy}>
          <Image accessibilityIgnoresInvertColors source={brandLogo} style={styles.brandLogo} />
          {contextLabel ? (
            <Text style={styles.contextLabel} numberOfLines={1}>
              {contextLabel}
            </Text>
          ) : null}
        </View>
      </Pressable>
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
    minWidth: 0,
    paddingRight: theme.spacing.sm
  },
  brandAreaWithBack: {
    flex: 1
  },
  brandAreaPressed: {
    opacity: 0.86
  },
  brandCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  brandLogo: {
    height: 39,
    maxWidth: 230,
    resizeMode: "contain",
    width: "100%"
  },
  contextLabel: {
    color: "#FFD8E7",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 5,
    textShadowColor: "rgba(0, 0, 0, 0.28)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: "uppercase"
  },
  roundButton: {
    alignItems: "center",
    backgroundColor: "rgba(236, 64, 122, 0.16)",
    borderColor: "rgba(255, 128, 171, 0.52)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    width: 50
  },
  roundButtonPressed: {
    backgroundColor: "rgba(236, 64, 122, 0.28)",
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
