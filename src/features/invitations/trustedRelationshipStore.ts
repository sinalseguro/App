import { ApiTrustedContactRelationship, apiClient } from "@/services/apiClient";
import { deleteSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";

const TRUSTED_RELATIONSHIP_NAMESPACE = "sinalseguro.trusted-contact-relationships.v1";

export type CachedTrustedContactRelationship = ApiTrustedContactRelationship & {
  cachedAt: string;
  source: "acceptance" | "api";
};

function normalizeRelationship(
  relationship: ApiTrustedContactRelationship | CachedTrustedContactRelationship,
  source: CachedTrustedContactRelationship["source"] = "api"
): CachedTrustedContactRelationship {
  return {
    ...relationship,
    cachedAt: "cachedAt" in relationship ? relationship.cachedAt : new Date().toISOString(),
    source: "source" in relationship ? relationship.source : source
  };
}

export async function cacheTrustedContactRelationship(
  relationship: ApiTrustedContactRelationship,
  source: CachedTrustedContactRelationship["source"] = "api"
) {
  await saveSecureRecord(TRUSTED_RELATIONSHIP_NAMESPACE, normalizeRelationship(relationship, source));
}

export async function cacheTrustedContactRelationships(relationships: ApiTrustedContactRelationship[]) {
  await Promise.all(relationships.map((relationship) => cacheTrustedContactRelationship(relationship, "api")));
}

export async function listCachedTrustedContactRelationships(): Promise<CachedTrustedContactRelationship[]> {
  const relationships = await listSecureRecords<CachedTrustedContactRelationship>(TRUSTED_RELATIONSHIP_NAMESPACE);
  return relationships
    .map((relationship) => normalizeRelationship(relationship))
    .sort((left, right) => {
      const leftDate = left.accepted_at ?? left.updated_at ?? left.created_at ?? left.cachedAt;
      const rightDate = right.accepted_at ?? right.updated_at ?? right.created_at ?? right.cachedAt;
      return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
}

export async function refreshTrustedContactRelationshipsFromApi() {
  const relationships = await apiClient.listTrustedContactRelationships();
  await cacheTrustedContactRelationships(relationships);
  return relationships;
}

export async function listAcceptedOwnerRelationships() {
  const relationships = await listCachedTrustedContactRelationships();
  return relationships.filter(
    (relationship) => relationship.relationship_role === "owner" && relationship.status === "accepted"
  );
}

export async function listAcceptedOwnerRelationshipsForDelivery() {
  try {
    const relationships = await refreshTrustedContactRelationshipsFromApi();
    return relationships.filter(
      (relationship) => relationship.relationship_role === "owner" && relationship.status === "accepted"
    );
  } catch {
    return listAcceptedOwnerRelationships();
  }
}

export async function removeCachedTrustedContactRelationship(relationshipId: string) {
  await deleteSecureRecord(TRUSTED_RELATIONSHIP_NAMESPACE, relationshipId);
}
