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
  return `Convite criado em ${new Date(invitation.createdAt).toLocaleDateString("pt-BR")}. A pessoa convidada precisa aceitar com a propria conta.`;
}

export default function ContactsScreen() {
  const [invitations, setInvitations] = useState<LocalInvitation[]>([]);
  const [status, setStatus] = useState(
    "Convites ficam salvos neste aparelho ate o aceite. Ligar 190 junto com o SOS fica em Configuracoes e vem desativado por padrao."
  );

  async function refreshInvitations() {
    setInvitations(await listLocalInvitations());
  }

  useEffect(() => {
    void refreshInvitations();
  }, []);

  async function handleCreateInvitation() {
    setStatus("Gerando convite seguro...");
    const invitation = await createLocalInvitation(`Anjo ${invitations.length + 1}`);
    // Convite e a unica excecao de share sheet: nao carrega evidencias nem dados sensiveis.
    await Share.share({ message: buildInvitationShareText(invitation), url: invitation.inviteUrl });
    await markInvitationShared(invitation.id);
    await refreshInvitations();
    setStatus("Convite criado. O vinculo nasce quando a pessoa aceita com a propria conta.");
  }

  return (
    <SafeScreen
      title="Rede de anjos"
      subtitle="Convide pessoas de confianca para receber ajuda autorizada."
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
