import { useCallback, useState } from "react";
import * as Linking from "expo-linking";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UserCheck, UserRound, Users } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { acceptBackendInvitation, validateBackendInvitationToken } from "@/features/invitations/invitationService";
import {
  clearPendingInvitationToken,
  extractInvitationTokenFromUrl,
  getPendingInvitationToken,
  normalizeInvitationTokenValue,
  savePendingInvitationToken
} from "@/features/invitations/pendingInvitationStore";
import { cacheTrustedContactRelationship } from "@/features/invitations/trustedRelationshipStore";
import {
  buildInvitationAcceptanceInitialStatus,
  buildInvitationAcceptancePresentation,
  invitationAcceptanceMessages,
  invitationAcceptanceScreenCopy
} from "@/features/invitations/invitationAcceptancePresentationPolicy";
import { canAcceptAngelInvitation, ProtectionProfile } from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile } from "@/features/profiles/profileStore";

export default function InvitationScreen() {
  const { convite } = useLocalSearchParams<{ convite?: string }>();
  const currentUrl = Linking.useURL();
  const routeInvitationCode = normalizeInvitationTokenValue(convite) || extractInvitationTokenFromUrl(currentUrl);
  const [pendingInvitationCode, setPendingInvitationCode] = useState("");
  const invitationCode = routeInvitationCode || pendingInvitationCode;
  const [status, setStatus] = useState<string>(buildInvitationAcceptanceInitialStatus(Boolean(routeInvitationCode)));
  const [activeProfile, setActiveProfile] = useState<ProtectionProfile | null>(null);
  const [acceptedOwnerName, setAcceptedOwnerName] = useState("");
  const [invitationReady, setInvitationReady] = useState(false);
  const [checkingInvitation, setCheckingInvitation] = useState(false);
  const [busy, setBusy] = useState(false);
  const acceptGate = canAcceptAngelInvitation(activeProfile);
  const invitationPresentation = buildInvitationAcceptancePresentation({
    acceptGate,
    acceptedOwnerName,
    busy,
    checkingInvitation,
    hasInvitationCode: Boolean(invitationCode),
    invitationReady
  });

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void Promise.all([getActiveProtectionProfile(), getPendingInvitationToken()]).then(([profile, pendingToken]) => {
        if (!mounted) return;
        setActiveProfile(profile);
        setPendingInvitationCode(pendingToken);
        const nextInvitationCode = routeInvitationCode || pendingToken;
        if (routeInvitationCode) {
          void savePendingInvitationToken(routeInvitationCode, "deeplink");
        } else if (pendingToken) {
          setStatus(invitationAcceptanceMessages.resumed);
        }

        if (!nextInvitationCode) {
          setInvitationReady(false);
          return;
        }

        setCheckingInvitation(true);
        setInvitationReady(false);
        setStatus(invitationAcceptanceMessages.verifying);
        void validateBackendInvitationToken(nextInvitationCode)
          .then(async (invitationStatus) => {
            if (!mounted) return;
            if (invitationStatus.status === "available" && invitationStatus.can_accept) {
              setInvitationReady(true);
              setStatus(invitationStatus.message || invitationAcceptanceMessages.routeIdentified);
              return;
            }
            setInvitationReady(false);
            setStatus(invitationAcceptanceMessages.unavailable);
            await clearPendingInvitationToken();
            if (mounted) setPendingInvitationCode("");
          })
          .catch((error) => {
            if (!mounted) return;
            setInvitationReady(false);
            setStatus(error instanceof Error ? error.message : "Nao foi possivel verificar o convite agora.");
          })
          .finally(() => {
            if (mounted) setCheckingInvitation(false);
          });
      });
      return () => {
        mounted = false;
      };
    }, [routeInvitationCode])
  );

  async function handleAcceptInvitation() {
    if (!invitationCode) {
      setStatus(invitationAcceptanceMessages.acceptMissing);
      return;
    }
    if (!invitationReady) {
      setStatus(invitationAcceptanceMessages.acceptRequiresServer);
      return;
    }
    if (!acceptGate.allowed) {
      setStatus(acceptGate.message);
      return;
    }

    setBusy(true);
    setStatus("Validando convite com sua conta e dispositivo...");
    try {
      const invitationStatus = await validateBackendInvitationToken(invitationCode);
      if (invitationStatus.status !== "available" || !invitationStatus.can_accept) {
        await clearPendingInvitationToken();
        setPendingInvitationCode("");
        setInvitationReady(false);
        setStatus(invitationAcceptanceMessages.unavailable);
        return;
      }
      const acceptedRelationship = await acceptBackendInvitation(invitationCode);
      const ownerName = acceptedRelationship.owner_display_name || "a pessoa que enviou o convite";
      await cacheTrustedContactRelationship(acceptedRelationship, "acceptance");
      await clearPendingInvitationToken();
      setPendingInvitationCode("");
      setInvitationReady(false);
      setAcceptedOwnerName(ownerName);
      setStatus(invitationAcceptanceMessages.accepted(ownerName));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel aceitar o convite agora.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeScreen
      title={invitationAcceptanceScreenCopy.title}
      subtitle={invitationAcceptanceScreenCopy.subtitle}
    >
      <StatusBanner
        tone={invitationReady ? "secure" : "warning"}
        title={invitationPresentation.bannerTitle}
        text={status}
      />
      <StatusBanner
        tone={invitationAcceptanceScreenCopy.securityNotice.tone}
        title={invitationAcceptanceScreenCopy.securityNotice.title}
        text={invitationAcceptanceScreenCopy.securityNotice.text}
      />
      {invitationPresentation.acceptedOwnerNotice ? (
        <StatusBanner
          tone={invitationPresentation.acceptedOwnerNotice.tone}
          title={invitationPresentation.acceptedOwnerNotice.title}
          text={invitationPresentation.acceptedOwnerNotice.text}
        />
      ) : null}
      <StatusBanner
        tone={invitationPresentation.acceptStatus.tone}
        title={invitationPresentation.acceptStatus.title}
        text={invitationPresentation.acceptStatus.message}
      />
      {invitationPresentation.showProfileAction ? (
        <ButtonIcon
          disabled={busy}
          icon={<UserRound size={20} color={theme.colors.primary} />}
          label={invitationAcceptanceScreenCopy.profileButtonLabel}
          onPress={() => router.push("/perfis")}
        />
      ) : null}
      <ButtonIcon
        disabled={invitationPresentation.acceptButtonDisabled}
        icon={<UserCheck size={20} color={theme.colors.primary} />}
        label={invitationPresentation.acceptButtonLabel}
        onPress={handleAcceptInvitation}
      />
      {invitationPresentation.showAcceptedLinksAction ? (
        <ButtonIcon
          disabled={busy}
          icon={<Users size={20} color={theme.colors.primary} />}
          label={invitationAcceptanceScreenCopy.acceptedLinksButtonLabel}
          onPress={() => router.push({ pathname: "/contatos", params: { painel: "sou_anjo" } })}
        />
      ) : null}
    </SafeScreen>
  );
}
