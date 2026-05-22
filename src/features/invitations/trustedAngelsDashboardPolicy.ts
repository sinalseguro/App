import type { EmergencyHomeRoute } from "@/features/emergency-home/routes";
import type { TrustedAngelsDialogKind } from "@/features/invitations/trustedAngelsDialogPolicy";
import { acceptedAngelSummary, acceptedOwnerSummary } from "@/features/invitations/trustedAngelsPresentationPolicy";
import type { TrustedAngelsPanel } from "@/features/invitations/trustedAngelsRefreshPolicy";
import type { ApiTrustedContactRelationship } from "@/services/apiClient";

export type TrustedAngelsDashboardSummary = {
  acceptedAngelDescription: string;
  acceptedOwnerDescription: string;
  createInvitationDescription: string;
  profileDescription: string;
  readinessDescription: string;
  stateDescription: string;
  syncDescription: string;
  invitationsDescription: string;
};

export type TrustedAngelsAcceptedCounts = {
  acceptedAngelCount: number;
  acceptedOwnerCount: number;
};

export type TrustedAngelsReadinessState = {
  account: {
    secure: boolean;
    label: string;
  };
  api: {
    enabled: boolean;
    label: string;
  };
  device: {
    secure: boolean;
    label: string;
  };
};

export type TrustedAngelsDashboardTileIcon =
  | "angel-links"
  | "invite"
  | "invitations"
  | "owner-links"
  | "profile"
  | "readiness"
  | "refresh"
  | "state";

type TrustedAngelsDashboardDialogKind = Extract<TrustedAngelsDialogKind, "invite" | "profile_block">;
type TrustedAngelsDashboardPanel = Exclude<TrustedAngelsPanel, null>;

export type TrustedAngelsDashboardTileAction =
  | {
      kind: "dialog";
      dialogKind: TrustedAngelsDashboardDialogKind;
    }
  | {
      kind: "panel";
      panel: TrustedAngelsDashboardPanel;
    }
  | {
      kind: "refresh";
    }
  | {
      kind: "route";
      route: EmergencyHomeRoute;
    };

export type TrustedAngelsDashboardTileKey =
  | "angel-links"
  | "invite"
  | "invitations"
  | "owner-links"
  | "profile"
  | "readiness"
  | "refresh"
  | "state";

export type TrustedAngelsDashboardTile = {
  action: TrustedAngelsDashboardTileAction;
  description: string;
  icon: TrustedAngelsDashboardTileIcon;
  key: TrustedAngelsDashboardTileKey;
  label: string;
};

export function buildTrustedAngelsAcceptedCounts({
  angelLinks,
  ownerLinks
}: {
  angelLinks: ApiTrustedContactRelationship[];
  ownerLinks: ApiTrustedContactRelationship[];
}): TrustedAngelsAcceptedCounts {
  return {
    acceptedAngelCount: angelLinks.filter((contact) => contact.status === "accepted").length,
    acceptedOwnerCount: ownerLinks.filter((contact) => contact.status === "accepted").length
  };
}

export function buildTrustedAngelsDashboardTileAction({
  invitationGateAllowed,
  tileKey
}: {
  invitationGateAllowed: boolean;
  tileKey: TrustedAngelsDashboardTileKey;
}): TrustedAngelsDashboardTileAction {
  switch (tileKey) {
    case "profile":
      return { kind: "route", route: "/perfis" };
    case "state":
      return { kind: "panel", panel: "estado" };
    case "invite":
      return {
        dialogKind: invitationGateAllowed ? "invite" : "profile_block",
        kind: "dialog"
      };
    case "readiness":
      return { kind: "panel", panel: "prontidao" };
    case "owner-links":
      return { kind: "panel", panel: "anjos" };
    case "angel-links":
      return { kind: "panel", panel: "sou_anjo" };
    case "invitations":
      return { kind: "panel", panel: "convites" };
    case "refresh":
      return { kind: "refresh" };
  }
}

export function buildTrustedAngelsDashboardTileRows({
  invitationGateAllowed,
  summary
}: {
  invitationGateAllowed: boolean;
  summary: TrustedAngelsDashboardSummary;
}): TrustedAngelsDashboardTile[][] {
  return [
    [
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "profile" }),
        description: summary.profileDescription,
        icon: "profile",
        key: "profile",
        label: "Perfil"
      },
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "state" }),
        description: summary.stateDescription,
        icon: "state",
        key: "state",
        label: "Estado"
      }
    ],
    [
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "invite" }),
        description: summary.createInvitationDescription,
        icon: "invite",
        key: "invite",
        label: "Criar convite"
      },
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "readiness" }),
        description: summary.readinessDescription,
        icon: "readiness",
        key: "readiness",
        label: "Prontidão"
      }
    ],
    [
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "owner-links" }),
        description: summary.acceptedOwnerDescription,
        icon: "owner-links",
        key: "owner-links",
        label: "Meus anjos"
      },
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "angel-links" }),
        description: summary.acceptedAngelDescription,
        icon: "angel-links",
        key: "angel-links",
        label: "Sou anjo"
      }
    ],
    [
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "invitations" }),
        description: summary.invitationsDescription,
        icon: "invitations",
        key: "invitations",
        label: "Convites"
      },
      {
        action: buildTrustedAngelsDashboardTileAction({ invitationGateAllowed, tileKey: "refresh" }),
        description: summary.syncDescription,
        icon: "refresh",
        key: "refresh",
        label: "Atualizar"
      }
    ]
  ];
}

export function buildTrustedAngelsDashboardSummary({
  acceptedAngelCount,
  acceptedOwnerCount,
  apiSessionAvailable,
  busy,
  deviceReady,
  invitationCount,
  invitationGateAllowed,
  noticeTitle,
  profileTitle
}: {
  acceptedAngelCount: number;
  acceptedOwnerCount: number;
  apiSessionAvailable: boolean;
  busy: boolean;
  deviceReady: boolean;
  invitationCount: number;
  invitationGateAllowed: boolean;
  noticeTitle: string;
  profileTitle: string;
}): TrustedAngelsDashboardSummary {
  return {
    acceptedAngelDescription: acceptedAngelSummary(acceptedAngelCount),
    acceptedOwnerDescription: acceptedOwnerSummary(acceptedOwnerCount),
    createInvitationDescription: invitationGateAllowed ? (apiSessionAvailable ? "API" : "Local") : "Bloqueado",
    invitationsDescription: invitationCount ? `${invitationCount} item` : "Nenhum",
    profileDescription: profileTitle,
    readinessDescription: deviceReady ? "Dispositivo" : "Pendente",
    stateDescription: noticeTitle,
    syncDescription: busy ? "Sincronizando" : "Sincronizar"
  };
}

export function buildTrustedAngelsReadinessState({
  apiEnabled,
  apiSessionAvailable,
  deviceReady
}: {
  apiEnabled: boolean;
  apiSessionAvailable: boolean;
  deviceReady: boolean;
}): TrustedAngelsReadinessState {
  return {
    account: {
      label: apiSessionAvailable ? "Conta conectada" : "Conta local",
      secure: apiSessionAvailable
    },
    api: {
      enabled: apiEnabled,
      label: apiEnabled ? "API configurada" : "API desativada"
    },
    device: {
      label: deviceReady ? "Dispositivo registrado" : "Dispositivo pendente",
      secure: deviceReady
    }
  };
}
