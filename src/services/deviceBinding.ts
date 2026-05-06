import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

import { defaultEmergencyPreferences, EmergencyPreferences } from "@/features/emergency/emergencyPreferences";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import { ApiConsentScope, ApiDevice, SinalSeguroApiClient, apiClient } from "@/services/apiClient";

const DEVICE_BINDING_SCHEMA_VERSION = "sinalseguro.device-binding.v1";
const DEVICE_PRIVATE_SECRET_KEY = "device.binding.private.v1";
const DEVICE_PUBLIC_RECORD_KEY = "device.binding.public-record.v1";
const DEVICE_KEY_ALGORITHM = "sha256-public-commitment-v1";
const DEFAULT_APP_VERSION = "0.1.0";

type DevicePlatform = "android" | "ios" | "web";

type DevicePrivateRecord = {
  schemaVersion: typeof DEVICE_BINDING_SCHEMA_VERSION;
  localDeviceId: string;
  privateSeedHex: string;
  createdAt: string;
};

export type DeviceBindingRecord = {
  schemaVersion: typeof DEVICE_BINDING_SCHEMA_VERSION;
  localDeviceId: string;
  platform: DevicePlatform;
  appVersion: string;
  keyAlgorithm: typeof DEVICE_KEY_ALGORITHM;
  publicKey: string;
  publicKeySha256: string;
  apiDeviceId?: string;
  createdAt: string;
  registeredAt?: string;
};

export type DeviceBootstrapResult = {
  binding: DeviceBindingRecord;
  consentStatus: "not_attempted" | "recorded" | "partial";
  device: ApiDevice;
  failedConsentScopes: ApiConsentScope[];
};

type ConsentDraft = {
  accepted: boolean;
  scope: ApiConsentScope;
  version: string;
};

function currentPlatform(): DevicePlatform {
  if (Platform.OS === "android") return "android";
  if (Platform.OS === "ios") return "ios";
  return "web";
}

