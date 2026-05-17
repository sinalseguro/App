import type { ApiEmergencySession } from "@/services/apiClient";
import { getSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import {
  buildLiveCallShareText,
  buildReceivedCallArchive,
  formatLiveCallDate,
  formatLiveCallDuration,
  liveCallArchiveId,
  updateLiveCallArchive,
  type LiveCallArchiveRecord,
  type LiveCallArchiveStatus
} from "./liveCallHistoryPolicy";

const liveCallArchiveNamespace = "sinalseguro.live-call-archive.v1";

export async function beginReceivedLiveCallArchive(
  session: ApiEmergencySession,
  options?: { now?: string; status?: LiveCallArchiveStatus }
) {
  const id = liveCallArchiveId(session.id);
  const existingRecord = await getSecureRecord<LiveCallArchiveRecord>(liveCallArchiveNamespace, id);
  const nextRecord =
    existingRecord ??
    buildReceivedCallArchive(
      {
        id: session.id,
        ownerDisplayName: session.owner_display_name,
        protectedSubjectId: session.protected_subject,
        startedAt: session.started_at
      },
      options
    );

  await saveSecureRecord(liveCallArchiveNamespace, nextRecord);
  return nextRecord;
}

export async function updateReceivedLiveCallArchive(
  id: string,
  options: {
    connectedAt?: string | null;
    endedAt?: string | null;
    now?: string;
    status?: LiveCallArchiveStatus;
  }
) {
  const currentRecord = await getSecureRecord<LiveCallArchiveRecord>(liveCallArchiveNamespace, id);
  if (!currentRecord) return null;

  const nextRecord = updateLiveCallArchive(currentRecord, options);
  await saveSecureRecord(liveCallArchiveNamespace, nextRecord);
  return nextRecord;
}

export async function listReceivedLiveCallArchives() {
  const records = await listSecureRecords<LiveCallArchiveRecord>(liveCallArchiveNamespace);
  return records.sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime());
}

export { buildLiveCallShareText, formatLiveCallDate, formatLiveCallDuration };
export type { LiveCallArchiveRecord, LiveCallArchiveStatus };
