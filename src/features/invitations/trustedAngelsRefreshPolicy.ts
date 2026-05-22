import type { ApiInvitation, ApiSession, ApiTrustedContact, ApiTrustedContactRelationship } from "@/services/apiClient";

export type TrustedAngelsPanel = "estado" | "prontidao" | "anjos" | "sou_anjo" | "convites" | null;

export const TRUSTED_ANGELS_REFRESH_INTERVAL_MS = 15000;

export function resolveTrustedAngelsRefreshStart({
  inFlight,
  silent
}: {
  inFlight: boolean;
  silent?: boolean;
}) {
  return {
    clearBusy: !silent,
    setBusy: !silent,
    shouldRefresh: !inFlight,
    silent: Boolean(silent)
  };
}

export function buildTrustedAngelsLocalRefreshState({
  cachedRelationships,
  currentSession,
  registeredDeviceId
}: {
  cachedRelationships: ApiTrustedContactRelationship[];
  currentSession: ApiSession | null;
  registeredDeviceId?: string | null;
}) {
  return {
    apiSession: currentSession,
    deviceReady: Boolean(registeredDeviceId),
    trustedRelationships: cachedRelationships
  };
}

export function resolveTrustedAngelsNoSessionRefresh({ silent }: { silent: boolean }) {
  return {
    backendInvitations: [] as ApiInvitation[],
    status: silent ? undefined : "Entre com sua conta para sincronizar anjos.",
    trustedContacts: [] as ApiTrustedContact[],
    trustedRelationships: [] as ApiTrustedContactRelationship[]
  };
}

export function resolveTrustedAngelsRemoteRefreshOutcome({
  cachedRelationshipsCount,
  contactsResult,
  relationshipsResult,
  remoteInvitationsResult,
  silent
}: {
  cachedRelationshipsCount: number;
  contactsResult: PromiseSettledResult<ApiTrustedContact[]>;
  relationshipsResult: PromiseSettledResult<ApiTrustedContactRelationship[]>;
  remoteInvitationsResult: PromiseSettledResult<ApiInvitation[]>;
  silent: boolean;
}) {
  const outcome: {
    backendInvitations?: ApiInvitation[];
    cacheRelationships?: ApiTrustedContactRelationship[];
    status?: string;
    trustedContacts?: ApiTrustedContact[];
    trustedRelationships?: ApiTrustedContactRelationship[];
  } = {};

  if (contactsResult.status === "fulfilled") {
    outcome.trustedContacts = contactsResult.value;
  }
  if (remoteInvitationsResult.status === "fulfilled") {
    outcome.backendInvitations = remoteInvitationsResult.value;
  }
  if (relationshipsResult.status === "fulfilled") {
    outcome.cacheRelationships = relationshipsResult.value;
    outcome.trustedRelationships = relationshipsResult.value;
    if (!silent) {
      outcome.status = "Anjos atualizados.";
    }
    return outcome;
  }

  if (silent) return outcome;

  if (cachedRelationshipsCount > 0) {
    outcome.status = "Sem internet agora. Mostrando vínculos salvos neste aparelho.";
  } else {
    outcome.status =
      relationshipsResult.reason instanceof Error
        ? relationshipsResult.reason.message
        : "Nao foi possivel atualizar vinculos agora.";
  }

  return outcome;
}

export function resolveTrustedAngelsRefreshFailure({
  message,
  silent
}: {
  message: string;
  silent: boolean;
}) {
  return {
    status: silent ? undefined : message || "Não foi possível atualizar anjos agora."
  };
}

export function shouldRefreshTrustedAngelsOnAppState(state: string) {
  return state === "active";
}

export function resolveTrustedAngelsPanelParam(panel?: string): TrustedAngelsPanel {
  if (panel === "anjos" || panel === "sou_anjo" || panel === "convites") {
    return panel;
  }
  return null;
}
