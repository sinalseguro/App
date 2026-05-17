export type LiveCallArchiveStatus = "connected" | "ended" | "failed" | "recording";
export type LiveCallShareTarget = "autoridade" | "usuario_protegido";

export type ReceivedCallSessionSnapshot = {
  id: string;
  ownerDisplayName?: string | null;
  protectedSubjectId?: string | null;
  startedAt: string;
};

export type LiveCallArchiveRecord = {
  connectedAt?: string | null;
  durationSeconds: number;
  endedAt?: string | null;
  id: string;
  legal: {
    allowedTargets: LiveCallShareTarget[];
    shareAllowed: boolean;
    shareRestriction: string;
  };
  protectedDisplayName: string;
  protectedSubjectId?: string | null;
  remoteSessionId: string;
  role: "angel";
  snapshot: {
    capturedAt: string;
    label: string;
    mediaSummary: string;
    recipientScope: string;
    subtitle: string;
  };
  startedAt: string;
  status: LiveCallArchiveStatus;
  updatedAt: string;
};

type BuildArchiveOptions = {
  now?: string;
  status?: LiveCallArchiveStatus;
};

type UpdateArchiveOptions = {
  connectedAt?: string | null;
  endedAt?: string | null;
  now?: string;
  status?: LiveCallArchiveStatus;
};

export function liveCallArchiveId(remoteSessionId: string) {
  return `received-live-call-${remoteSessionId}`;
}

export function buildReceivedCallArchive(
  session: ReceivedCallSessionSnapshot,
  options: BuildArchiveOptions = {}
): LiveCallArchiveRecord {
  const now = options.now ?? new Date().toISOString();
  const protectedDisplayName = sanitizeDisplayName(session.ownerDisplayName);

  return {
    durationSeconds: 0,
    id: liveCallArchiveId(session.id),
    legal: {
      allowedTargets: ["autoridade", "usuario_protegido"],
      shareAllowed: true,
      shareRestriction:
        "Compartilhe somente quando houver pedido da pessoa protegida, atendimento autorizado ou autoridade competente. Nao publique nem encaminhe para terceiros."
    },
    protectedDisplayName,
    protectedSubjectId: session.protectedSubjectId ?? null,
    remoteSessionId: session.id,
    role: "angel",
    snapshot: {
      capturedAt: now,
      label: protectedDisplayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "SS",
      mediaSummary:
        "Registro local da chamada recebida. A midia ao vivo permanece P2P e o backend nao recebe audio/video.",
      recipientScope: "Anjo autorizado da ocorrencia",
      subtitle: `Pedido recebido em ${formatLiveCallDate(session.startedAt)}`
    },
    startedAt: now,
    status: options.status ?? "recording",
    updatedAt: now
  };
}

export function updateLiveCallArchive(
  record: LiveCallArchiveRecord,
  options: UpdateArchiveOptions
): LiveCallArchiveRecord {
  const now = options.now ?? new Date().toISOString();
  const connectedAt = options.connectedAt === undefined ? record.connectedAt : options.connectedAt;
  const endedAt = options.endedAt === undefined ? record.endedAt : options.endedAt;
  const nextRecord = {
    ...record,
    connectedAt,
    endedAt,
    status: options.status ?? record.status,
    updatedAt: now
  };

  return {
    ...nextRecord,
    durationSeconds: calculateDurationSeconds(nextRecord.startedAt, nextRecord.endedAt ?? now)
  };
}

export function formatLiveCallDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "2-digit"
  }).format(new Date(value));
}

export function formatLiveCallDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const roundedSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(roundedSeconds / 60);
  const restSeconds = roundedSeconds % 60;
  if (!minutes) return `${restSeconds}s`;
  return `${minutes}min ${String(restSeconds).padStart(2, "0")}s`;
}

export function buildLiveCallShareText(record: LiveCallArchiveRecord) {
  return [
    "Registro SinalSeguro de chamada recebida",
    `Pessoa protegida: ${record.protectedDisplayName}`,
    `Inicio: ${formatLiveCallDate(record.startedAt)}`,
    `Fim: ${record.endedAt ? formatLiveCallDate(record.endedAt) : "em andamento"}`,
    `Duracao: ${formatLiveCallDuration(record.durationSeconds)}`,
    `Ocorrencia: ${record.remoteSessionId}`,
    "",
    record.snapshot.mediaSummary,
    record.legal.shareRestriction
  ].join("\n");
}

function sanitizeDisplayName(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || "Pessoa protegida";
}

function calculateDurationSeconds(startedAt: string, endedAt: string) {
  const startedMs = new Date(startedAt).getTime();
  const endedMs = new Date(endedAt).getTime();
  if (!Number.isFinite(startedMs) || !Number.isFinite(endedMs) || endedMs <= startedMs) return 0;
  return Math.round((endedMs - startedMs) / 1000);
}
