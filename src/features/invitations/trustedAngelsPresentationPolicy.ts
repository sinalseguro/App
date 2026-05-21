import type { LocalInvitation } from "@/features/invitations/types";
import type { ApiInvitation, ApiSession, ApiTrustedContact, ApiTrustedContactRelationship } from "@/services/apiClient";

export type ScreenNotice = {
  text: string;
  title: string;
  tone: "secure" | "warning" | "danger";
};

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  });
}

export function invitationDescription(invitation: LocalInvitation) {
  if (invitation.syncStatus !== "backend_validated") {
    return "Convite antigo sem validacao no servidor. Gere um novo convite seguro.";
  }
  if (invitation.status === "compartilhado") {
    return "Convite compartilhado. O vínculo só nasce após aceite com conta própria.";
  }
  if (invitation.status === "expirado") {
    return "Convite expirado. Gere um novo convite se esta pessoa ainda deve participar.";
  }
  if (invitation.status === "revogado") {
    return "Convite revogado neste aparelho.";
  }
  return "Aguardando compartilhamento e aceite com conta própria.";
}

export function invitationDetail(invitation: LocalInvitation) {
  const source = invitation.syncStatus === "backend_validated" ? "Servidor validado" : "Nao sincronizado";
  return `${source} · expira em ${formatShortDate(invitation.expiresAt)}`;
}

export function contactStatus(contact: ApiTrustedContact): "aceito" | "pendente" | "revogado" {
  if (contact.status === "accepted") return "aceito";
  if (contact.status === "revoked") return "revogado";
  return "pendente";
}

export function trustedRelationshipName(relationship: ApiTrustedContactRelationship) {
  if (relationship.relationship_role === "angel") {
    return relationship.owner_display_name || "Pessoa protegida";
  }
  return relationship.contact_display_name || relationship.display_label || "Anjo autorizado";
}

export function trustedRelationshipDetail(relationship: ApiTrustedContactRelationship) {
  const dateLabel = relationship.accepted_at
    ? `Aceito em ${formatShortDate(relationship.accepted_at)}`
    : "Conta própria exigida";
  if (relationship.relationship_role === "angel") {
    return `Sou anjo · ${dateLabel}`;
  }
  return `Meu anjo · ${dateLabel}`;
}

export function trustedRelationshipDescription(relationship: ApiTrustedContactRelationship) {
  const name = trustedRelationshipName(relationship);
  if (relationship.status === "revoked") {
    return relationship.relationship_role === "angel"
      ? `Vínculo com ${name} revogado.`
      : `Vínculo com ${name} revogado. Esta pessoa não recebe novas entregas.`;
  }
  if (relationship.relationship_role === "angel") {
    return `Você aceitou ser anjo de ${name}. Você só verá alertas autorizados pelo SinalSeguro.`;
  }
  return `${name} aceitou ser seu anjo de confiança. Nada é enviado fora de um alerta autorizado.`;
}

export function acceptedOwnerSummary(count: number) {
  if (count === 0) return "Nenhum";
  if (count === 1) return "1 aceitou";
  return `${count} aceitaram`;
}

export function acceptedAngelSummary(count: number) {
  if (count === 0) return "Nenhum";
  if (count === 1) return "1 pessoa";
  return `${count} pessoas`;
}

export function relationshipNamesSummary(relationships: ApiTrustedContactRelationship[], fallback: string) {
  const names = relationships
    .filter((relationship) => relationship.status === "accepted")
    .map(trustedRelationshipName)
    .filter(Boolean);

  if (names.length === 0) return fallback;
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} e ${names[1]}`;
  return `${names[0]} e mais ${names.length - 1}`;
}

export function invitationFromApi(invitation: ApiInvitation): LocalInvitation {
  return {
    id: invitation.id,
    backendInvitationId: invitation.id,
    trustedContactId: invitation.trusted_contact,
    token: "",
    displayLabel: invitation.display_label,
    inviteUrl: "",
    deepLinkUrl: "",
    createdAt: invitation.created_at,
    expiresAt: invitation.expires_at,
    singleUsePolicy: "backend_single_use_enforced",
    status:
      invitation.status === "accepted"
        ? "aceito"
        : invitation.status === "revoked"
          ? "revogado"
          : new Date(invitation.expires_at).getTime() < Date.now()
            ? "expirado"
            : "pendente",
    syncStatus: "backend_validated"
  };
}

export function trustedContactFallbackRelationship(contact: ApiTrustedContact): ApiTrustedContactRelationship {
  return {
    ...contact,
    contact_display_name: contact.contact_display_name || contact.display_label,
    owner_display_name: "",
    relationship_role: "owner"
  };
}

export function buildNotice({
  apiSession,
  angelLinks,
  busy,
  invitations,
  ownerLinks
}: {
  apiSession: ApiSession | null;
  angelLinks: ApiTrustedContactRelationship[];
  busy: boolean;
  invitations: LocalInvitation[];
  ownerLinks: ApiTrustedContactRelationship[];
}): ScreenNotice {
  if (busy) {
    return {
      text: "Atualizando vínculos e convites.",
      title: "Sincronizando",
      tone: "secure"
    };
  }

  const acceptedOwnerCount = ownerLinks.filter((contact) => contact.status === "accepted").length;
  const acceptedAngelCount = angelLinks.filter((contact) => contact.status === "accepted").length;
  if (acceptedOwnerCount > 0 || acceptedAngelCount > 0) {
    const ownerText =
      acceptedOwnerCount > 0
        ? acceptedOwnerCount === 1
          ? `${relationshipNamesSummary(ownerLinks, "1 pessoa")} aceitou ser seu anjo`
          : `${acceptedOwnerCount} anjos autorizados, incluindo ${relationshipNamesSummary(ownerLinks, "pessoas de confianca")}`
        : "";
    const angelText =
      acceptedAngelCount > 0
        ? acceptedAngelCount === 1
          ? `você é anjo de ${relationshipNamesSummary(angelLinks, "1 pessoa")}`
          : `você é anjo de ${acceptedAngelCount} pessoas, incluindo ${relationshipNamesSummary(angelLinks, "pessoas protegidas")}`
        : "";
    return {
      text: `${[ownerText, angelText].filter(Boolean).join(" e ")}. Nada é enviado fora de um alerta autorizado.`,
      title: acceptedAngelCount > 0 && acceptedOwnerCount === 0 ? "Você é anjo" : "Meus anjos",
      tone: "secure"
    };
  }

  if (invitations.some((invitation) => invitation.status === "compartilhado")) {
    return {
      text: "Convite compartilhado. O vínculo só nasce quando a pessoa aceita com a própria conta.",
      title: "Aguardando aceite",
      tone: "warning"
    };
  }

  if (invitations.length > 0) {
    return {
      text: "Convite criado neste aparelho. Evidências e localização não foram enviadas.",
      title: "Convite preparado",
      tone: "warning"
    };
  }

  return {
    text: apiSession
      ? "Convide uma pessoa de confiança. O convite é o único dado compartilhado nesta etapa."
      : "Entre em Configurações > Login para criar convite validado pela API. Sem login, o convite fica local.",
    title: "Nenhum anjo ativo ainda",
    tone: apiSession ? "secure" : "warning"
  };
}
