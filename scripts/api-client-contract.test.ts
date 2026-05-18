import assert from "node:assert/strict";

import { z } from "zod";

import { AuthApiClient } from "../src/services/api/authClient";
import { EmergencyApiClient } from "../src/services/api/emergencyClient";
import { SinalSeguroApiCore, ApiRequestError, ApiSessionSecretStore } from "../src/services/api/core";
import { ReleasesApiClient } from "../src/services/api/releasesClient";

type FetchCall = {
  body?: unknown;
  headers: Record<string, string>;
  method: string;
  path: string;
};

function buildMemorySessionStore(initialValue: string | null = null) {
  let storedValue = initialValue;
  const sessionStore: ApiSessionSecretStore = {
    delete: async () => {
      storedValue = null;
    },
    read: async () => storedValue,
    save: async (value) => {
      storedValue = value;
    }
  };

  return {
    getStoredValue: () => storedValue,
    sessionStore
  };
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status: init.status ?? 200
  });
}

function installFetch(handler: (call: FetchCall, index: number) => Response | Promise<Response>) {
  const calls: FetchCall[] = [];
  const previousFetch = globalThis.fetch;

  globalThis.fetch = (async (input, init) => {
    const url = new URL(String(input));
    const headers = new Headers(init?.headers);
    const call: FetchCall = {
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      headers: Object.fromEntries(headers.entries()),
      method: init?.method ?? "GET",
      path: `${url.pathname}${url.search}`
    };
    calls.push(call);
    return handler(call, calls.length - 1);
  }) as typeof fetch;

  return {
    calls,
    restore: () => {
      globalThis.fetch = previousFetch;
    }
  };
}

function buildCore(sessionStore: ApiSessionSecretStore) {
  return new SinalSeguroApiCore("https://api.sinalseguro.com.br/api", true, sessionStore);
}

async function testCorruptedSessionIsCleared() {
  const { getStoredValue, sessionStore } = buildMemorySessionStore("{session-corrompida");
  const core = buildCore(sessionStore);

  assert.equal(await core.getStoredSession(), null);
  assert.equal(getStoredValue(), null);
}

async function testRefreshRetriesOnceAndPersistsSession() {
  const { getStoredValue, sessionStore } = buildMemorySessionStore(
    JSON.stringify({ access: "access-expirado", refresh: "refresh-valido", user: null })
  );
  const core = buildCore(sessionStore);
  const auth = new AuthApiClient(core);
  const fetchMock = installFetch((call, index) => {
    if (index === 0) {
      assert.equal(call.path, "/api/auth/me");
      assert.equal(call.headers.authorization, "Bearer access-expirado");
      return jsonResponse({ detail: "token expirado" }, { status: 401 });
    }
    if (index === 1) {
      assert.equal(call.path, "/api/auth/refresh");
      assert.deepEqual(call.body, { refresh: "refresh-valido" });
      return jsonResponse({ access: "access-renovado" });
    }
    assert.equal(call.path, "/api/auth/me");
    assert.equal(call.headers.authorization, "Bearer access-renovado");
    return jsonResponse({
      email: "ana@example.com",
      id: "user-1",
      role: "user"
    });
  });

  try {
    const user = await auth.getMe();

    assert.equal(user.id, "user-1");
    assert.equal(fetchMock.calls.length, 3);
    assert.deepEqual(JSON.parse(getStoredValue() ?? ""), {
      access: "access-renovado",
      refresh: "refresh-valido",
      user: null
    });
  } finally {
    fetchMock.restore();
  }
}

async function testInvalidRefreshClearsSession() {
  const { getStoredValue, sessionStore } = buildMemorySessionStore(
    JSON.stringify({ access: "access-expirado", refresh: "refresh-invalido", user: null })
  );
  const auth = new AuthApiClient(buildCore(sessionStore));
  const fetchMock = installFetch((call, index) => {
    if (index === 0) return jsonResponse({ detail: "token expirado" }, { status: 401 });
    assert.equal(call.path, "/api/auth/refresh");
    return jsonResponse({ detail: "refresh invalido" }, { status: 401 });
  });

  try {
    await assert.rejects(auth.getMe(), (error) => {
      assert.equal(error instanceof ApiRequestError, true);
      assert.equal((error as ApiRequestError).status, 401);
      return true;
    });
    assert.equal(getStoredValue(), null);
  } finally {
    fetchMock.restore();
  }
}

