import { listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import { EmergencyPackage } from "./types";

const EMERGENCY_NAMESPACE = "sinalseguro.emergency-packages.v1";

export async function saveEmergencyPackage(packageRecord: EmergencyPackage) {
  await saveSecureRecord(EMERGENCY_NAMESPACE, packageRecord);
}

export async function listEmergencyPackages() {
  const packages = await listSecureRecords<EmergencyPackage>(EMERGENCY_NAMESPACE);
  return packages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function countPendingEmergencyPackages() {
  return (await listEmergencyPackages()).length;
}
