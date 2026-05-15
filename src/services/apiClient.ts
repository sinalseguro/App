import { Platform } from "react-native";
import { z } from "zod";

import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import { DeviceKeyProof } from "@/services/deviceKeyProof";

const DEFAULT_API_BASE_URL = "https://api.sinalseguro.com.br/api";
const API_SESSION_SECRET_KEY = "api.session.v1";

function normalizeApiBaseUrl(value?: string | null) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return null;
  return trimmedValue.replace(/\/+$/, "");
}

const apiBaseUrl = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_SINALSEGURO_API_BASE_URL ?? DEFAULT_API_BASE_URL
);
const apiEnabled =
  process.env.EXPO_PUBLIC_SINALSEGURO_API_ENABLED?.trim() !== "0" && Boolean(apiBaseUrl);

const HealthSchema = z.object({
  status: z.string().optional()
});

const ApiUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string().nullable().optional(),
  role: z.string(),
  terms_version: z.string().nullable().optional(),
  created_at: z.string().optional()
});

const AuthTokenResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: ApiUserSchema.optional()
});

const TokenRefreshSchema = z.object({
  access: z.string(),
  refresh: z.string().optional()
});

const ApiSessionSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: ApiUserSchema.nullable().optional()
});

const ProtectionProfileSchema = z.object({
  id: z.string(),
  kind: z.enum(["unknown", "adult_self", "guardian", "minor_protected", "guardian_without_minor"]),
  status: z.string(),
  policy_version: z.string(),
  configured_at: z.string(),
  updated_at: z.string()
});

