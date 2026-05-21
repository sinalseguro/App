import type { LocalInvitation } from "@/features/invitations/types";
import type { ApiTrustedContactRelationship } from "@/services/apiClient";

export type TrustedAngelsEmptyState = {
  icon: "userCheck" | "users";
  text: string;
  title: string;
};

export type TrustedAngelsRelationshipPanelState = {
  emptyState: TrustedAngelsEmptyState;
  items: ApiTrustedContactRelationship[];
};

export type TrustedAngelsInvitationSection = {
  invitations: LocalInvitation[];
  key: "backend_validated" | "local_pre_invite";
  title: string;
  tone: "primary" | "warning";
};

export type TrustedAngelsInvitationPanelState = {
  emptyState?: TrustedAngelsEmptyState;
  sections: TrustedAngelsInvitationSection[];
};

export function buildTrustedAngelsOwnerPanelState(
  relationships: ApiTrustedContactRelationship[]
): TrustedAngelsRelationshipPanelState {
  return {
    emptyState: {
      icon: "users",
      text: "O vínculo só nasce após aceite com conta própria.",
      title: "Nenhum anjo ativo ainda"
    },
    items: relationships
  };
}

export function buildTrustedAngelsAngelPanelState(
  relationships: ApiTrustedContactRelationship[]
): TrustedAngelsRelationshipPanelState {
  return {
    emptyState: {
      icon: "userCheck",
      text: "Quando aceitar um convite, o nome de quem convidou aparecerá aqui.",
      title: "Você ainda não é anjo"
    },
    items: relationships
  };
}

export function buildTrustedAngelsInvitationPanelState({
  backendValidatedInvitations,
  invitationCount,
  localPreInvitations
}: {
  backendValidatedInvitations: LocalInvitation[];
  invitationCount: number;
  localPreInvitations: LocalInvitation[];
}): TrustedAngelsInvitationPanelState {
  const sections: TrustedAngelsInvitationSection[] = [];
  if (backendValidatedInvitations.length > 0) {
    sections.push({
      invitations: backendValidatedInvitations,
      key: "backend_validated",
      title: "Convites validados",
      tone: "primary"
    });
  }
  if (localPreInvitations.length > 0) {
    sections.push({
      invitations: localPreInvitations,
      key: "local_pre_invite",
      title: "Convites antigos sem servidor",
      tone: "warning"
    });
  }

  return {
    emptyState:
      invitationCount === 0
        ? {
            icon: "users",
            text: "Crie um convite quando quiser preparar um anjo.",
            title: "Nenhum convite criado"
          }
        : undefined,
    sections
  };
}
