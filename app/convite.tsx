import { useLocalSearchParams } from "expo-router";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";

export default function InvitationScreen() {
  const { convite } = useLocalSearchParams<{ convite?: string }>();

  return (
    <SafeScreen
      title="Convite recebido"
      subtitle="O aceite definitivo exige login com conta propria e validacao online."
    >
      <StatusBanner
        tone={convite ? "secure" : "warning"}
        title={convite ? "Convite identificado" : "Convite ausente"}
        text={
          convite
            ? "Pre-convite identificado. O vinculo real so sera validado no ambiente autorizado."
            : "Abra um link de convite valido enviado por uma pessoa de confianca."
        }
      />
      <StatusBanner
        tone="warning"
        title="Limite de seguranca"
        text="Este app nao permite entrar como outra pessoa. O vinculo so sera criado depois de autenticacao propria, consentimento e confirmacao online."
      />
    </SafeScreen>
  );
}
