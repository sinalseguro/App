import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

type MediaOperationalLogValue = boolean | number | string | null | undefined;
type MediaOperationalLogFields = Record<string, MediaOperationalLogValue>;

const debugDirectoryUri = `${FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? ""}sinalseguro-debug/`;
export const mediaOperationalLogFileUri = `${debugDirectoryUri}media-operational-log.jsonl`;
const maxLogBytes = 180 * 1024;
const forbiddenFieldPattern = /(uri|url|path|key|token|nonce|tag|sha|latitude|longitude|payload|email|ip|capability)/i;
const forbiddenValuePattern = /(file:\/\/|https?:\/\/|\/data\/|\/var\/|\/Users\/|Bearer\s+|eyJ|@|latitude|longitude)/i;

let appendQueue = Promise.resolve();

export function shouldPersistMediaOperationalLog() {
  return Platform.OS === "ios" && Boolean(FileSystem.cacheDirectory ?? FileSystem.documentDirectory);
}

export function appendMediaOperationalLog(event: string, fields: MediaOperationalLogFields = {}, error?: unknown) {
  if (!shouldPersistMediaOperationalLog()) return;

  appendQueue = appendQueue
    .catch(() => undefined)
    .then(() => appendMediaOperationalLogEntry(event, fields, error))
    .catch(() => undefined);
}

async function appendMediaOperationalLogEntry(event: string, fields: MediaOperationalLogFields, error?: unknown) {
  await FileSystem.makeDirectoryAsync(debugDirectoryUri, { intermediates: true }).catch(() => undefined);

  const currentContent = await FileSystem.readAsStringAsync(mediaOperationalLogFileUri).catch(() => "");
  const nextEntry = JSON.stringify({
    schemaVersion: "sinalseguro.media-operational-log.v1",
    recordedAt: new Date().toISOString(),
    event: sanitizeLogToken(event),
    fields: sanitizeFields(fields),
    ...(error ? { errorCode: classifyError(error) } : {})
  });
  const nextContent = trimLog(`${currentContent}${nextEntry}\n`);

  await FileSystem.writeAsStringAsync(mediaOperationalLogFileUri, nextContent);
}

function sanitizeFields(fields: MediaOperationalLogFields) {
  return Object.fromEntries(
    Object.entries(fields)
      .filter(([key]) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) && !forbiddenFieldPattern.test(key))
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter((entry): entry is [string, boolean | number | string | null] => entry[1] !== undefined)
  );
}

function sanitizeValue(value: MediaOperationalLogValue) {
  if (value === undefined) return undefined;
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : null;

  if (forbiddenValuePattern.test(value)) return "redacted";
  return sanitizeLogToken(value);
}

function sanitizeLogToken(value: string) {
  return value.slice(0, 80).replace(/[^a-zA-Z0-9_.:-]/g, "_");
}

function classifyError(error: unknown) {
  const errorRecord = typeof error === "object" && error !== null ? error as Record<string, unknown> : {};
  const errorText = error instanceof Error
    ? `${error.name} ${error.message}`
    : `${String(errorRecord.name ?? "")} ${String(errorRecord.code ?? "")} ${String(errorRecord.message ?? error ?? "")}`;
  const nativeCode = errorText.match(/\b(native_[a-z0-9_]+|camera_[a-z0-9_]+)\b/i)?.[1];
  if (nativeCode) return sanitizeLogToken(nativeCode);
  if (/cancel/i.test(errorText)) return "cancelled";
  if (/permission|authori[sz]|denied/i.test(errorText)) return "permission_error";
  if (/ready|output/i.test(errorText)) return "camera_output_not_ready";
  if (/camera_no_file_returned/i.test(errorText)) return "camera_no_file_returned";
  return "media_error";
}

function trimLog(content: string) {
  if (content.length <= maxLogBytes) return content;
  const trimmed = content.slice(content.length - maxLogBytes);
  const firstLineBreak = trimmed.indexOf("\n");
  return firstLineBreak >= 0 ? trimmed.slice(firstLineBreak + 1) : trimmed;
}
