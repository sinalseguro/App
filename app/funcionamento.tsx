import { StyleSheet, Text, View } from "react-native";
import { Archive, KeyRound, MapPin, Radio, ShieldCheck, Video } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";

const steps = [
  {
    icon: <Radio size={20} color={theme.colors.primary} />,
    title: "Acionamento",
    text: "O SOS in-app exige gesto deliberado de pressao longa. Atalhos fisicos permanecem em pesquisa nativa."
  },
  {
    icon: <MapPin size={20} color={theme.colors.primary} />,
    title: "Localizacao",
    text: "A localizacao pontual pode ser pre-autorizada para reduzir atrito no momento do chamado."
  },
  {
    icon: <Archive size={20} color={theme.colors.primary} />,
    title: "Cofre local",
    text: "O pacote fica preservado no dispositivo para reenvio futuro quando a entrega segura estiver homologada."
  },
  {
    icon: <KeyRound size={20} color={theme.colors.primary} />,
    title: "Criptografia",
    text: "Midia e localizacao reais exigem criptografia por envelope, chaves protegidas no backend e acesso autorizado."
  },
  {
    icon: <Video size={20} color={theme.colors.primary} />,
    title: "Midia",
    text: "Audio, video e streaming ficam bloqueados no build publico e preparados apenas para homologacao controlada."
  },
  {
    icon: <ShieldCheck size={20} color={theme.colors.primary} />,
    title: "Privacidade",
    text: "Dados so podem ser usados dentro do SinalSeguro ou por exportacao auditada para processo judicial ou protetivo."
  }
];

export default function FuncionamentoScreen() {
  return (
    <SafeScreen
      title="Como funciona"
      subtitle="Fluxo tecnico e juridico do app, sem promessa de integracao publica sem convenio formal."
    >
      <View style={styles.grid}>
        {steps.map((step) => (
          <View key={step.title} style={styles.card}>
            <View style={styles.icon}>{step.icon}</View>
            <View style={styles.copy}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.text}>{step.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs
  },
  grid: {
    gap: theme.spacing.md
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "900"
  }
});
