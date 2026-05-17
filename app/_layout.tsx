import { useCallback, useEffect, useRef, useState } from "react";
import { router, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as WebBrowser from "expo-web-browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox, Platform, View } from "react-native";
import { AppLaunchScreen } from "@/components/AppLaunchScreen";
import { BrandedDialog } from "@/components/BrandedDialog";
import { theme } from "@/design/theme";
import { AccessGate } from "@/features/access/AccessGate";
import { notifyIncomingEmergency } from "@/features/live-call/incomingEmergencyNotification";
import { currentEmergencyRecipientStatus, isActiveReceivedEmergency } from "@/features/live-call/liveCallRolePolicy";
import { AppUpdateState, checkForAppUpdate, openAppUpdateDownload } from "@/services/appUpdate";
import { ApiEmergencySession, apiClient } from "@/services/apiClient";
import { Download } from "lucide-react-native";

const queryClient = new QueryClient();
const incomingEmergencyForegroundPollMs = 3500;

LogBox.ignoreLogs(["Unable to activate keep awake"]);
WebBrowser.maybeCompleteAuthSession();

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      priority: Notifications.AndroidNotificationPriority.HIGH,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    })
  });
}

if (Platform.OS !== "web") {
  void SplashScreen.preventAutoHideAsync();
}

function shouldOpenIncomingEmergency(session: ApiEmergencySession) {
  if (!isActiveReceivedEmergency(session)) return false;
  const recipientStatus = currentEmergencyRecipientStatus(session);
  return recipientStatus !== "declined" && recipientStatus !== "ended";
}

function IncomingEmergencyForegroundBridge() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const pollingRef = useRef(false);
  const notifiedSessionIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const checkIncomingEmergencies = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;

    try {
      const receivedSessions = await apiClient.listReceivedEmergencySessions();
      const incomingSession = receivedSessions.find(shouldOpenIncomingEmergency);
      if (!incomingSession) return;

      if (!notifiedSessionIdsRef.current.has(incomingSession.id)) {
        notifiedSessionIdsRef.current.add(incomingSession.id);
        void notifyIncomingEmergency(incomingSession).catch(() => null);
      }

      if (pathnameRef.current !== "/alerta") {
        router.push("/alerta");
      }
    } catch {
      // O app preserva o acesso local/offline; falha de rede ou login nao deve interromper a tela atual.
    } finally {
      pollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return undefined;

    void checkIncomingEmergencies();
    const timer = setInterval(() => {
      void checkIncomingEmergencies();
    }, incomingEmergencyForegroundPollMs);

    return () => clearInterval(timer);
  }, [checkIncomingEmergencies]);

  return null;
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

  useEffect(() => {
    if (Platform.OS === "web") return undefined;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = response.notification.request.content.data?.route;
      if (route === "/alerta") {
        router.push("/alerta");
      }
    });

    return () => subscription.remove();
  }, []);

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
          <IncomingEmergencyForegroundBridge />
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
