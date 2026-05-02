import { Link } from "expo-router";
import { Shield, Users, Settings } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { ButtonIcon } from "@/components/ButtonIcon";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";

export default function HomeScreen() {
  return (
    <SafeScreen
      title="SinalSeguro"
      subtitle="Rede de apoio discreta, consentida e em validacao controlada."
      footer="Em risco imediato, use os canais oficiais como 190 e 180."
    >
      <StatusBanner
        tone="secure"
        title="Modo discreto ativo"
        text="Esta tela evita termos sensiveis e nao envia dados sem consentimento."
      />

      <PanicButton
        label="Segurar para simular alerta"
        holdMs={1800}
        onTrigger={() => {
          // Checkpoint inicial: a acao real sera ligada a outbox/API nas fases seguintes.
        }}
      />

      <Link href="/onboarding" asChild>
        <ButtonIcon icon={<Shield size={20} color={theme.colors.primary} />} label="Revisar onboarding" />
      </Link>
      <Link href="/contatos" asChild>
        <ButtonIcon icon={<Users size={20} color={theme.colors.primary} />} label="Rede de anjos" />
      </Link>
      <Link href="/configuracoes" asChild>
        <ButtonIcon icon={<Settings size={20} color={theme.colors.primary} />} label="Configuracoes" />
      </Link>
    </SafeScreen>
  );
}
