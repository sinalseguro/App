export type OwnerLiveEvidenceStatus = "ended" | "failed" | "metadata_only" | "protected" | "recording" | "transmitting";
export type OwnerLocalEvidenceStatus = "failed" | "metadata_only" | "protected" | "recording";

export type OwnerLiveCallEvidenceRecord = {
  connectedAt?: string | null;
  durationSeconds: number;
  endedAt?: string | null;
  id: string;
  legal: {
    shareRestriction: string;
  };
  localEvidenceStatus: OwnerLocalEvidenceStatus;
  packageId: string;
  remoteSessionId: string;
  role: "owner";
  schemaVersion: "sinalseguro.owner-live-call-evidence.v1";
  snapshot: {
    backendSummary: string;
    mediaSummary: string;
    recipientScope: string;
  };
  startedAt: string;
  status: OwnerLiveEvidenceStatus;
  updatedAt: string;
};

type BuildOwnerEvidenceInput = {
  packageId: string;
  remoteSessionId: string;
  startedAt?: string;
};

type UpdateOwnerEvidenceInput = {
  connectedAt?: string | null;
  endedAt?: string | null;
  localEvidenceStatus?: OwnerLocalEvidenceStatus;
  now?: string;
  status?: OwnerLiveEvidenceStatus;
};

export function ownerLiveCallEvidenceId(remoteSessionId: string) {
  return `owner-live-call-${remoteSessionId}`;
}

export function buildOwnerLiveCallEvidence(
  input: BuildOwnerEvidenceInput,
  options: UpdateOwnerEvidenceInput = {}
): OwnerLiveCallEvidenceRecord {
  const now = options.now ?? new Date().toISOString();
  const startedAt = input.startedAt ?? now;

  return {
    durationSeconds: 0,
    id: ownerLiveCallEvidenceId(input.remoteSessionId),
    legal: {
      shareRestriction:
        "Registro local do SOS. Compartilhe somente com a pessoa protegida, atendimento autorizado ou autoridade competente."
    },
    localEvidenceStatus: options.localEvidenceStatus ?? "recording",
    packageId: input.packageId,
    remoteSessionId: input.remoteSessionId,
    role: "owner",
    schemaVersion: "sinalseguro.owner-live-call-evidence.v1",
    snapshot: {
      backendSummary: "A EC2 registrou controle, sinalizacao e auditoria saneada, sem audio/video bruto.",
      mediaSummary: "A midia ao vivo trafega entre aparelhos autorizados. O registro local preserva o estado do SOS.",
      recipientScope: "Anjo autorizado da ocorrencia"
    },
    startedAt,
    status: options.status ?? "recording",
    updatedAt: now
  };
}

export function updateOwnerLiveCallEvidence(
  record: OwnerLiveCallEvidenceRecord,
  options: UpdateOwnerEvidenceInput
): OwnerLiveCallEvidenceRecord {
  const now = options.now ?? new Date().toISOString();
  const connectedAt = options.connectedAt === undefined ? record.connectedAt : options.connectedAt;
  const endedAt = options.endedAt === undefined ? record.endedAt : options.endedAt;
  const nextRecord = {
    ...record,
    connectedAt,
    endedAt,
    localEvidenceStatus: options.localEvidenceStatus ?? record.localEvidenceStatus,
    status: options.status ?? record.status,
    updatedAt: now
  };

  return {
    ...nextRecord,
    durationSeconds: calculateDurationSeconds(nextRecord.startedAt, nextRecord.endedAt ?? now)
  };
}

function calculateDurationSeconds(startedAt: string, endedAt: string) {
  const startedMs = new Date(startedAt).getTime();
  const endedMs = new Date(endedAt).getTime();
  if (!Number.isFinite(startedMs) || !Number.isFinite(endedMs) || endedMs <= startedMs) return 0;
  return Math.round((endedMs - startedMs) / 1000);
}
