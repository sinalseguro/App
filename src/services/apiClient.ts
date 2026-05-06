import { Platform } from "react-native";
import { z } from "zod";

import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";

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

const DeviceSchema = z.object({
  id: z.string(),
  platform: z.string(),
  device_label: z.string(),
  app_version: z.string(),
  public_key_sha256: z.string().optional(),
  status: z.string(),
  last_seen_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

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

export type ApiUser = z.infer<typeof ApiUserSchema>;
export type ApiSession = z.infer<typeof ApiSessionSchema>;
export type ApiDevice = z.infer<typeof DeviceSchema>;
export type ApiEmergencySession = z.infer<typeof EmergencySessionSchema>;
export type ApiKeyEnvelope = z.infer<typeof KeyEnvelopeSchema>;
export type ApiP2PSignal = z.infer<typeof P2PSignalSchema>;

export type RegisterDeviceInput = {
  appVersion: string;
  deviceLabel: string;
  platform?: "android" | "ios" | "web";
  publicKey?: string;
  pushToken?: string;
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

  async loginWithEmail(email: string, password: string) {
    const tokenResponse = await this.request("/auth/login", AuthTokenResponseSchema, {
      authenticated: false,
      body: { email, password },
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

  async loginWithGoogleIdToken(idToken: string) {
    const tokenResponse = await this.request("/auth/google", AuthTokenResponseSchema, {
      authenticated: false,
      body: { id_token: idToken },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.saveSession(session);
    return session;
  }

  async logout() {
    const session = await this.getStoredSession();
    try {
      if (session?.refresh) {
        await this.request("/auth/logout", z.unknown(), {
          authenticated: true,
          body: { refresh: session.refresh },
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
        platform: input.platform ?? currentPlatform(),
        public_key: input.publicKey,
        push_token: input.pushToken
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

    const response = await fetch(`${this.baseUrl}${path}`, {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers: {
        ...(authenticated && session?.access ? { Authorization: `Bearer ${session.access}` } : {}),
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
      },
      method: options.method ?? (options.body === undefined ? "GET" : "POST")
    });
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
