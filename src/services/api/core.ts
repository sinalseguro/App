import { z } from "zod";

import { ApiSession, ApiSessionSchema, TokenRefreshSchema } from "@/services/api/contracts";

export const DEFAULT_API_BASE_URL = "https://api.sinalseguro.com.br/api";
export const API_SESSION_SECRET_KEY = "api.session.v1";

export type ApiSessionSecretStore = {
  delete(): Promise<void>;
  read(): Promise<string | null>;
  save(value: string): Promise<void>;
};

function normalizeApiBaseUrl(value?: string | null) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return null;
  return trimmedValue.replace(/\/+$/, "");
}

export const apiBaseUrl = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_SINALSEGURO_API_BASE_URL ?? DEFAULT_API_BASE_URL
);

export const apiEnabled =
  process.env.EXPO_PUBLIC_SINALSEGURO_API_ENABLED?.trim() !== "0" && Boolean(apiBaseUrl);

export type ApiRequestOptions = {
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

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isSensitiveApiErrorKey(key: string) {
  const normalizedKey = key.toLowerCase();
  return (
    normalizedKey.includes("authorization") ||
    normalizedKey.includes("access") ||
    normalizedKey.includes("refresh") ||
    normalizedKey.includes("id_token") ||
    normalizedKey.includes("identity_token") ||
    normalizedKey.includes("token") ||
    normalizedKey.includes("secret") ||
    normalizedKey.includes("password") ||
    normalizedKey.includes("encrypted_key") ||
    normalizedKey.includes("payload") ||
    normalizedKey.includes("sdp") ||
    normalizedKey.includes("candidate")
  );
}

function redactSensitiveApiErrorString(value: string) {
  if (!value) return value;

  const redactedSdp = value.replace(/sdp\s*[:=]\s*v=0[\s\S]*/gi, "sdp=[redigido]");
  if (
    /\bv=0\b[\s\S]*\bm=(audio|video|application)\b/i.test(redactedSdp) ||
    /fingerprint:sha-256/i.test(redactedSdp)
  ) {
    return "[sdp redigido]";
  }

  return redactedSdp
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redigido]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[jwt redigido]")
    .replace(/\ba=candidate:[^\r\n]+/gi, "a=candidate:[redigido]")
    .replace(
      /\b(token|convite|invite|authorization|access|refresh|id_token|identity_token|encrypted_key|payload|candidate|sdp|secret|segredo|senha|password)[_:\s=-]+[A-Za-z0-9._~+/=-]{6,}/gi,
      "$1 [redigido]"
    );
}

function sanitizeApiErrorDetails(value: unknown): unknown {
  if (!value) return value;
  if (typeof value === "string") return redactSensitiveApiErrorString(value);
  if (Array.isArray(value)) return value.map(sanitizeApiErrorDetails);
  if (typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
      key,
      isSensitiveApiErrorKey(key) ? "[redigido]" : sanitizeApiErrorDetails(entryValue)
    ])
  );
}

function extractApiErrorMessage(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(extractApiErrorMessage).find(Boolean) ?? null;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      extractApiErrorMessage(record.detail) ??
      extractApiErrorMessage(record.non_field_errors) ??
      extractApiErrorMessage(record.code) ??
      (record.token ? "Convite indisponivel ou invalido." : null) ??
      Object.entries(record)
        .filter(([key]) => !isSensitiveApiErrorKey(key))
        .map(([, entryValue]) => extractApiErrorMessage(entryValue))
        .find(Boolean) ??
      null
    );
  }
  return null;
}

export class SinalSeguroApiCore {
  constructor(
    private readonly baseUrl = apiBaseUrl,
    private readonly enabled = apiEnabled,
    private readonly sessionStore: ApiSessionSecretStore
  ) {}

  get isEnabled() {
    return this.enabled && Boolean(this.baseUrl);
  }

  async getStoredSession() {
    const serializedSession = await this.sessionStore.read();
    if (!serializedSession) return null;

    try {
      return ApiSessionSchema.parse(JSON.parse(serializedSession));
    } catch {
      await this.clearSession();
      return null;
    }
  }

  async saveSession(session: ApiSession) {
    await this.sessionStore.save(JSON.stringify(session));
  }

  async clearSession() {
    await this.sessionStore.delete();
  }

  async request<TSchema extends z.ZodType>(
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
      const safeResponseBody = sanitizeApiErrorDetails(responseBody);
      const message = extractApiErrorMessage(safeResponseBody) ?? "API SinalSeguro indisponivel";
      throw new ApiRequestError(message, response.status, safeResponseBody);
    }

    return schema.parse(responseBody);
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
}

export const apiConfig = {
  apiBaseUrl,
  apiEnabled,
  defaultApiBaseUrl: DEFAULT_API_BASE_URL
};
