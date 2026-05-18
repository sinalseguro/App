import {
  ConsentRecordSchema,
  CreateConsentRecordInput,
  DeviceSchema,
  RegisterDeviceInput,
  RotateDeviceKeyInput
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";
import { currentPlatform, toApiDateTime } from "@/services/api/utils";

export class DevicesApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async registerDevice(input: RegisterDeviceInput) {
    return this.core.request("/devices/", DeviceSchema, {
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
    return this.core.request(`/devices/${deviceId}/rotate-key/`, DeviceSchema, {
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
    return this.core.request(`/devices/${deviceId}/revoke/`, DeviceSchema, {
      authenticated: true,
      body: { reason },
      method: "POST"
    });
  }

  async markDeviceLost(deviceId: string) {
    return this.core.request(`/devices/${deviceId}/mark-lost/`, DeviceSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async createConsentRecord(input: CreateConsentRecordInput) {
    return this.core.request("/consents/", ConsentRecordSchema, {
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
}
