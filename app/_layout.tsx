import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/design/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
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
        <Stack.Screen name="contatos" options={{ title: "Anjos" }} />
        <Stack.Screen name="configuracoes" options={{ title: "Configuracoes" }} />
      </Stack>
    </QueryClientProvider>
  );
}
