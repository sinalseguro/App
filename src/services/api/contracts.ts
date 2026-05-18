import { z } from "zod";

import { DeviceKeyProof } from "@/services/deviceKeyProof";

export const HealthSchema = z.object({
  status: z.string().optional()
});

export const ApiUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string().nullable().optional(),
  role: z.string(),
  terms_version: z.string().nullable().optional(),
  created_at: z.string().optional()
});

export const AuthTokenResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: ApiUserSchema.optional()
});

export const TokenRefreshSchema = z.object({
  access: z.string(),
  refresh: z.string().optional()
});

export const ApiSessionSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: ApiUserSchema.nullable().optional()
});

export const ProtectionProfileSchema = z.object({
  id: z.string(),
  kind: z.enum(["unknown", "adult_self", "guardian", "minor_protected", "guardian_without_minor"]),
  status: z.string(),
  policy_version: z.string(),
  configured_at: z.string(),
  updated_at: z.string()
});

export const DeviceSchema = z.object({
  id: z.string(),
  platform: z.string(),
  device_label: z.string(),
  app_version: z.string(),
  key_algorithm: z.string().optional(),
  key_registered_at: z.string().nullable().optional(),
  key_rotated_at: z.string().nullable().optional(),
  public_key_sha256: z.string().optional(),
  revocation_reason: z.string().optional(),
  revoked_at: z.string().nullable().optional(),
  status: z.string(),
  last_seen_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const ConsentScopeSchema = z.enum([
  "login",
  "terms",
  "privacy",
  "location",
  "alerts",
  "media_homologation",
  "emergency_data_sharing",
  "receiver_encrypted_save"
]);

export const ConsentRecordSchema = z.object({
  id: z.string(),
  device: z.string().nullable().optional(),
  scope: ConsentScopeSchema,
  version: z.string(),
  accepted: z.boolean(),
  accepted_at: z.string(),
  evidence: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string()
});

export const TrustedContactSchema = z.object({
  id: z.string(),
  protected_subject: z.string().nullable().optional(),
  contact_display_name: z.string().optional(),
  display_label: z.string(),
  status: z.string(),
  can_receive_alerts: z.boolean(),
  can_receive_media: z.boolean(),
  can_receive_location: z.boolean(),
  accepted_at: z.string().nullable().optional(),
  revoked_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const TrustedContactListSchema = z.array(TrustedContactSchema);

export const TrustedContactRelationshipSchema = TrustedContactSchema.extend({
  contact_display_name: z.string().optional(),
  owner_display_name: z.string(),
  relationship_role: z.enum(["owner", "angel"])
});

export const TrustedContactRelationshipListSchema = z.array(TrustedContactRelationshipSchema);

export const InvitationSchema = z.object({
  id: z.string(),
  trusted_contact: z.string(),
  protected_subject: z.string().nullable().optional(),
  display_label: z.string(),
  status: z.string(),
  expires_at: z.string(),
  accepted_at: z.string().nullable().optional(),
  created_at: z.string(),
  token: z.string().optional(),
  invite_url: z.string().optional()
});

export const InvitationListSchema = z.array(InvitationSchema);

export const InvitationPublicStatusSchema = z.object({
  can_accept: z.boolean(),
  message: z.string().optional(),
  status: z.enum(["available", "unavailable"])
});

export const EmergencyRecipientSchema = z.object({
  id: z.string(),
  emergency_session: z.string(),
  trusted_contact: z.string(),
  recipient: z.string(),
  relationship_role: z.string(),
  owner_display_name: z.string().optional(),
  recipient_display_name: z.string().optional(),
  status: z.string(),
  can_receive_alerts_snapshot: z.boolean(),
  can_receive_media_snapshot: z.boolean(),
  can_receive_location_snapshot: z.boolean(),
  routed_at: z.string(),
  first_seen_at: z.string().nullable().optional(),
  accepted_at: z.string().nullable().optional(),
  ended_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const EmergencySessionSchema = z.object({
  id: z.string(),
  device: z.string().nullable().optional(),
  protected_subject: z.string().nullable().optional(),
  owner_display_name: z.string().optional(),
  current_recipient: z.string().nullable().optional(),
  current_recipient_status: z.string().nullable().optional(),
  client_alert_id: z.string(),
  idempotency_key: z.string(),
  kind: z.string(),
  status: z.string(),
  phase: z.string().optional(),
  location_status: z.string(),
  location_accuracy_meters: z.string().nullable().optional(),
  recipient_count: z.number().int().nonnegative().optional(),
  recipients: z.array(EmergencyRecipientSchema).optional(),
  started_at: z.string(),
  finished_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const EmergencySessionListSchema = z.array(EmergencySessionSchema);

export const KeyEnvelopeSchema = z.object({
  id: z.string(),
  emergency_session: z.string(),
  recipient: z.string(),
  recipient_device: z.string().nullable().optional(),
  scope: z.string(),
  key_id: z.string(),
  public_key_sha256: z.string(),
  algorithm: z.string(),
  status: z.string(),
  created_at: z.string(),
  revoked_at: z.string().nullable().optional()
});

export const P2PSignalSchema = z.object({
  id: z.string(),
  emergency_session: z.string(),
  sender: z.string(),
  recipient: z.string(),
  signal_type: z.string(),
  payload: z.record(z.string(), z.unknown()),
  expires_at: z.string(),
  consumed_at: z.string().nullable().optional(),
  created_at: z.string()
});

export const LiveRecipientDeviceSchema = z.object({
  id: z.string(),
  platform: z.string(),
  device_label: z.string(),
  key_algorithm: z.string(),
  public_key: z.string(),
  public_key_sha256: z.string()
});

export const LiveRecipientSchema = z.object({
  id: z.string(),
  recipient: z.string(),
  recipient_display_name: z.string(),
  relationship_role: z.string(),
  accepted_at: z.string().nullable().optional(),
  devices: z.array(LiveRecipientDeviceSchema)
});

export const LiveRecipientListSchema = z.object({
  emergency_session: z.string(),
  recipients: z.array(LiveRecipientSchema)
});

export const LiveAuditMarkerSchema = z.object({
  event: z.string(),
  status: z.literal("recorded")
});

export const ApiAppReleaseSchema = z
  .object({
    id: z.string(),
    platform: z.enum(["android", "ios"]),
    channel: z.string(),
    version: z.string(),
    version_code: z.number().int().positive(),
    minimum_version: z.string().optional(),
    minimum_version_code: z.number().int().positive().nullable().optional(),
    download_url: z.string().url(),
    portal_url: z.string().url(),
    checksum_url: z.string().optional(),
    sha256: z.string(),
    status: z.string(),
    required_update: z.boolean().optional(),
    published_at: z.string().optional(),
    updated_at: z.string().optional()
  })
  .transform((release) => ({
    channel: release.channel,
    checksumUrl: release.checksum_url || undefined,
    downloadUrl: release.download_url,
    id: release.id,
    latestVersion: release.version,
    minimumVersion: release.minimum_version || undefined,
    minimumVersionCode: release.minimum_version_code ?? undefined,
    platform: release.platform,
    portalUrl: release.portal_url,
    publishedAt: release.published_at,
    requiredUpdate: release.required_update ?? false,
    sha256: release.sha256,
    status: release.status,
    updatedAt: release.updated_at,
    versionCode: release.version_code
  }));

export type ApiUser = z.infer<typeof ApiUserSchema>;
export type ApiSession = z.infer<typeof ApiSessionSchema>;
export type ApiProtectionProfile = z.infer<typeof ProtectionProfileSchema>;
export type ApiDevice = z.infer<typeof DeviceSchema>;
export type ApiConsentScope = z.infer<typeof ConsentScopeSchema>;
export type ApiConsentRecord = z.infer<typeof ConsentRecordSchema>;
export type ApiTrustedContact = z.infer<typeof TrustedContactSchema>;
export type ApiTrustedContactRelationship = z.infer<typeof TrustedContactRelationshipSchema>;
export type ApiInvitation = z.infer<typeof InvitationSchema>;
export type ApiInvitationPublicStatus = z.infer<typeof InvitationPublicStatusSchema>;
export type ApiEmergencyRecipient = z.infer<typeof EmergencyRecipientSchema>;
export type ApiEmergencySession = z.infer<typeof EmergencySessionSchema>;
export type ApiKeyEnvelope = z.infer<typeof KeyEnvelopeSchema>;
export type ApiP2PSignal = z.infer<typeof P2PSignalSchema>;
export type ApiLiveRecipient = z.infer<typeof LiveRecipientSchema>;
export type ApiLiveRecipientDevice = z.infer<typeof LiveRecipientDeviceSchema>;
export type ApiLiveRecipientList = z.infer<typeof LiveRecipientListSchema>;
export type ApiLiveAuditMarker = z.infer<typeof LiveAuditMarkerSchema>;
export type ApiAppRelease = z.infer<typeof ApiAppReleaseSchema>;

export type RegisterDeviceInput = {
  appVersion: string;
  deviceLabel: string;
  keyAlgorithm?: string;
  keyProof: DeviceKeyProof;
  platform?: "android" | "ios" | "web";
  publicKey?: string;
  pushToken?: string;
  replacesPublicKeySha256?: string;
};

export type RotateDeviceKeyInput = {
  appVersion: string;
  deviceLabel: string;
  keyAlgorithm: string;
  keyProof: DeviceKeyProof;
  platform: "android" | "ios" | "web";
  publicKey: string;
};

export type LoginDeviceContext = {
  appVersion: string;
  deviceLabel: string;
  legacyPublicKeySha256?: string;
  platform: "android" | "ios" | "web";
  publicKeySha256: string;
};

export type LogoutDeviceContext = {
  deviceId?: string | null;
  publicKeySha256?: string | null;
};

export type CreateConsentRecordInput = {
  accepted: boolean;
  acceptedAt?: string;
  deviceId?: string | null;
  evidence?: Record<string, unknown>;
  scope: ApiConsentScope;
  version: string;
};

export type CreateTrustedContactInput = {
  canReceiveAlerts?: boolean;
  canReceiveLocation?: boolean;
  canReceiveMedia?: boolean;
  displayLabel: string;
  protectedSubjectId?: string | null;
};

export type UpdateProtectionProfileInput = {
  kind: ApiProtectionProfile["kind"];
};

export type CreateInvitationInput = {
  displayLabel: string;
  trustedContactId: string;
};

export type AcceptInvitationInput = {
  displayLabel?: string;
  token: string;
};

export type CreateEmergencySessionInput = {
  clientAlertId: string;
  idempotencyKey: string;
  kind: "test" | "real";
  locationStatus: string;
  deviceId?: string | null;
  locationAccuracyMeters?: number | null;
  protectedSubjectId?: string | null;
  startedAt?: string;
};

export type EmergencySessionResponseAction = "accept" | "decline" | "end" | "seen";

export type CreateKeyEnvelopeInput = {
  emergencySessionId: string;
  recipientId: string;
  keyId: string;
  publicKeySha256: string;
  encryptedKey?: string;
  algorithm: string;
  expiresAt: string;
  recipientDeviceId?: string | null;
  scope: "live_session" | "media_asset";
};

export type SendP2PSignalInput = {
  emergencySessionId: string;
  recipientId: string;
  signalType: "offer" | "answer" | "ice";
  payload: Record<string, unknown>;
  expiresAt: string;
};

export type LiveAuditMarkerEvent =
  | "angel_live_answer_sent"
  | "angel_live_connected"
  | "angel_live_ended"
  | "angel_live_failed"
  | "angel_live_offer_received"
  | "angel_live_reconnect_failed"
  | "angel_live_reconnected"
  | "angel_live_reconnecting"
  | "local_evidence_failed"
  | "local_evidence_metadata_only"
  | "local_evidence_protected"
  | "local_evidence_recording"
  | "owner_live_answer_accepted"
  | "owner_live_connected"
  | "owner_live_ended"
  | "owner_live_failed"
  | "owner_live_offer_sent"
  | "owner_live_reconnect_failed"
  | "owner_live_reconnected"
  | "owner_live_reconnecting"
  | "owner_media_handoff_complete"
  | "owner_media_handoff_start";

export type RecordLiveAuditMarkerInput = {
  callSessionId?: string;
  connectionState?: "connected" | "connecting" | "ended" | "failed" | "reconnecting" | "waiting";
  deviceId?: string | null;
  event: LiveAuditMarkerEvent;
  localEvidenceStatus?: "failed" | "metadata_only" | "not_applicable" | "protected" | "recording";
  role: "angel" | "owner";
};

export type GetCurrentAppReleaseInput = {
  platform?: "android" | "ios";
  version?: string;
  versionCode?: number;
};
