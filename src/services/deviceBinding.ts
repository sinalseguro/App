import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

import { defaultEmergencyPreferences, EmergencyPreferences } from "@/features/emergency/emergencyPreferences";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import {
  ApiConsentScope,
  ApiDevice,
  LoginDeviceContext,
  LogoutDeviceContext,
  SinalSeguroApiClient,
  apiClient
} from "@/services/apiClient";
import {
  buildDeviceKeyProof,
  createDevicePublicKey,
  bytesToHex,
  DEVICE_KEY_ALGORITHM,
  publicKeySha256Hex
} from "@/services/deviceKeyProof";

const DEVICE_BINDING_SCHEMA_VERSION = "sinalseguro.device-binding.v2";
const LEGACY_DEVICE_BINDING_SCHEMA_VERSION = "sinalseguro.device-binding.v1";
const DEVICE_PRIVATE_SECRET_KEY = "device.binding.private.v1";
const DEVICE_PUBLIC_RECORD_KEY = "device.binding.public-record.v1";
const DEFAULT_APP_VERSION = "0.1.0";

type DevicePlatform = "android" | "ios" | "web";

type DevicePrivateRecord = {
  schemaVersion: typeof DEVICE_BINDING_SCHEMA_VERSION | typeof LEGACY_DEVICE_BINDING_SCHEMA_VERSION;
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
  legacyPublicKeySha256?: string;
  registeredAt?: string;
  rotatedAt?: string;
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

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
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

function isUsablePrivateRecord(value: DevicePrivateRecord | null): value is DevicePrivateRecord {
  return (
    Boolean(value) &&
    (value?.schemaVersion === DEVICE_BINDING_SCHEMA_VERSION ||
      value?.schemaVersion === LEGACY_DEVICE_BINDING_SCHEMA_VERSION) &&
    Boolean(value?.localDeviceId) &&
    /^[0-9a-f]{64}$/.test(value?.privateSeedHex ?? "")
  );
}

async function getNonceBytes() {
  return Crypto.getRandomBytesAsync(16);
}

function normalizePrivateRecord(privateRecord: DevicePrivateRecord): DevicePrivateRecord {
  return {
    ...privateRecord,
    schemaVersion: DEVICE_BINDING_SCHEMA_VERSION
  };
}

function getLegacyPublicKeySha256(storedPublicRecord?: Partial<DeviceBindingRecord> | null) {
  if (!storedPublicRecord?.publicKeySha256) return undefined;
  if (storedPublicRecord.schemaVersion !== DEVICE_BINDING_SCHEMA_VERSION) return storedPublicRecord.publicKeySha256;
  if (storedPublicRecord.keyAlgorithm !== DEVICE_KEY_ALGORITHM) return storedPublicRecord.publicKeySha256;
  return undefined;
}

async function derivePublicRecord(
  privateRecord: DevicePrivateRecord,
  storedPublicRecord?: Partial<DeviceBindingRecord> | null
): Promise<DeviceBindingRecord> {
  const appVersion = currentAppVersion();
  const platform = currentPlatform();
  const publicKey = createDevicePublicKey(privateRecord.privateSeedHex);
  const publicKeySha256 = publicKeySha256Hex(publicKey);
  const legacyPublicKeySha256 = getLegacyPublicKeySha256(storedPublicRecord);

  return {
    schemaVersion: DEVICE_BINDING_SCHEMA_VERSION,
    appVersion,
    createdAt: privateRecord.createdAt,
    keyAlgorithm: DEVICE_KEY_ALGORITHM,
    localDeviceId: privateRecord.localDeviceId,
    platform,
    publicKey,
    publicKeySha256,
    ...(storedPublicRecord?.apiDeviceId ? { apiDeviceId: storedPublicRecord.apiDeviceId } : {}),
    ...(legacyPublicKeySha256 && legacyPublicKeySha256 !== publicKeySha256 ? { legacyPublicKeySha256 } : {}),
    ...(storedPublicRecord?.registeredAt ? { registeredAt: storedPublicRecord.registeredAt } : {}),
    ...(storedPublicRecord?.rotatedAt ? { rotatedAt: storedPublicRecord.rotatedAt } : {})
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

  private async getOrCreateBindingPair() {
    const storedPrivateRecord = safeParseJson<DevicePrivateRecord>(await readSecret(DEVICE_PRIVATE_SECRET_KEY));
    const storedPublicRecord = safeParseJson<Partial<DeviceBindingRecord>>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));

    if (isUsablePrivateRecord(storedPrivateRecord)) {
      const privateRecord = normalizePrivateRecord(storedPrivateRecord);
      const publicRecord = await derivePublicRecord(privateRecord, storedPublicRecord);
      await saveSecret(DEVICE_PRIVATE_SECRET_KEY, JSON.stringify(privateRecord));
      await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(publicRecord));
      return {
        binding: publicRecord,
        privateRecord
      };
    }

    const privateRecord = await createPrivateRecord();
    const publicRecord = await derivePublicRecord(privateRecord, storedPublicRecord);

    await saveSecret(DEVICE_PRIVATE_SECRET_KEY, JSON.stringify(privateRecord));
    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(publicRecord));

    return { binding: publicRecord, privateRecord };
  }

  async getOrCreateBinding() {
    const { binding } = await this.getOrCreateBindingPair();
    return {
      ...binding,
      appVersion: currentAppVersion(),
      platform: currentPlatform()
    };
  }

  async getRegisteredApiDeviceId() {
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));
    return storedPublicRecord?.apiDeviceId ?? null;
  }

  async getLoginDeviceContext(): Promise<LoginDeviceContext> {
    const binding = await this.getOrCreateBinding();
    return {
      appVersion: binding.appVersion,
      deviceLabel: buildDeviceLabel(binding.platform),
      platform: binding.platform,
      legacyPublicKeySha256: binding.legacyPublicKeySha256,
      publicKeySha256: binding.publicKeySha256
    };
  }

  async getLogoutDeviceContext(): Promise<LogoutDeviceContext | null> {
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));
    if (!storedPublicRecord?.publicKeySha256 && !storedPublicRecord?.apiDeviceId) return null;

    return {
      deviceId: storedPublicRecord.apiDeviceId ?? null,
      publicKeySha256: storedPublicRecord.publicKeySha256 ?? null
    };
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
    const { binding, privateRecord } = await this.getOrCreateBindingPair();
    const deviceLabel = buildDeviceLabel(binding.platform);
    const keyProof = await buildDeviceKeyProof(
      {
        appVersion: binding.appVersion,
        deviceLabel,
        platform: binding.platform,
        privateSeedHex: privateRecord.privateSeedHex,
        publicKey: binding.publicKey,
        purpose: "device.register"
      },
      await getNonceBytes()
    );
    const device = await this.client.registerDevice({
      appVersion: binding.appVersion,
      deviceLabel,
      keyAlgorithm: binding.keyAlgorithm,
      keyProof,
      platform: binding.platform,
      publicKey: binding.publicKey,
      replacesPublicKeySha256: binding.legacyPublicKeySha256
    });
    const nextBinding: DeviceBindingRecord = {
      ...binding,
      apiDeviceId: device.id,
      legacyPublicKeySha256: undefined,
      publicKeySha256: device.public_key_sha256 ?? binding.publicKeySha256,
      registeredAt: new Date().toISOString()
    };

    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(nextBinding));
    return { binding: nextBinding, device };
  }

  async rotateAuthenticatedDeviceKey() {
    const { binding, privateRecord } = await this.getOrCreateBindingPair();
    if (!binding.apiDeviceId) {
      throw new Error("Dispositivo precisa estar registrado antes da rotacao de chave.");
    }

    const rotatedPrivateRecord: DevicePrivateRecord = {
      ...privateRecord,
      privateSeedHex: bytesToHex(await Crypto.getRandomBytesAsync(32))
    };
    const rotatedAt = new Date().toISOString();
    const nextBinding = await derivePublicRecord(rotatedPrivateRecord, {
      ...binding,
      legacyPublicKeySha256: binding.publicKeySha256,
      publicKeySha256: binding.publicKeySha256,
      registeredAt: binding.registeredAt,
      rotatedAt
    });
    const deviceLabel = buildDeviceLabel(nextBinding.platform);
    const keyProof = await buildDeviceKeyProof(
      {
        appVersion: nextBinding.appVersion,
        deviceLabel,
        platform: nextBinding.platform,
        privateSeedHex: rotatedPrivateRecord.privateSeedHex,
        publicKey: nextBinding.publicKey,
        purpose: "device.rotate"
      },
      await getNonceBytes()
    );
    const device = await this.client.rotateDeviceKey(binding.apiDeviceId, {
      appVersion: nextBinding.appVersion,
      deviceLabel,
      keyAlgorithm: nextBinding.keyAlgorithm,
      keyProof,
      platform: nextBinding.platform,
      publicKey: nextBinding.publicKey
    });
    const registeredBinding: DeviceBindingRecord = {
      ...nextBinding,
      apiDeviceId: device.id,
      legacyPublicKeySha256: undefined,
      publicKeySha256: device.public_key_sha256 ?? nextBinding.publicKeySha256,
      registeredAt: binding.registeredAt ?? rotatedAt,
      rotatedAt
    };

    await saveSecret(DEVICE_PRIVATE_SECRET_KEY, JSON.stringify(rotatedPrivateRecord));
    await saveSecret(DEVICE_PUBLIC_RECORD_KEY, JSON.stringify(registeredBinding));

    return { binding: registeredBinding, device };
  }

  async markRegisteredDeviceLost() {
    const storedPublicRecord = safeParseJson<DeviceBindingRecord>(await readSecret(DEVICE_PUBLIC_RECORD_KEY));
    if (!storedPublicRecord?.apiDeviceId) return null;
    return this.client.markDeviceLost(storedPublicRecord.apiDeviceId);
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