async function testLogoutDoesNotRefreshAndAlwaysClearsLocalSession() {
  const { getStoredValue, sessionStore } = buildMemorySessionStore(
    JSON.stringify({ access: "access-atual", refresh: "refresh-atual", user: null })
  );
  const auth = new AuthApiClient(buildCore(sessionStore));
  const fetchMock = installFetch((call, index) => {
    assert.equal(index, 0);
    assert.equal(call.path, "/api/auth/logout");
    assert.equal(call.headers.authorization, "Bearer access-atual");
    assert.deepEqual(call.body, {
      device_id: "device-1",
      device_public_key_sha256: "public-sha",
      refresh: "refresh-atual"
    });
    return jsonResponse({ detail: "access expirado" }, { status: 401 });
  });

  try {
    await assert.rejects(auth.logout({ deviceId: "device-1", publicKeySha256: "public-sha" }), ApiRequestError);
    assert.equal(fetchMock.calls.length, 1);
    assert.equal(getStoredValue(), null);
  } finally {
    fetchMock.restore();
  }
}

async function testGoogleLoginFetchesUserWhenMissing() {
  const { getStoredValue, sessionStore } = buildMemorySessionStore();
  const auth = new AuthApiClient(buildCore(sessionStore));
  const fetchMock = installFetch((call, index) => {
    if (index === 0) {
      assert.equal(call.path, "/api/auth/google");
      assert.deepEqual(call.body, {
        device_app_version: "0.1.15",
        device_label: "Android Roberto",
        device_platform: "android",
        device_public_key_sha256: "device-public-sha",
        id_token: "google-id-token"
      });
      return jsonResponse({ access: "access-google", refresh: "refresh-google" });
    }
    assert.equal(call.path, "/api/auth/me");
    assert.equal(call.headers.authorization, "Bearer access-google");
    return jsonResponse({
      display_name: "Ana",
      email: "ana@example.com",
      id: "user-google",
      role: "user"
    });
  });

  try {
    const session = await auth.loginWithGoogleIdToken("google-id-token", {
      appVersion: "0.1.15",
      deviceLabel: "Android Roberto",
      platform: "android",
      publicKeySha256: "device-public-sha"
    });

    assert.equal(session.user?.id, "user-google");
    assert.equal(JSON.parse(getStoredValue() ?? "").user.id, "user-google");
  } finally {
    fetchMock.restore();
  }
}

async function testReleaseCheckIsPublicAndTransformed() {
  const { sessionStore } = buildMemorySessionStore(
    JSON.stringify({ access: "access-nao-deve-ser-usado", refresh: "refresh", user: null })
  );
  const releases = new ReleasesApiClient(buildCore(sessionStore));
  const fetchMock = installFetch((call) => {
    assert.equal(call.path, "/api/app-releases/current?platform=android&version=0.1.15&version_code=17");
    assert.equal(call.headers.authorization, undefined);
    return jsonResponse({
      channel: "private",
      checksum_url: "https://www.sinalseguro.com.br/downloads/private/checksums.txt",
      download_url: "https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk",
      id: "release-1",
      platform: "android",
      portal_url: "https://www.sinalseguro.com.br/baixar/android",
      required_update: true,
      sha256: "a".repeat(64),
      status: "published",
      version: "0.1.16",
      version_code: 18
    });
  });

  try {
    const release = await releases.getCurrentAppRelease({
      platform: "android",
      version: "0.1.15",
      versionCode: 17
    });

    assert.equal(release.downloadUrl, "https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk");
    assert.equal(release.latestVersion, "0.1.16");
    assert.equal(release.requiredUpdate, true);
    assert.equal(release.versionCode, 18);
  } finally {
    fetchMock.restore();
  }
}

