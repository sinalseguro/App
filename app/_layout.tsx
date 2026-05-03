import { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox, View } from "react-native";
import { AppLaunchScreen } from "@/components/AppLaunchScreen";
import { theme } from "@/design/theme";

const queryClient = new QueryClient();

LogBox.ignoreLogs(["Unable to activate keep awake"]);
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [booting, setBooting] = useState(true);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 950);
    return () => clearTimeout(timer);
  }, []);

  const hideNativeSplash = useCallback(() => {
    if (nativeSplashHidden) return;

    setNativeSplashHidden(true);
    void SplashScreen.hideAsync();
  }, [nativeSplashHidden]);

  if (booting) {
    return (
      <View style={{ flex: 1 }} onLayout={hideNativeSplash}>
        <AppLaunchScreen />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={hideNativeSplash}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor={theme.colors.backgroundStrong} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.backgroundStrong },
            headerTintColor: theme.colors.textOnDark,
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: theme.colors.background }
          }}
        >
          <Stack.Screen name="index" options={{ title: "SinalSeguro" }} />
          <Stack.Screen name="onboarding" options={{ title: "Boas-vindas" }} />
          <Stack.Screen name="alerta" options={{ title: "Alerta" }} />
          <Stack.Screen name="arquivos" options={{ title: "Cofre local" }} />
          <Stack.Screen name="contatos" options={{ title: "Anjos" }} />
          <Stack.Screen name="convite" options={{ title: "Convite" }} />
          <Stack.Screen name="configuracoes" options={{ title: "Configuracoes" }} />
        </Stack>
      </QueryClientProvider>
    </View>
  );
}
