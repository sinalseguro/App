import { useLocalSearchParams } from "expo-router";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";

export default function InvitationScreen() {
  const { convite } = useLocalSearchParams<{ convite?: string }>();

  return (
    <SafeScreen
      title="Convite recebido"
      subtitle="Entre com sua propria conta para aceitar um convite de anjo."
    >
      <StatusBanner
        tone={convite ? "secure" : "warning"}
        title={convite ? "Convite identificado" : "Convite ausente"}
        text={
          convite
            ? "Convite identificado. Confirme somente se reconhecer a pessoa que enviou."
            : "Abra um link de convite valido enviado por uma pessoa de confianca."
        }
      />
      <StatusBanner
        tone="warning"
        title="Limite de seguranca"
        text="Este app nao permite entrar como outra pessoa. O vinculo so sera criado com sua conta, seu aceite e autorizacao da pessoa que convidou."
      />
    </SafeScreen>
  );
}
