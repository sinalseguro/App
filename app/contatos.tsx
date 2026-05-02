import { useEffect, useState } from "react";
import { Share } from "react-native";
import { UserPlus } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { InviteCard } from "@/components/InviteCard";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { trustedContactsMock } from "@/features/contacts/contactMocks";
import {
  buildInvitationShareText,
  createLocalInvitation,
  listLocalInvitations,
  markInvitationShared
} from "@/features/invitations/invitationService";
import { LocalInvitation } from "@/features/invitations/types";

function invitationDescription(invitation: LocalInvitation) {
  return `Convite local de uso unico. Expira em ${new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}. API aguardando sincronizacao.`;
}

export default function ContactsScreen() {
  const [invitations, setInvitations] = useState<LocalInvitation[]>([]);
  const [status, setStatus] = useState("Convites ficam salvos localmente ate a API validar uso unico e aceite.");

  async function refreshInvitations() {
    setInvitations(await listLocalInvitations());
  }

  useEffect(() => {
    void refreshInvitations();
  }, []);

  async function handleCreateInvitation() {
    setStatus("Gerando convite opaco...");
    const invitation = await createLocalInvitation(`Anjo ${invitations.length + 1}`);
    await Share.share({ message: buildInvitationShareText(invitation), url: invitation.inviteUrl });
    await markInvitationShared(invitation.id);
    await refreshInvitations();
    setStatus("Convite criado e pronto para aceite pela propria conta da pessoa convidada.");
  }

  return (
    <SafeScreen
      title="Rede de anjos"
      subtitle="Convites usam token opaco, expiram e exigem aceite com conta propria."
    >
      <StatusBanner tone="secure" title="Convite seguro" text={status} />
      <ButtonIcon
        icon={<UserPlus size={20} color={theme.colors.primary} />}
        label="Criar convite de anjo"
        onPress={handleCreateInvitation}
      />
      {trustedContactsMock.map((contact) => (
        <InviteCard key={contact.id} name={contact.name} status={contact.status} description={contact.description} />
      ))}
      {invitations.map((invitation) => (
        <InviteCard
          key={invitation.id}
          name={invitation.displayLabel}
          status={invitation.status === "revogado" ? "revogado" : "pendente"}
          description={invitationDescription(invitation)}
        />
      ))}
    </SafeScreen>
  );
}
