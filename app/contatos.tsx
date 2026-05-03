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
  return `Pre-convite local com token opaco. Validade sugerida ate ${new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}; aceite e revogacao dependem de validacao online.`;
}

export default function ContactsScreen() {
  const [invitations, setInvitations] = useState<LocalInvitation[]>([]);
  const [status, setStatus] = useState("Pre-convites ficam salvos localmente ate validacao online, aceite proprio e revogacao.");

  async function refreshInvitations() {
    setInvitations(await listLocalInvitations());
  }

  useEffect(() => {
    void refreshInvitations();
  }, []);

  async function handleCreateInvitation() {
    setStatus("Gerando convite opaco...");
    const invitation = await createLocalInvitation(`Anjo ${invitations.length + 1}`);
    // Convite e a unica excecao de share sheet: nao carrega evidencias nem dados sensiveis.
    await Share.share({ message: buildInvitationShareText(invitation), url: invitation.inviteUrl });
    await markInvitationShared(invitation.id);
    await refreshInvitations();
    setStatus("Pre-convite criado. O vinculo real so nasce apos login proprio e validacao online.");
  }

  return (
    <SafeScreen
      title="Rede de anjos"
      subtitle="Pre-convites usam token opaco local e exigem aceite com conta propria."
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
