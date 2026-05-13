import { getSecureRecord, saveSecureRecord } from "@/storage/secureJsonStore";
import { ApiProtectionProfile, apiClient } from "@/services/apiClient";
import {
  buildProtectionProfile,
  isProtectionProfile,
  ProtectionProfile,
  ProtectionProfileKind
} from "./profilePolicy";

const ACTIVE_PROFILE_NAMESPACE = "sinalseguro.protection-profile.v1";
const ACTIVE_PROFILE_ID = "active";

const localToApiKind: Record<ProtectionProfileKind, ApiProtectionProfile["kind"]> = {
  adult_self_managed: "adult_self",
  minor_protected: "minor_protected",
  responsible_with_minor: "guardian",
  responsible_without_minor: "guardian_without_minor"
};

const apiToLocalKind: Record<ApiProtectionProfile["kind"], ProtectionProfileKind | null> = {
  adult_self: "adult_self_managed",
  guardian: "responsible_with_minor",
  guardian_without_minor: "responsible_without_minor",
  minor_protected: "minor_protected",
  unknown: null
};

function profileFromApi(apiProfile: ApiProtectionProfile, fallback?: ProtectionProfile | null): ProtectionProfile | null {
  const kind = apiToLocalKind[apiProfile.kind];
  if (!kind) return fallback ?? null;
  return {
    id: "active",
    schemaVersion: "sinalseguro.protection-profile.v1",
    kind,
    majorityStatus: kind === "minor_protected" ? "minor" : "adult",
    configuredAt: apiProfile.configured_at,
    updatedAt: apiProfile.updated_at,
    policyVersion: "frente-1.3-mvp-2026-05-13"
  };
}

export async function getActiveProtectionProfile(): Promise<ProtectionProfile | null> {
  const profile = await getSecureRecord<ProtectionProfile>(ACTIVE_PROFILE_NAMESPACE, ACTIVE_PROFILE_ID);
  return isProtectionProfile(profile) ? profile : null;
}

export async function saveActiveProtectionProfile(kind: ProtectionProfileKind) {
  const profile = buildProtectionProfile(kind);
  await saveSecureRecord(ACTIVE_PROFILE_NAMESPACE, profile);
  try {
    return (await syncActiveProtectionProfileToApi(profile)) ?? profile;
  } catch {
    return profile;
  }
}

export async function syncActiveProtectionProfileToApi(profile?: ProtectionProfile | null) {
  const activeProfile = profile ?? (await getActiveProtectionProfile());
  if (!activeProfile) return null;
  const session = await apiClient.getStoredSession();
  if (!session) return activeProfile;

  const remoteProfile = await apiClient.updateProtectionProfile({ kind: localToApiKind[activeProfile.kind] });
  const syncedProfile = profileFromApi(remoteProfile, activeProfile);
  if (syncedProfile) {
    await saveSecureRecord(ACTIVE_PROFILE_NAMESPACE, syncedProfile);
  }
  return syncedProfile;
}
