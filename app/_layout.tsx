import { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox, Platform, View } from "react-native";
import { AppLaunchScreen } from "@/components/AppLaunchScreen";
import { BrandedDialog } from "@/components/BrandedDialog";
import { theme } from "@/design/theme";
import { AccessGate } from "@/features/access/AccessGate";
import { AppUpdateState, checkForAppUpdate, openAppUpdateDownload } from "@/services/appUpdate";
import { Download } from "lucide-react-native";

const queryClient = new QueryClient();

LogBox.ignoreLogs(["Unable to activate keep awake"]);
WebBrowser.maybeCompleteAuthSession();

if (Platform.OS !== "web") {
  void SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  const [booting, setBooting] = useState(true);
  const [updatePrompt, setUpdatePrompt] = useState<AppUpdateState | null>(null);
  const nativeSplashHiddenRef = useRef(false);

  const hideNativeSplashOnce = useCallback(() => {
    if (nativeSplashHiddenRef.current) return;

    nativeSplashHiddenRef.current = true;
    if (Platform.OS !== "web") {
      void SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    // Fallback defensivo: evita que a splash nativa fique presa se o onLayout atrasar no aparelho.
    const nativeTimer = setTimeout(hideNativeSplashOnce, 350);
    const timer = setTimeout(() => setBooting(false), 950);
    void checkForAppUpdate({ force: true })
      .then((state) => {
        if (mounted && state.status === "available") {
          setUpdatePrompt(state);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
      clearTimeout(nativeTimer);
      clearTimeout(timer);
    };
  }, [hideNativeSplashOnce]);

  const hideNativeSplash = useCallback(() => {
    hideNativeSplashOnce();
  }, [hideNativeSplashOnce]);

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
        <AccessGate>
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
            <Stack.Screen name="oauthredirect" />
            <Stack.Screen name="perfis" />
          </Stack>
        </AccessGate>
        <BrandedDialog
          actions={[
            { label: "Depois", tone: "muted" },
            {
              label: "Atualizar",
              onPress: () => {
                void openAppUpdateDownload(updatePrompt);
              }
            }
          ]}
          icon={<Download size={18} color={theme.colors.primary} />}
          message={updatePrompt?.message}
          onClose={() => setUpdatePrompt(null)}
          title="Atualizacao disponivel"
          visible={Boolean(updatePrompt)}
        />
      </QueryClientProvider>
    </View>
  );
}
