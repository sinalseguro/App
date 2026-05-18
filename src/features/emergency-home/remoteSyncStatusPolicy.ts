import type { EmergencyRemoteSyncState } from "@/features/emergency/emergencySyncQueue";

export type ActiveRemoteSyncStatus = {
  beginLiveEvidence: boolean;
  message: string;
  remoteSessionId: string | null;
};

export type ActiveRemoteSyncStatusOptions = {
  locationText?: string;
};

type RemoteSyncStatusInput = Pick<
  EmergencyRemoteSyncState,
  "recipientCount" | "remoteSessionId" | "status"
>;

const defaultLocationText = "Localizacao preservada.";
const retryMessage = "SOS local ativo. Tentando avisar seus anjos pela internet.";

export function activeRemoteSyncRetryMessage() {
  return retryMessage;
}

export function activeRemoteSyncStatusMessage(
  syncState: RemoteSyncStatusInput,
  options: ActiveRemoteSyncStatusOptions = {}
) {
  const locationText = options.locationText ?? defaultLocationText;

  if (syncState.status === "sent_to_ec2") {
    if (syncState.recipientCount > 0) {
      return `Você pediu ajuda. ${locationText} Pedido enviado para ${syncState.recipientCount} anjo${
        syncState.recipientCount === 1 ? "" : "s"
      }.`;
    }

    return `Você pediu ajuda. ${locationText} Pedido registrado. Aguardando anjo disponível.`;
  }

  if (syncState.status === "blocked_login") {
    return "SOS local ativo. Entre com Google para avisar seus anjos quando houver internet.";
  }

  return retryMessage;
}

export function resolveActiveRemoteSyncStatus(
  syncState: RemoteSyncStatusInput,
  options: ActiveRemoteSyncStatusOptions = {}
): ActiveRemoteSyncStatus {
  const remoteSessionId = syncState.status === "sent_to_ec2" ? syncState.remoteSessionId ?? null : null;

  return {
    beginLiveEvidence: Boolean(remoteSessionId),
    message: activeRemoteSyncStatusMessage(syncState, options),
    remoteSessionId
  };
}
