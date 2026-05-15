import { useCallback, useState } from "react";
import * as Linking from "expo-linking";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UserCheck, UserRound, Users } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { acceptBackendInvitation } from "@/features/invitations/invitationService";
import {
  clearPendingInvitationToken,
  extractInvitationTokenFromUrl,
  getPendingInvitationToken,
  normalizeInvitationTokenValue,
  savePendingInvitationToken
} from "@/features/invitations/pendingInvitationStore";
import { cacheTrustedContactRelationship } from "@/features/invitations/trustedRelationshipStore";
import { canAcceptAngelInvitation, ProtectionProfile } from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile } from "@/features/profiles/profileStore";

export default function InvitationScreen() {
  const { convite } = useLocalSearchParams<{ convite?: string }>();
  const currentUrl = Linking.useURL();
  const routeInvitationCode = normalizeInvitationTokenValue(convite) || extractInvitationTokenFromUrl(currentUrl);
  const [pendingInvitationCode, setPendingInvitationCode] = useState("");
  const invitationCode = routeInvitationCode || pendingInvitationCode;
  const [status, setStatus] = useState(
    routeInvitationCode
      ? "Convite identificado. Aceite somente se reconhecer a pessoa que enviou."
      : "Abra um link de convite válido enviado por uma pessoa de confiança."
  );
  const [activeProfile, setActiveProfile] = useState<ProtectionProfile | null>(null);
  const [acceptedOwnerName, setAcceptedOwnerName] = useState("");
  const [busy, setBusy] = useState(false);
  const acceptGate = canAcceptAngelInvitation(activeProfile);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void Promise.all([getActiveProtectionProfile(), getPendingInvitationToken()]).then(([profile, pendingToken]) => {
        if (!mounted) return;
        setActiveProfile(profile);
        setPendingInvitationCode(pendingToken);
        if (routeInvitationCode) {
          void savePendingInvitationToken(routeInvitationCode, "deeplink");
          setStatus("Convite identificado. Aceite somente se reconhecer a pessoa que enviou.");
        } else if (pendingToken) {
          setStatus("Convite retomado com seguranca. Aceite somente se reconhecer a pessoa que enviou.");
        }
      });
      return () => {
        mounted = false;
      };
    }, [routeInvitationCode])
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
      const acceptedRelationship = await acceptBackendInvitation(invitationCode);
      const ownerName = acceptedRelationship.owner_display_name || "a pessoa que enviou o convite";
      await cacheTrustedContactRelationship(acceptedRelationship, "acceptance");
      await clearPendingInvitationToken();
      setPendingInvitationCode("");
      setAcceptedOwnerName(ownerName);
      setStatus(`Aceite confirmado no servidor. Você agora é anjo de ${ownerName}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel aceitar o convite agora.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeScreen
      title="Convite recebido"
      subtitle="Entre com sua própria conta para aceitar um convite de anjo."
    >
      <StatusBanner
        tone={invitationCode ? "secure" : "warning"}
        title={invitationCode ? "Convite identificado" : "Convite ausente"}
        text={status}
      />
      <StatusBanner
        tone="warning"
        title="Limite de seguranca"
        text="Este app não permite entrar como outra pessoa. O vínculo só será criado com sua conta, seu aceite e autorização da pessoa que convidou."
      />
      {acceptedOwnerName ? (
        <StatusBanner
          tone="secure"
          title="Você é anjo"
          text={`Seu aparelho está vinculado como anjo de ${acceptedOwnerName}. Você só verá alertas autorizados pelo SinalSeguro.`}
        />
      ) : null}
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
        disabled={busy || !invitationCode || !acceptGate.allowed || Boolean(acceptedOwnerName)}
        icon={<UserCheck size={20} color={theme.colors.primary} />}
        label={acceptedOwnerName ? "Convite aceito" : busy ? "Validando convite..." : "Aceitar como anjo"}
        onPress={handleAcceptInvitation}
      />
      {acceptedOwnerName ? (
        <ButtonIcon
          disabled={busy}
          icon={<Users size={20} color={theme.colors.primary} />}
          label="Ver meus vínculos"
          onPress={() => router.push("/contatos")}
        />
      ) : null}
    </SafeScreen>
  );
}
