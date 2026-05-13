import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UserCheck, UserRound } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { acceptBackendInvitation } from "@/features/invitations/invitationService";
import { canAcceptAngelInvitation, ProtectionProfile } from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile } from "@/features/profiles/profileStore";

function normalizeInvitationToken(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default function InvitationScreen() {
  const { convite } = useLocalSearchParams<{ convite?: string }>();
  const invitationCode = normalizeInvitationToken(convite);
  const [status, setStatus] = useState(
    invitationCode
      ? "Convite identificado. Aceite somente se reconhecer a pessoa que enviou."
      : "Abra um link de convite valido enviado por uma pessoa de confianca."
  );
  const [activeProfile, setActiveProfile] = useState<ProtectionProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const acceptGate = canAcceptAngelInvitation(activeProfile);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void getActiveProtectionProfile().then((profile) => {
        if (mounted) setActiveProfile(profile);
      });
      return () => {
        mounted = false;
      };
    }, [])
  );

  async function handleAcceptInvitation() {
    if (!invitationCode) {
      setStatus("Convite ausente ou invalido.");
      return;
    }
    if (!acceptGate.allowed) {
      setStatus(acceptGate.message);
      return;
    }

    setBusy(true);
    setStatus("Validando convite com sua conta e dispositivo...");
    try {
      await acceptBackendInvitation(invitationCode);
      setStatus("Convite aceito. Seu dispositivo foi registrado antes do vinculo de anjo.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel aceitar o convite agora.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeScreen
      title="Convite recebido"
      subtitle="Entre com sua propria conta para aceitar um convite de anjo."
    >
      <StatusBanner
        tone={invitationCode ? "secure" : "warning"}
        title={invitationCode ? "Convite identificado" : "Convite ausente"}
        text={status}
      />
      <StatusBanner
        tone="warning"
        title="Limite de seguranca"
        text="Este app nao permite entrar como outra pessoa. O vinculo so sera criado com sua conta, seu aceite e autorizacao da pessoa que convidou."
      />
      <StatusBanner tone={acceptGate.tone} title={acceptGate.title} text={acceptGate.message} />
      {!acceptGate.allowed ? (
        <ButtonIcon
          disabled={busy}
          icon={<UserRound size={20} color={theme.colors.primary} />}
          label="Configurar perfil"
          onPress={() => router.push("/perfis")}
        />
      ) : null}
      <ButtonIcon
        disabled={busy || !invitationCode || !acceptGate.allowed}
        icon={<UserCheck size={20} color={theme.colors.primary} />}
        label={busy ? "Validando convite..." : "Aceitar como anjo"}
        onPress={handleAcceptInvitation}
      />
    </SafeScreen>
  );
}
