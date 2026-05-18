import { z } from "zod";

import {
  ApiSession,
  ApiUserSchema,
  AuthTokenResponseSchema,
  LoginDeviceContext,
  LogoutDeviceContext
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";
import { toLoginDevicePayload, toLogoutDevicePayload } from "@/services/api/utils";

export class AuthApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async getStoredSession() {
    return this.core.getStoredSession();
  }

  async clearSession() {
    await this.core.clearSession();
  }

  async loginWithEmail(email: string, password: string, deviceContext?: LoginDeviceContext | null) {
    const tokenResponse = await this.core.request("/auth/login", AuthTokenResponseSchema, {
      authenticated: false,
      body: { ...toLoginDevicePayload(deviceContext), email, password },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.core.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.core.saveSession(session);
    }

    return session;
  }

  async loginWithGoogleIdToken(idToken: string, deviceContext?: LoginDeviceContext | null) {
    const tokenResponse = await this.core.request("/auth/google", AuthTokenResponseSchema, {
      authenticated: false,
      body: { ...toLoginDevicePayload(deviceContext), id_token: idToken },
      method: "POST"
    });
    const session: ApiSession = {
      access: tokenResponse.access,
      refresh: tokenResponse.refresh,
      user: tokenResponse.user ?? null
    };

    await this.core.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.core.saveSession(session);
    }

    return session;
  }

  async loginWithAppleIdentityToken(
    identityToken: string,
    displayName?: string,
    deviceContext?: LoginDeviceContext | null
  ) {
    const tokenResponse = await this.core.request("/auth/apple", AuthTokenResponseSchema, {
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

    await this.core.saveSession(session);
    if (!session.user) {
      session.user = await this.getMe();
      await this.core.saveSession(session);
    }

    return session;
  }

  async logout(deviceContext?: LogoutDeviceContext | null) {
    const session = await this.core.getStoredSession();
    try {
      if (session?.refresh) {
        await this.core.request("/auth/logout", z.unknown(), {
          authenticated: true,
          body: { ...toLogoutDevicePayload(deviceContext), refresh: session.refresh },
          method: "POST"
        });
      }
    } finally {
      await this.core.clearSession();
    }
  }

  async getMe() {
    return this.core.request("/auth/me", ApiUserSchema, { authenticated: true });
  }
}
