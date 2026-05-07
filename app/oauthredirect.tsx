import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { theme } from "@/design/theme";
import { completeGoogleSignInFromRedirect } from "@/services/googleSignIn";
import { GoogleOidcRedirectParams, saveGoogleOidcLoginStatus } from "@/services/googleOidc";

WebBrowser.maybeCompleteAuthSession();

function normalizeParams(params: GoogleOidcRedirectParams) {
  const normalizedParams: Record<string, string | string[] | undefined> = {};

  for (const [key, value] of Object.entries(params)) {
    normalizedParams[key] = value;
  }

  return normalizedParams;
}

export default function OAuthRedirectScreen() {
  const params = useLocalSearchParams();
  const completedRef = useRef(false);
  const [statusText, setStatusText] = useState("Concluindo login Google...");

  useEffect(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    let mounted = true;

    async function completeRedirect() {
      try {
        const completion = await completeGoogleSignInFromRedirect(normalizeParams(params));
        await saveGoogleOidcLoginStatus("success", completion.notice);
        if (mounted) setStatusText("Login Google concluido.");
      } catch {
        await saveGoogleOidcLoginStatus("error", "Nao foi possivel concluir login Google. Tente novamente.");
        if (mounted) setStatusText("Nao foi possivel concluir login Google.");
      } finally {
        setTimeout(() => {
          if (mounted) router.replace("/configuracoes");
        }, 450);
      }
    }

    void completeRedirect();

    return () => {
      mounted = false;
    };
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 24
  },
  statusText: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
    textAlign: "center"
  }
});
