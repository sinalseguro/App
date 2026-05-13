import { getSecureRecord, saveSecureRecord } from "@/storage/secureJsonStore";
import {
  buildProtectionProfile,
  isProtectionProfile,
  ProtectionProfile,
  ProtectionProfileKind
} from "./profilePolicy";

const ACTIVE_PROFILE_NAMESPACE = "sinalseguro.protection-profile.v1";
const ACTIVE_PROFILE_ID = "active";

export async function getActiveProtectionProfile(): Promise<ProtectionProfile | null> {
  const profile = await getSecureRecord<ProtectionProfile>(ACTIVE_PROFILE_NAMESPACE, ACTIVE_PROFILE_ID);
  return isProtectionProfile(profile) ? profile : null;
}

export async function saveActiveProtectionProfile(kind: ProtectionProfileKind) {
  const profile = buildProtectionProfile(kind);
  await saveSecureRecord(ACTIVE_PROFILE_NAMESPACE, profile);
  return profile;
}
