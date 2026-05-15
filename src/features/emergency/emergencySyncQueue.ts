import { ApiRequestError, apiConfig } from "@/services/apiClient";
import { listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import { syncEmergencySessionWithApi } from "@/services/emergencyDelivery";
import { getEmergencyPackage, listEmergencyPackages } from "./emergencyOutbox";
import { EmergencyPackage } from "./types";

const EMERGENCY_SYNC_NAMESPACE = "sinalseguro.emergency-remote-sync.v1";

export type EmergencyRemoteSyncState = {
  id: string;
  attempts: number;
  lastAttemptAt?: string;
  packageId: string;
  reason?: string;
  recipientCount: number;
  remoteSessionId?: string;
  status: "blocked_login" | "failed" | "pending" | "sent_to_ec2";
  syncedAt?: string;
  updatedAt: string;
};

function recipientCount(packageRecord: EmergencyPackage) {
  return packageRecord.deliveryPlan.trustedContacts.length;
}

export async function queueEmergencyPackageForRemoteSync(packageRecord: EmergencyPackage) {
  const existing = (await listSecureRecords<EmergencyRemoteSyncState>(EMERGENCY_SYNC_NAMESPACE)).find(
    (state) => state.packageId === packageRecord.id
  );

  if (existing?.status === "sent_to_ec2") return existing;

  const state: EmergencyRemoteSyncState = {
    id: packageRecord.id,
    attempts: existing?.attempts ?? 0,
    lastAttemptAt: existing?.lastAttemptAt,
    packageId: packageRecord.id,
    reason: existing?.reason,
    recipientCount: recipientCount(packageRecord),
    remoteSessionId: existing?.remoteSessionId,
    status: "pending",
    syncedAt: existing?.syncedAt,
    updatedAt: new Date().toISOString()
  };

  await saveSecureRecord(EMERGENCY_SYNC_NAMESPACE, state);
  return state;
}

export async function listEmergencyRemoteSyncStates() {
  return listSecureRecords<EmergencyRemoteSyncState>(EMERGENCY_SYNC_NAMESPACE);
}

async function markSyncState(
  state: EmergencyRemoteSyncState,
  patch: Omit<Partial<EmergencyRemoteSyncState>, "id" | "packageId">
) {
  const nextState: EmergencyRemoteSyncState = {
    ...state,
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await saveSecureRecord(EMERGENCY_SYNC_NAMESPACE, nextState);
  return nextState;
}

export async function syncPendingEmergencyPackagesWithApi() {
  if (!apiConfig.apiEnabled || !apiConfig.apiBaseUrl) return [];

  const states = await listEmergencyRemoteSyncStates();
  const packages = await listEmergencyPackages();
  const knownPackageIds = new Set(packages.map((packageRecord) => packageRecord.id));
  const candidates = states.filter(
    (state) => state.status !== "sent_to_ec2" && knownPackageIds.has(state.packageId)
  );
  const results: EmergencyRemoteSyncState[] = [];

  for (const candidate of candidates) {
    const packageRecord = await getEmergencyPackage(candidate.packageId);
    if (!packageRecord || packageRecord.status !== "recorded_local") continue;

    const attemptedAt = new Date().toISOString();
    const attempts = candidate.attempts + 1;

    try {
      const result = await syncEmergencySessionWithApi(packageRecord);
      if (result.status === "sent_to_ec2") {
        results.push(
          await markSyncState(candidate, {
            attempts,
            lastAttemptAt: attemptedAt,
            reason: undefined,
            recipientCount: recipientCount(packageRecord),
            remoteSessionId: result.remoteSession.id,
            status: "sent_to_ec2",
            syncedAt: new Date().toISOString()
          })
        );
        continue;
      }

      results.push(
        await markSyncState(candidate, {
          attempts,
          lastAttemptAt: attemptedAt,
          reason: result.reason,
          recipientCount: recipientCount(packageRecord),
          status: result.status === "login_required" ? "blocked_login" : "failed"
        })
      );
    } catch (error) {
      results.push(
        await markSyncState(candidate, {
          attempts,
          lastAttemptAt: attemptedAt,
          reason:
            error instanceof ApiRequestError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Falha ao sincronizar ocorrencia.",
          recipientCount: recipientCount(packageRecord),
          status: "failed"
        })
      );
    }
  }

  return results;
}
