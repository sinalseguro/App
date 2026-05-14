import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { usePathname } from "expo-router";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera as CameraIcon, CheckCircle2, KeyRound, MapPin, ShieldCheck } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandBackground } from "@/components/BrandBackground";
import { theme } from "@/design/theme";
import {
  EmergencyPreferences,
  getEmergencyPreferences,
  saveEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { ApiSession, apiClient } from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";
import {
  beginNativeGoogleSignInAsync,
  buildGoogleSignInNotice,
  getNativeGoogleSignInReadiness
} from "@/services/googleSignIn";

type AccessGateProps = {
  children: ReactNode;
};

type PermissionSnapshot = {
  camera: boolean;
  location: boolean;
  microphone: boolean;
  notifications: boolean;
};

type GateStep = {
  complete: boolean;
  icon: ReactNode;
  label: string;
};

const openRouteAllowList = new Set(["/oauthredirect"]);

function allPermissionsGranted(permissions: PermissionSnapshot) {
  return permissions.camera && permissions.location && permissions.microphone && permissions.notifications;
}

function legalConsentComplete(preferences: EmergencyPreferences | null) {
  return Boolean(
    preferences?.legalConsent.termsAccepted &&
      preferences.legalConsent.privacyAccepted &&
      preferences.legalConsent.emergencyDataSharingAccepted
  );
}

async function getPermissionSnapshot(): Promise<PermissionSnapshot> {
  const [camera, microphone, location, notification] = await Promise.all([
    Camera.getCameraPermissionsAsync(),
    Camera.getMicrophonePermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Notifications.getPermissionsAsync()
  ]);

  return {
    camera: camera.granted,
    location: location.granted,
    microphone: microphone.granted,
    notifications: notification.granted || notification.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  };
}

export function AccessGate({ children }: AccessGateProps) {
  const pathname = usePathname();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState<ApiSession | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences | null>(null);
  const [permissions, setPermissions] = useState<PermissionSnapshot>({
    camera: false,
    location: false,
    microphone: false,
    notifications: false
  });

  const googleReadiness = getNativeGoogleSignInReadiness();
  const accessReady = Boolean(session?.user) && legalConsentComplete(preferences) && allPermissionsGranted(permissions);
  const canUseNativeGoogle = Platform.OS === "android" && googleReadiness.currentPlatformConfigured;

  const refreshGateState = useCallback(async () => {
    const [storedSession, storedPreferences, permissionSnapshot] = await Promise.all([
      apiClient.getStoredSession(),
      getEmergencyPreferences(),
      getPermissionSnapshot()
    ]);

    setSession(storedSession);
    setPreferences(storedPreferences);
    setPermissions(permissionSnapshot);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await refreshGateState();
      } catch (bootstrapError) {
        if (mounted) {
          setError(bootstrapError instanceof Error ? bootstrapError.message : "Nao foi possivel preparar o acesso.");
        }
      } finally {
        if (mounted) setBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, [refreshGateState]);

  const steps = useMemo<GateStep[]>(
    () => [
      {
        complete: Boolean(session?.user),
        icon: <KeyRound size={18} color={session?.user ? theme.colors.secure : theme.colors.primary} />,
        label: session?.user?.email ? "Conta Google validada" : "Entrar com Google"
      },
      {
        complete: legalConsentComplete(preferences),
        icon: <ShieldCheck size={18} color={legalConsentComplete(preferences) ? theme.colors.secure : theme.colors.primary} />,
        label: "Termos, privacidade e uso emergencial"
      },
      {
        complete: permissions.camera && permissions.microphone,
        icon: <CameraIcon size={18} color={permissions.camera && permissions.microphone ? theme.colors.secure : theme.colors.primary} />,
        label: "Camera e microfone"
      },
      {
        complete: permissions.location && permissions.notifications,
        icon: <MapPin size={18} color={permissions.location && permissions.notifications ? theme.colors.secure : theme.colors.primary} />,
        label: "Localizacao e avisos"
      }
    ],
    [permissions.camera, permissions.location, permissions.microphone, permissions.notifications, preferences, session?.user]
  );

  async function signInWithGoogle() {
    if (!canUseNativeGoogle) {
      setError("Login Google Android ainda nao esta configurado neste build.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const completion = await beginNativeGoogleSignInAsync();
      setSession(completion.session);
      setNotice(completion.notice);
      await refreshGateState();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Nao foi possivel entrar com Google.");
    } finally {
      setBusy(false);
    }
  }

  async function acceptLegalConsent() {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const currentPreferences = await getEmergencyPreferences();
      const nextPreferences: EmergencyPreferences = {
        ...currentPreferences,
        locationMode: "foreground_pre_authorized",
        legalConsent: {
          ...currentPreferences.legalConsent,
          acceptedAt: new Date().toISOString(),
          emergencyDataSharingAccepted: true,
          privacyAccepted: true,
          termsAccepted: true
        }
      };

      await saveEmergencyPreferences(nextPreferences);
      setPreferences(nextPreferences);

      if (session?.user) {
        const bootstrap = await deviceBindingService.completeAuthenticatedBootstrap(nextPreferences);
        setNotice(buildGoogleSignInNotice("Consentimentos registrados.", bootstrap));
      } else {
        setNotice("Consentimentos locais registrados. Entre com Google para concluir.");
      }
    } catch (consentError) {
      setError(consentError instanceof Error ? consentError.message : "Nao foi possivel registrar os consentimentos.");
    } finally {
      setBusy(false);
    }
  }

  async function requestRequiredPermissions() {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const [camera, microphone, location, notification] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Camera.requestMicrophonePermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
        Notifications.requestPermissionsAsync()
      ]);

      const nextPermissions = {
        camera: camera.granted,
        location: location.granted,
        microphone: microphone.granted,
        notifications:
          notification.granted || notification.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
      };

      setPermissions(nextPermissions);
      setNotice(
        allPermissionsGranted(nextPermissions)
          ? "Permissoes concedidas para o uso seguro do app."
          : "Alguma permissao foi negada. Ajuste nas configuracoes do aparelho para liberar o acesso."
      );
    } catch (permissionError) {
      setError(permissionError instanceof Error ? permissionError.message : "Nao foi possivel solicitar permissoes.");
    } finally {
      setBusy(false);
    }
  }

  async function validateSession() {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const user = await apiClient.getMe();
      const currentSession = await apiClient.getStoredSession();
      setSession(currentSession ? { ...currentSession, user } : null);
      setNotice("Sessao validada com o SinalSeguro.");
      await refreshGateState();
    } catch (validationError) {
      await apiClient.clearSession();
      setSession(null);
      setError(validationError instanceof Error ? validationError.message : "Sessao expirada. Entre novamente.");
    } finally {
      setBusy(false);
    }
  }

  if (openRouteAllowList.has(pathname) || accessReady) {
    return children;
  }

  return (
    <View style={styles.screen}>
      <BrandBackground />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <View style={styles.brandMark}>
              <ShieldCheck size={24} color={theme.colors.textOnDark} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Preparar acesso</Text>
              <Text style={styles.subtitle}>
                O SinalSeguro libera o app somente depois de login, consentimentos e permissoes do aparelho.
              </Text>
            </View>
          </View>

          <View style={styles.stepList}>
            {steps.map((step) => (
              <View key={step.label} style={[styles.stepRow, step.complete && styles.stepRowComplete]}>
                <View style={styles.stepIcon}>{step.complete ? <CheckCircle2 size={18} color={theme.colors.secure} /> : step.icon}</View>
                <Text style={[styles.stepText, step.complete && styles.stepTextComplete]}>{step.label}</Text>
              </View>
            ))}
          </View>

          {bootstrapping || busy ? (
            <View style={styles.busyRow}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
              <Text style={styles.busyText}>{bootstrapping ? "Verificando acesso..." : "Concluindo..."}</Text>
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}

          <View style={styles.actions}>
            {!session?.user ? (
              <GateButton disabled={busy || bootstrapping || !canUseNativeGoogle} label="Entrar com Google" onPress={signInWithGoogle} />
            ) : (
              <GateButton disabled={busy || bootstrapping} label="Validar login" onPress={validateSession} />
            )}
            {!legalConsentComplete(preferences) ? (
              <GateButton disabled={busy || bootstrapping} label="Aceitar e continuar" onPress={acceptLegalConsent} />
            ) : null}
            {!allPermissionsGranted(permissions) ? (
              <GateButton disabled={busy || bootstrapping} label="Conceder permissoes" onPress={requestRequiredPermissions} />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function GateButton({
  disabled,
  label,
  onPress
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  busyRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center"
  },
  busyText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border
  },
  buttonPressed: {
    opacity: 0.82
  },
  buttonText: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center"
  },
  buttonTextDisabled: {
    color: theme.colors.textMuted
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center"
  },
  header: {
    flexDirection: "row",
    gap: 12
  },
  headerText: {
    flex: 1,
    gap: 4
  },
  noticeText: {
    color: theme.colors.secure,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center"
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    marginHorizontal: 18,
    maxWidth: 520,
    padding: 18,
    width: "100%"
  },
  safeArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20
  },
  screen: {
    backgroundColor: theme.colors.backgroundStrong,
    flex: 1
  },
  stepIcon: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24
  },
  stepList: {
    gap: 8
  },
  stepRow: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  stepRowComplete: {
    borderColor: theme.colors.secure
  },
  stepText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19
  },
  stepTextComplete: {
    color: theme.colors.secure
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 27
  }
});
