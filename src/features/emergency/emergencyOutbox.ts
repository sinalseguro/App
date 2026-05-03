import { deleteSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import * as FileSystem from "expo-file-system/legacy";
import { EmergencyPackage } from "./types";

const EMERGENCY_NAMESPACE = "sinalseguro.emergency-packages.v1";
const EMERGENCY_DELETION_AUDIT_NAMESPACE = "sinalseguro.emergency-package-deletions.v1";

export type EmergencyPackageDeletionAudit = {
  id: string;
  packageId: string;
  packageSha256?: string;
  packageCreatedAt?: string;
  deletedAt: string;
  action: "removed_from_device";
  reason: "user_requested_local_delete";
};

function normalizeEmergencyPackage(packageRecord: EmergencyPackage): EmergencyPackage {
  const maybeLegacyRecord = packageRecord as EmergencyPackage & { status?: string };

  return {
    ...packageRecord,
    status: maybeLegacyRecord.status === "recording_local" ? "recording_local" : "recorded_local",
    consentSnapshot: {
      ...packageRecord.consentSnapshot,
      media: "local_recording_enabled_with_explicit_permission",
      sharing: "blocked_until_contract_backend_audit"
    },
    deliveryPlan: {
      ...packageRecord.deliveryPlan,
      trustedContacts: packageRecord.deliveryPlan.trustedContacts.map((contact) => ({
        contactId: contact.contactId,
        status: "local_reference_pending_contract" as const
      }))
    }
  };
}

export async function saveEmergencyPackage(packageRecord: EmergencyPackage) {
  await saveSecureRecord(EMERGENCY_NAMESPACE, packageRecord);
}

export async function listEmergencyPackages() {
  const packages = await listSecureRecords<EmergencyPackage>(EMERGENCY_NAMESPACE);
  return packages
    .map(normalizeEmergencyPackage)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function countPendingEmergencyPackages() {
  return (await listEmergencyPackages()).length;
}

export async function deleteEmergencyPackage(packageId: string) {
  const packageRecord = (await listEmergencyPackages()).find((item) => item.id === packageId);

  if (packageRecord) {
    const deletedAt = new Date().toISOString();
    await saveSecureRecord(EMERGENCY_DELETION_AUDIT_NAMESPACE, {
      id: `${packageId}.${deletedAt}`,
      packageId,
      packageSha256: packageRecord.integrity.sha256,
      packageCreatedAt: packageRecord.createdAt,
      deletedAt,
      action: "removed_from_device",
      reason: "user_requested_local_delete"
    } satisfies EmergencyPackageDeletionAudit);

    if (packageRecord.media.status === "recorded_local") {
      await Promise.all(
        packageRecord.media.assets.map((asset) =>
          FileSystem.deleteAsync(asset.uri, { idempotent: true }).catch(() => undefined)
        )
      );
    }
  }

  await deleteSecureRecord(EMERGENCY_NAMESPACE, packageId);
}

export async function listEmergencyPackageDeletionAudits() {
  const audits = await listSecureRecords<EmergencyPackageDeletionAudit>(EMERGENCY_DELETION_AUDIT_NAMESPACE);
  return audits.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
}
