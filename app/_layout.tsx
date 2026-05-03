import { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox, Platform, View } from "react-native";
import { AppLaunchScreen } from "@/components/AppLaunchScreen";
import { theme } from "@/design/theme";

const queryClient = new QueryClient();

LogBox.ignoreLogs(["Unable to activate keep awake"]);

if (Platform.OS !== "web") {
  void SplashScreen.preventAutoHideAsync();
}

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
    if (Platform.OS !== "web") {
      void SplashScreen.hideAsync();
    }
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
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="alerta" />
          <Stack.Screen name="arquivos" />
          <Stack.Screen name="contatos" />
          <Stack.Screen name="convite" />
          <Stack.Screen name="configuracoes" />
          <Stack.Screen name="funcionamento" />
        </Stack>
      </QueryClientProvider>
    </View>
  );
}