async function testP2PAndEnvelopeRequireAuthentication() {
  const { sessionStore } = buildMemorySessionStore();
  const emergency = new EmergencyApiClient(buildCore(sessionStore));
  const fetchMock = installFetch(() => {
    throw new Error("Chamadas P2P/envelope sem sessao nao devem chegar ao fetch.");
  });

  try {
    await assert.rejects(
      emergency.createKeyEnvelope({
        algorithm: "xchacha20poly1305",
        emergencySessionId: "session-1",
        expiresAt: "2026-05-17T12:00:00.000Z",
        keyId: "key-1",
        publicKeySha256: "a".repeat(64),
        recipientId: "recipient-1",
        scope: "live_session"
      }),
      (error) => {
        assert.equal(error instanceof ApiRequestError, true);
        assert.equal((error as ApiRequestError).status, 401);
        return true;
      }
    );
    await assert.rejects(
      emergency.sendP2PSignal({
        emergencySessionId: "session-1",
        expiresAt: "2026-05-17T12:00:00.000Z",
        payload: { type: "offer" },
        recipientId: "recipient-1",
        signalType: "offer"
      }),
      ApiRequestError
    );
    await assert.rejects(emergency.listP2PSignals(), ApiRequestError);
    await assert.rejects(emergency.consumeP2PSignal("signal-1"), ApiRequestError);
    assert.equal(fetchMock.calls.length, 0);
  } finally {
    fetchMock.restore();
  }
}

async function testSensitiveErrorDetailsAreRedacted() {
  const { sessionStore } = buildMemorySessionStore();
  const core = buildCore(sessionStore);
  const fetchMock = installFetch(() =>
    jsonResponse(
      {
        authorization: "Bearer access-secreto",
        device: ["dispositivo indisponivel"],
        encrypted_key: "envelope-secreto",
        detail:
          "Token convite-secreto invalido. sdp=v=0\r\no=- 1 1 IN IP4 192.168.0.10\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\na=fingerprint:sha-256 AA:BB",
        non_field_errors: ["Bearer access-secreto"],
        payload: {
          candidate: "candidate-secreto",
          sdp: "sdp-secreto"
        },
        token: "convite-secreto"
      },
      { status: 400 }
    )
  );

  try {
    await assert.rejects(
      core.request("/public-error", z.unknown(), { authenticated: false }),
      (error) => {
        assert.equal(error instanceof ApiRequestError, true);
        const requestError = error as ApiRequestError;
        const serializedDetails = JSON.stringify(requestError.details);

        assert.equal(requestError.message.includes("convite-secreto"), false);
        assert.equal(requestError.message.includes("access-secreto"), false);
        assert.equal(requestError.message.includes("v=0"), false);
        assert.equal(requestError.message.includes("192.168.0.10"), false);
        assert.equal(requestError.message.includes("fingerprint"), false);
        assert.equal(requestError.message.includes("[redigido]"), true);
        assert.equal(serializedDetails.includes("access-secreto"), false);
        assert.equal(serializedDetails.includes("convite-secreto"), false);
        assert.equal(serializedDetails.includes("envelope-secreto"), false);
        assert.equal(serializedDetails.includes("candidate-secreto"), false);
        assert.equal(serializedDetails.includes("sdp-secreto"), false);
        assert.equal(serializedDetails.includes("v=0"), false);
        assert.equal(serializedDetails.includes("192.168.0.10"), false);
        assert.equal(serializedDetails.includes("fingerprint"), false);
        assert.equal(serializedDetails.includes("dispositivo indisponivel"), true);
        assert.equal(serializedDetails.includes("[redigido]"), true);
        return true;
      }
    );
  } finally {
    fetchMock.restore();
  }
}

async function main() {
  await testCorruptedSessionIsCleared();
  await testRefreshRetriesOnceAndPersistsSession();
  await testInvalidRefreshClearsSession();
  await testLogoutDoesNotRefreshAndAlwaysClearsLocalSession();
  await testGoogleLoginFetchesUserWhenMissing();
  await testReleaseCheckIsPublicAndTransformed();
  await testP2PAndEnvelopeRequireAuthentication();
  await testSensitiveErrorDetailsAreRedacted();
}

main()
  .then(() => {
    console.log("API client contract tests aprovado.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
