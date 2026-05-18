import type { LiveAudioStatus } from "@/features/live-call/liveCallSessionPolicy";

export type OwnerAutoCallDecisionInput = {
  alreadyStarted: boolean;
  cancelled: boolean;
  currentRemoteSessionId?: string | null;
  currentStatus: LiveAudioStatus;
  inFlight: boolean;
  liveRemoteSessionId: string | null;
  paused: boolean;
};

export type OwnerAutoCallRecipientStatus = {
  message: string;
  shouldStartCall: boolean;
};

const activeOwnerLiveStatuses: LiveAudioStatus[] = ["waiting", "connecting", "connected"];

export function isOwnerLiveCallActiveForSession(
  input: Pick<OwnerAutoCallDecisionInput, "currentRemoteSessionId" | "currentStatus" | "liveRemoteSessionId">
) {
  return (
    Boolean(input.liveRemoteSessionId) &&
    input.currentRemoteSessionId === input.liveRemoteSessionId &&
    activeOwnerLiveStatuses.includes(input.currentStatus)
  );
}

export function shouldAttemptOwnerAutoCall(input: OwnerAutoCallDecisionInput) {
  return (
    Boolean(input.liveRemoteSessionId) &&
    !input.cancelled &&
    !input.paused &&
    !input.alreadyStarted &&
    !input.inFlight &&
    !isOwnerLiveCallActiveForSession(input)
  );
}

export function ownerAutoCallAttemptMessage() {
  return "Você pediu ajuda. Avisando anjo.";
}

export function ownerAutoCallRecipientStatus(recipientCount: number): OwnerAutoCallRecipientStatus {
  if (recipientCount <= 0) {
    return {
      message: "Você pediu ajuda. Aguardando anjo.",
      shouldStartCall: false
    };
  }

  return {
    message: "Anjo entrou. Chamando agora.",
    shouldStartCall: true
  };
}