const DeviceSchema = z.object({
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

const ConsentScopeSchema = z.enum([
  "login",
  "terms",
  "privacy",
  "location",
  "alerts",
  "media_homologation",
  "emergency_data_sharing",
  "receiver_encrypted_save"
]);

const ConsentRecordSchema = z.object({
  id: z.string(),
  device: z.string().nullable().optional(),
  scope: ConsentScopeSchema,
  version: z.string(),
  accepted: z.boolean(),
  accepted_at: z.string(),
  evidence: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string()
});

const TrustedContactSchema = z.object({
  id: z.string(),
  protected_subject: z.string().nullable().optional(),
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

const TrustedContactListSchema = z.array(TrustedContactSchema);

const TrustedContactRelationshipSchema = TrustedContactSchema.extend({
  contact_display_name: z.string().optional(),
  owner_display_name: z.string(),
  relationship_role: z.enum(["owner", "angel"])
});

const TrustedContactRelationshipListSchema = z.array(TrustedContactRelationshipSchema);

const InvitationSchema = z.object({
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

const InvitationListSchema = z.array(InvitationSchema);

const EmergencySessionSchema = z.object({
  id: z.string(),
  device: z.string().nullable().optional(),
  client_alert_id: z.string(),
  idempotency_key: z.string(),
  kind: z.string(),
  status: z.string(),
  location_status: z.string(),
  location_accuracy_meters: z.string().nullable().optional(),
  started_at: z.string(),
  finished_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

const KeyEnvelopeSchema = z.object({
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

const P2PSignalSchema = z.object({
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

const ApiAppReleaseSchema = z
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
export type ApiEmergencySession = z.infer<typeof EmergencySessionSchema>;
export type ApiKeyEnvelope = z.infer<typeof KeyEnvelopeSchema>;
export type ApiP2PSignal = z.infer<typeof P2PSignalSchema>;
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
  startedAt?: string;
};

export type CreateKeyEnvelopeInput = {
  emergencySessionId: string;
  recipientId: string;
  keyId: string;
  publicKeySha256: string;
  encryptedKey: string;
  algorithm: string;
  recipientDeviceId?: string | null;
  scope?: "media" | "live" | "location";
};

export type SendP2PSignalInput = {
  emergencySessionId: string;
  recipientId: string;
  signalType: "offer" | "answer" | "candidate" | "control";
  payload: Record<string, unknown>;
  expiresAt: string;
};

export type GetCurrentAppReleaseInput = {
  platform?: "android" | "ios";
  version?: string;
  versionCode?: number;
};

type ApiRequestOptions = {
  authenticated?: boolean;
  body?: unknown;
  method?: "GET" | "POST" | "PATCH";
  retryOnUnauthorized?: boolean;
};

export class ApiRequestError extends Error {
  readonly details: unknown;
  readonly status: number;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

function currentPlatform() {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}

function toApiDateTime(value?: string) {
  return value ?? new Date().toISOString();
}

function toLoginDevicePayload(deviceContext?: LoginDeviceContext | null) {
  if (!deviceContext) return {};

  return {
    device_app_version: deviceContext.appVersion,
    device_label: deviceContext.deviceLabel,
    device_legacy_public_key_sha256: deviceContext.legacyPublicKeySha256,
    device_platform: deviceContext.platform,
    device_public_key_sha256: deviceContext.publicKeySha256
  };
}

function toLogoutDevicePayload(deviceContext?: LogoutDeviceContext | null) {
  if (!deviceContext) return {};

  return {
    device_id: deviceContext.deviceId ?? undefined,
    device_public_key_sha256: deviceContext.publicKeySha256 ?? undefined
  };
}

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export class SinalSeguroApiClient {
  constructor(
    private readonly baseUrl = apiBaseUrl,
    private readonly enabled = apiEnabled
  ) {}

  get isEnabled() {
    return this.enabled && Boolean(this.baseUrl);
  }

  async getStoredSession() {
    const serializedSession = await readSecret(API_SESSION_SECRET_KEY);
    if (!serializedSession) return null;

    try {
      return ApiSessionSchema.parse(JSON.parse(serializedSession));
    } catch {
      await this.clearSession();
      return null;
    }
  }

  async clearSession() {
    await deleteSecret(API_SESSION_SECRET_KEY);
  }

  async getHealth() {
    return this.request("/health", HealthSchema, { authenticated: false });
  }

  async loginWithEmail(email: string, password: string, deviceContext?: LoginDeviceContext | null) {
    const tokenResponse = await this.request("/auth/login", AuthTokenResponseSchema, {
      authenticated: false,
      body: { ...toLoginDevicePayload(deviceContext), email, password },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.saveSession(session);
    }

    return session;
  }

  async loginWithGoogleIdToken(idToken: string, deviceContext?: LoginDeviceContext | null) {
    const tokenResponse = await this.request("/auth/google", AuthTokenResponseSchema, {
      authenticated: false,
      body: { ...toLoginDevicePayload(deviceContext), id_token: idToken },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.saveSession(session);
    }

    return session;
  }

  async loginWithAppleIdentityToken(
    identityToken: string,
    displayName?: string,
    deviceContext?: LoginDeviceContext | null
  ) {
    const tokenResponse = await this.request("/auth/apple", AuthTokenResponseSchema, {
      authenticated: false,
      body: {
        ...toLoginDevicePayload(deviceContext),
        display_name: displayName,
        id_token: identityToken
      },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.saveSession(session);
    }

    return session;
  }

  async logout(deviceContext?: LogoutDeviceContext | null) {
    const session = await this.getStoredSession();
    try {
      if (session?.refresh) {
        await this.request("/auth/logout", z.unknown(), {
          authenticated: true,
          body: { ...toLogoutDevicePayload(deviceContext), refresh: session.refresh },
          method: "POST"
        });
      }
    } finally {
      await this.clearSession();
    }
  }

  async getMe() {
    return this.request("/auth/me", ApiUserSchema, { authenticated: true });
  }

  async registerDevice(input: RegisterDeviceInput) {
    return this.request("/devices/", DeviceSchema, {
      authenticated: true,
      body: {
        app_version: input.appVersion,
        device_label: input.deviceLabel,
        key_algorithm: input.keyAlgorithm,
        key_proof: input.keyProof,
        platform: input.platform ?? currentPlatform(),
        public_key: input.publicKey,
        push_token: input.pushToken,
        replaces_public_key_sha256: input.replacesPublicKeySha256
      },
      method: "POST"
    });
  }

  async rotateDeviceKey(deviceId: string, input: RotateDeviceKeyInput) {
    return this.request(`/devices/${deviceId}/rotate-key/`, DeviceSchema, {
      authenticated: true,
      body: {
        app_version: input.appVersion,
        device_label: input.deviceLabel,
        key_algorithm: input.keyAlgorithm,
        key_proof: input.keyProof,
        platform: input.platform,
        public_key: input.publicKey
      },
      method: "POST"
    });
  }

  async revokeDevice(deviceId: string, reason: "manual" | "logout" | "lost" | "rotated" = "manual") {
    return this.request(`/devices/${deviceId}/revoke/`, DeviceSchema, {
      authenticated: true,
      body: { reason },
      method: "POST"
    });
  }

  async markDeviceLost(deviceId: string) {
    return this.request(`/devices/${deviceId}/mark-lost/`, DeviceSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async createConsentRecord(input: CreateConsentRecordInput) {
    return this.request("/consents/", ConsentRecordSchema, {
      authenticated: true,
      body: {
        accepted: input.accepted,
        accepted_at: toApiDateTime(input.acceptedAt),
        device: input.deviceId ?? null,
        evidence: input.evidence ?? {},
        scope: input.scope,
        version: input.version
      },
      method: "POST"
    });
  }

  async getProtectionProfile() {
    return this.request("/profiles/me", ProtectionProfileSchema, {
      authenticated: true
    });
  }

  async updateProtectionProfile(input: UpdateProtectionProfileInput) {
    return this.request("/profiles/me", ProtectionProfileSchema, {
      authenticated: true,
      body: {
        kind: input.kind
      },
      method: "PATCH"
    });
  }

  async createTrustedContact(input: CreateTrustedContactInput) {
    return this.request("/trusted-contacts/", TrustedContactSchema, {
      authenticated: true,
      body: {
        can_receive_alerts: input.canReceiveAlerts ?? true,
        can_receive_location: input.canReceiveLocation ?? false,
        can_receive_media: input.canReceiveMedia ?? false,
        display_label: input.displayLabel,
        protected_subject: input.protectedSubjectId ?? null
      },
      method: "POST"
    });
  }

  async listTrustedContacts() {
    return this.request("/trusted-contacts/", TrustedContactListSchema, {
      authenticated: true
    });
  }

  async listTrustedContactRelationships() {
    return this.request("/trusted-contacts/relationships", TrustedContactRelationshipListSchema, {
      authenticated: true
    });
  }

  async revokeTrustedContact(trustedContactId: string) {
    return this.request(`/trusted-contacts/${trustedContactId}/revoke/`, TrustedContactSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async createInvitation(input: CreateInvitationInput) {
    return this.request("/invitations/", InvitationSchema, {
      authenticated: true,
      body: {
        display_label: input.displayLabel,
        trusted_contact: input.trustedContactId
      },
      method: "POST"
    });
  }

  async listInvitations() {
    return this.request("/invitations/", InvitationListSchema, {
      authenticated: true
    });
  }

  async revokeInvitation(invitationId: string) {
    return this.request(`/invitations/${invitationId}/revoke/`, InvitationSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async acceptInvitation(input: AcceptInvitationInput) {
    return this.request("/invitations/accept", TrustedContactRelationshipSchema, {
      authenticated: true,
      body: {
        display_label: input.displayLabel,
        token: input.token
      },
      method: "POST"
    });
  }

  async createEmergencySession(input: CreateEmergencySessionInput) {
    return this.request("/emergency-sessions/", EmergencySessionSchema, {
      authenticated: true,
      body: {
        client_alert_id: input.clientAlertId,
        device: input.deviceId ?? null,
        idempotency_key: input.idempotencyKey,
        kind: input.kind,
        location_accuracy_meters:
          typeof input.locationAccuracyMeters === "number" ? String(input.locationAccuracyMeters) : null,
        location_status: input.locationStatus,
        started_at: toApiDateTime(input.startedAt)
      },
      method: "POST"
    });
  }

  async finishEmergencySession(remoteSessionId: string) {
    return this.request(`/emergency-sessions/${remoteSessionId}/finish/`, EmergencySessionSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async createKeyEnvelope(input: CreateKeyEnvelopeInput) {
    return this.request("/key-envelopes/", KeyEnvelopeSchema, {
      authenticated: true,
      body: {
        algorithm: input.algorithm,
        emergency_session: input.emergencySessionId,
        encrypted_key: input.encryptedKey,
        key_id: input.keyId,
        public_key_sha256: input.publicKeySha256,
        recipient: input.recipientId,
        recipient_device: input.recipientDeviceId ?? null,
        scope: input.scope ?? "media"
      },
      method: "POST"
    });
  }

  async sendP2PSignal(input: SendP2PSignalInput) {
    return this.request("/p2p-signals/", P2PSignalSchema, {
      authenticated: true,
      body: {
        emergency_session: input.emergencySessionId,
        expires_at: input.expiresAt,
        payload: input.payload,
        recipient: input.recipientId,
        signal_type: input.signalType
      },
      method: "POST"
    });
  }

  async getCurrentAppRelease(input: GetCurrentAppReleaseInput = {}) {
    const query = new URLSearchParams();
    query.set("platform", input.platform ?? (currentPlatform() === "ios" ? "ios" : "android"));
    if (input.version) query.set("version", input.version);
    if (typeof input.versionCode === "number") query.set("version_code", String(input.versionCode));

    return this.request(`/app-releases/current?${query.toString()}`, ApiAppReleaseSchema, {
      authenticated: true
    });
  }

  private async saveSession(session: ApiSession) {
    await saveSecret(API_SESSION_SECRET_KEY, JSON.stringify(session));
  }

  private async refreshAccessToken(session: ApiSession) {
    const tokenResponse = await this.request("/auth/refresh", TokenRefreshSchema, {
      authenticated: false,
      body: { refresh: session.refresh },
      method: "POST",
      retryOnUnauthorized: false
    });
    const refreshedSession: ApiSession = {
      ...session,
      access: tokenResponse.access,
      refresh: tokenResponse.refresh ?? session.refresh
    };

    await this.saveSession(refreshedSession);
    return refreshedSession;
  }

  private async request<TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
    options: ApiRequestOptions = {}
  ): Promise<z.infer<TSchema>> {
    if (!this.isEnabled || !this.baseUrl) {
      throw new ApiRequestError("API SinalSeguro indisponivel neste build.", 0);
    }

    const authenticated = options.authenticated ?? true;
    const retryOnUnauthorized = options.retryOnUnauthorized ?? true;
    const session = authenticated ? await this.getStoredSession() : null;

    if (authenticated && !session?.access) {
      throw new ApiRequestError("Login SinalSeguro necessario para acessar a API.", 401);
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        headers: {
          ...(authenticated && session?.access ? { Authorization: `Bearer ${session.access}` } : {}),
          ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
        },
        method: options.method ?? (options.body === undefined ? "GET" : "POST")
      });
    } catch (error) {
      throw new ApiRequestError(
        "Sem conexao com a internet. Os recursos locais continuam disponiveis neste aparelho.",
        0,
        error instanceof Error ? error.message : null
      );
    }
    const responseBody = await parseResponseBody(response);

    if (response.status === 401 && authenticated && retryOnUnauthorized && session?.refresh) {
      try {
        await this.refreshAccessToken(session);
        return this.request(path, schema, { ...options, retryOnUnauthorized: false });
      } catch (error) {
        await this.clearSession();
        throw error;
      }
    }

    if (!response.ok) {
      const message =
        typeof responseBody === "object" && responseBody && "detail" in responseBody
          ? String(responseBody.detail)
          : "API SinalSeguro indisponivel";
      throw new ApiRequestError(message, response.status, responseBody);
    }

    return schema.parse(responseBody);
  }
}

export const apiClient = new SinalSeguroApiClient();

export async function getHealth() {
  return apiClient.getHealth();
}

export const apiConfig = {
  apiBaseUrl,
  apiEnabled,
  defaultApiBaseUrl: DEFAULT_API_BASE_URL
};