function currentAppVersion() {
  return Constants.expoConfig?.version ?? Constants.manifest2?.extra?.expoClient?.version ?? DEFAULT_APP_VERSION;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function sha256Hex(value: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
}

async function createPrivateRecord(): Promise<DevicePrivateRecord> {
  const createdAt = new Date().toISOString();
  return {
    schemaVersion: DEVICE_BINDING_SCHEMA_VERSION,
    localDeviceId: Crypto.randomUUID(),
    privateSeedHex: bytesToHex(await Crypto.getRandomBytesAsync(32)),
    createdAt
  };
}

async function derivePublicRecord(privateRecord: DevicePrivateRecord): Promise<DeviceBindingRecord> {
  const appVersion = currentAppVersion();
  const platform = currentPlatform();
  const publicDigest = await sha256Hex(
    `${DEVICE_BINDING_SCHEMA_VERSION}:${privateRecord.localDeviceId}:${privateRecord.privateSeedHex}`
  );
  const publicKey = `${DEVICE_BINDING_SCHEMA_VERSION}:${DEVICE_KEY_ALGORITHM}:${publicDigest}`;

  return {
    schemaVersion: DEVICE_BINDING_SCHEMA_VERSION,
    appVersion,
    createdAt: privateRecord.createdAt,
    keyAlgorithm: DEVICE_KEY_ALGORITHM,
    localDeviceId: privateRecord.localDeviceId,
    platform,
    publicKey,
    publicKeySha256: await sha256Hex(publicKey)
  };
}

function buildDeviceLabel(platform: DevicePlatform) {
  if (platform === "android") return "SinalSeguro Android";
  if (platform === "ios") return "SinalSeguro iOS";
  return "SinalSeguro Web";
}

function buildConsentDrafts(preferences?: EmergencyPreferences | null): ConsentDraft[] {
  const currentPreferences = preferences ?? defaultEmergencyPreferences;
  const legalConsent = currentPreferences.legalConsent;
  const version = legalConsent.version;

  return [
    { accepted: true, scope: "login", version },
    { accepted: legalConsent.termsAccepted, scope: "terms", version },
    { accepted: legalConsent.privacyAccepted, scope: "privacy", version },
    {
      accepted: currentPreferences.locationMode === "foreground_pre_authorized",
      scope: "location",
      version
    },
    { accepted: true, scope: "alerts", version },
    {
      accepted: currentPreferences.localVideoCapture.requestOnSos && legalConsent.privacyAccepted,
      scope: "media_homologation",
      version
    },
    {
      accepted: legalConsent.emergencyDataSharingAccepted,
      scope: "emergency_data_sharing",
      version
    },
    {
      accepted: currentPreferences.trustedStream.allowReceiverEncryptedSave,
      scope: "receiver_encrypted_save",
      version
    }
  ];
}

export class DeviceBindingService {
  constructor(private readonly client: SinalSeguroApiClient = apiClient) {}

  async getOrCreateBinding() {
    const storedPrivateRecord = safeParseJson<DevicePrivateRecord>(await readSecret(DEVICE_PRIVATE_SECRET_KEY));
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));

    if (
      storedPrivateRecord?.schemaVersion === DEVICE_BINDING_SCHEMA_VERSION &&
      storedPublicRecord?.schemaVersion === DEVICE_BINDING_SCHEMA_VERSION &&
      storedPrivateRecord.localDeviceId === storedPublicRecord.localDeviceId
    ) {
      return {
        ...storedPublicRecord,
        appVersion: currentAppVersion(),
        platform: currentPlatform()
      };
    }

    const privateRecord = storedPrivateRecord?.schemaVersion === DEVICE_BINDING_SCHEMA_VERSION
      ? storedPrivateRecord
      : await createPrivateRecord();
    const publicRecord = await derivePublicRecord(privateRecord);

    await saveSecret(DEVICE_PRIVATE_SECRET_KEY, JSON.stringify(privateRecord));
    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(publicRecord));

    return publicRecord;
  }

  async getRegisteredApiDeviceId() {
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));
    return storedPublicRecord?.apiDeviceId ?? null;
  }

  async clearRegisteredDeviceSession() {
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));
    if (!storedPublicRecord) return;

    const { apiDeviceId: _ignoredApiDeviceId, registeredAt: _ignoredRegisteredAt, ...localOnlyRecord } = storedPublicRecord;
    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(localOnlyRecord));
  }

  async resetLocalBinding() {
    await deleteSecret(DEVICE_PRIVATE_SECRET_KEY);
    await deleteSecret(DEVICE_PUBLIC_RECORD_KEY);
  }

  async registerAuthenticatedDevice() {
    const binding = await this.getOrCreateBinding();
    const device = await this.client.registerDevice({
      appVersion: binding.appVersion,
      deviceLabel: buildDeviceLabel(binding.platform),
      platform: binding.platform,
      publicKey: binding.publicKey
    });
    const nextBinding: DeviceBindingRecord = {
      ...binding,
      apiDeviceId: device.id,
      publicKeySha256: device.public_key_sha256 ?? binding.publicKeySha256,
      registeredAt: new Date().toISOString()
    };

    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(nextBinding));
    return { binding: nextBinding, device };
  }

  async recordConsentSet(binding: DeviceBindingRecord, preferences?: EmergencyPreferences | null) {
    if (!binding.apiDeviceId) return { failedScopes: [] as ApiConsentScope[], status: "not_attempted" as const };

    const consentDrafts = buildConsentDrafts(preferences);
    const evidence = {
      app_version: binding.appVersion,
      device_public_key_sha256: binding.publicKeySha256,
      platform: binding.platform,
      source: "mobile_authenticated_device_bootstrap"
    };
    const acceptedAt = new Date().toISOString();
    const results = await Promise.allSettled(
      consentDrafts.map((draft) =>
        this.client.createConsentRecord({
          accepted: draft.accepted,
          acceptedAt,
          deviceId: binding.apiDeviceId,
          evidence,
          scope: draft.scope,
          version: draft.version
        })
      )
    );
    const failedScopes = results
      .map((result, index) => (result.status === "rejected" ? consentDrafts[index]?.scope : null))
      .filter((scope): scope is ApiConsentScope => Boolean(scope));

    return {
      failedScopes,
      status: failedScopes.length > 0 ? ("partial" as const) : ("recorded" as const)
    };
  }

  async completeAuthenticatedBootstrap(preferences?: EmergencyPreferences | null): Promise<DeviceBootstrapResult> {
    const { binding, device } = await this.registerAuthenticatedDevice();
    const consentResult = await this.recordConsentSet(binding, preferences);

    return {
      binding,
      consentStatus: consentResult.status,
      device,
      failedConsentScopes: consentResult.failedScopes
    };
  }
}

export const deviceBindingService = new DeviceBindingService();
