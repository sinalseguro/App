import { StyleSheet, Text, View } from "react-native";
import { Archive, KeyRound, MapPin, Radio, ShieldCheck, Video } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";

const steps = [
  {
    icon: <Radio size={20} color={theme.colors.primary} />,
    title: "Acionamento",
    text: "O SOS exige pressao longa para evitar toque acidental. Atalhos fisicos entram quando forem seguros no aparelho."
  },
  {
    icon: <MapPin size={20} color={theme.colors.primary} />,
    title: "Localizacao",
    text: "A localizacao pontual pode ser pre-autorizada para reduzir atrito no momento do chamado."
  },
  {
    icon: <Archive size={20} color={theme.colors.primary} />,
    title: "Cofre local",
    text: "O pacote e o video autorizado ficam preservados no dispositivo para revisao local segura."
  },
  {
    icon: <KeyRound size={20} color={theme.colors.primary} />,
    title: "Protecao dos arquivos",
    text: "Arquivos e localizacao ficam protegidos no app e so devem sair com autorizacao."
  },
  {
    icon: <Video size={20} color={theme.colors.primary} />,
    title: "Midia",
    text: "Video local autorizado pode ficar salvo no aparelho para revisao privada."
  },
  {
    icon: <ShieldCheck size={20} color={theme.colors.primary} />,
    title: "Privacidade",
    text: "Dados devem ser usados apenas para protecao, orientacao e entrega autorizada."
  }
];

export default function FuncionamentoScreen() {
  return (
    <SafeScreen
      title="Como funciona"
      subtitle="Resumo simples dos recursos principais, privacidade e limites atuais do app."
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
