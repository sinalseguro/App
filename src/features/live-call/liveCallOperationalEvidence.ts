import { getSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import {
  buildOwnerLiveCallEvidence,
  ownerLiveCallEvidenceId,
  updateOwnerLiveCallEvidence,
  type OwnerLiveCallEvidenceRecord,
  type OwnerLocalEvidenceStatus,
  type OwnerLiveEvidenceStatus
} from "./liveCallOperationalEvidencePolicy";

const ownerLiveCallEvidenceNamespace = "sinalseguro.owner-live-call-evidence.v1";

export async function beginOwnerLiveCallEvidence(input: {
  packageId: string;
  remoteSessionId: string;
  startedAt?: string;
}) {
  const id = ownerLiveCallEvidenceId(input.remoteSessionId);
  const existingRecord = await getSecureRecord<OwnerLiveCallEvidenceRecord>(ownerLiveCallEvidenceNamespace, id);
  const nextRecord =
    existingRecord ??
    buildOwnerLiveCallEvidence({
      packageId: input.packageId,
      remoteSessionId: input.remoteSessionId,
      startedAt: input.startedAt
    });

  await saveSecureRecord(ownerLiveCallEvidenceNamespace, nextRecord);
  return nextRecord;
}

export async function updateOwnerLiveCallEvidenceRecord(
  remoteSessionId: string,
  options: {
    connectedAt?: string | null;
    endedAt?: string | null;
    localEvidenceStatus?: OwnerLocalEvidenceStatus;
    now?: string;
    packageId?: string;
    status?: OwnerLiveEvidenceStatus;
  }
) {
  const id = ownerLiveCallEvidenceId(remoteSessionId);
  const currentRecord = await getSecureRecord<OwnerLiveCallEvidenceRecord>(ownerLiveCallEvidenceNamespace, id);
  const baseRecord =
    currentRecord ??
    (options.packageId
      ? buildOwnerLiveCallEvidence({
          packageId: options.packageId,
          remoteSessionId
        })
      : null);
  if (!baseRecord) return null;

  const nextRecord = updateOwnerLiveCallEvidence(baseRecord, options);
  await saveSecureRecord(ownerLiveCallEvidenceNamespace, nextRecord);
  return nextRecord;
}

export async function listOwnerLiveCallEvidenceRecords() {
  const records = await listSecureRecords<OwnerLiveCallEvidenceRecord>(ownerLiveCallEvidenceNamespace);
  return records.sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime());
}

export type { OwnerLiveCallEvidenceRecord, OwnerLocalEvidenceStatus, OwnerLiveEvidenceStatus };
