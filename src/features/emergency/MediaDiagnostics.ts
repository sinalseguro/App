export type MediaDiagnosticStage =
  | "capture_mount"
  | "capture_recording"
  | "loopback_open"
  | "loopback_stream"
  | "playback_first_progress"
  | "playback_prepare"
  | "preserve_cleanup"
  | "preserve_encrypt_chunks"
  | "preserve_source_stat"
  | "preserve_thumbnail"
  | "preserve_total"
  | "preserve_verify";

export type MediaDiagnosticStatus = "cancelled" | "error" | "ok";

export type MediaDiagnosticMetricValue = boolean | number | string | null;

export type MediaDiagnosticMetrics = Record<string, MediaDiagnosticMetricValue>;

export type MediaDiagnosticEvent = {
  schemaVersion: "sinalseguro.media-diagnostic-event.v1";
  runId: string;
  stage: MediaDiagnosticStage;
  status: MediaDiagnosticStatus;
  startedAt: string;
  durationMs: number;
  metrics?: MediaDiagnosticMetrics;
  errorCode?: "cancelled" | "media_error";
};

export type MediaDiagnosticsSnapshot = {
  schemaVersion: "sinalseguro.media-diagnostics.v1";
  runId: string;
  recordedAt: string;
  events: MediaDiagnosticEvent[];
};

const maxDiagnosticEvents = 160;
const mediaDiagnosticEvents: MediaDiagnosticEvent[] = [];
const forbiddenMetricKeyPattern = /(uri|url|path|key|token|nonce|tag|sha|latitude|longitude|payload|email|ip|capability)/i;
const forbiddenMetricValuePattern = /(file:\/\/|https?:\/\/|\/data\/|\/var\/|\/Users\/|Bearer\s+|eyJ|@|latitude|longitude)/i;

export function createMediaDiagnosticRun(scope: string) {
  return `${scope}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listMediaDiagnosticEvents(runId?: string) {
  return mediaDiagnosticEvents.filter((event) => !runId || event.runId === runId);
}

export function clearMediaDiagnosticEvents() {
  mediaDiagnosticEvents.splice(0, mediaDiagnosticEvents.length);
}

export function summarizeMediaDiagnostics(runId: string): MediaDiagnosticsSnapshot {
  return {
    schemaVersion: "sinalseguro.media-diagnostics.v1",
    runId,
    recordedAt: new Date().toISOString(),
    events: listMediaDiagnosticEvents(runId)
  };
}

export function startMediaDiagnosticEvent(runId: string, stage: MediaDiagnosticStage) {
  const startedAt = new Date().toISOString();
  const startedMs = getMonotonicTimeMs();
  let finished = false;

  return {
    finish(status: MediaDiagnosticStatus = "ok", metrics?: MediaDiagnosticMetrics, error?: unknown) {
      if (finished) return;
      finished = true;
      recordMediaDiagnosticEvent({
        schemaVersion: "sinalseguro.media-diagnostic-event.v1",
        runId,
        stage,
        status,
        startedAt,
        durationMs: Math.max(0, Math.round(getMonotonicTimeMs() - startedMs)),
        ...(metrics ? { metrics: sanitizeMetrics(metrics) } : {}),
        ...(status === "error" || status === "cancelled" ? { errorCode: classifyDiagnosticError(error, status) } : {})
      });
    }
  };
}

function recordMediaDiagnosticEvent(event: MediaDiagnosticEvent) {
  mediaDiagnosticEvents.push(event);
  if (mediaDiagnosticEvents.length > maxDiagnosticEvents) {
    mediaDiagnosticEvents.splice(0, mediaDiagnosticEvents.length - maxDiagnosticEvents);
  }
}

function sanitizeMetrics(metrics: MediaDiagnosticMetrics) {
  return Object.fromEntries(
    Object.entries(metrics)
      .filter(([key]) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) && !forbiddenMetricKeyPattern.test(key))
      .map(([key, value]) => [key, sanitizeMetricValue(value)])
  );
}

function sanitizeMetricValue(value: MediaDiagnosticMetricValue): MediaDiagnosticMetricValue {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value) : null;
  }

  if (typeof value === "string") {
    if (forbiddenMetricValuePattern.test(value)) {
      return "redacted";
    }

    return value.slice(0, 64).replace(/[^a-zA-Z0-9_.:-]/g, "_");
  }

  return value;
}

function classifyDiagnosticError(error: unknown, status: MediaDiagnosticStatus): "cancelled" | "media_error" {
  if (status === "cancelled") return "cancelled";

  if (error instanceof Error && /cancel/i.test(error.name)) {
    return "cancelled";
  }

  return "media_error";
}

function getMonotonicTimeMs() {
  return globalThis.performance?.now?.() ?? Date.now();
}
