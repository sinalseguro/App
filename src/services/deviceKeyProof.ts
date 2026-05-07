import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";

export const DEVICE_KEY_ALGORITHM = "ed25519-v1";
export const DEVICE_KEY_PROOF_SCHEMA_VERSION = "sinalseguro.device-key-proof.v1";
export const DEVICE_PUBLIC_KEY_PREFIX = "sseg-device-public-key-v1";

export type DeviceKeyProofPurpose = "device.register" | "device.rotate";

export type DeviceKeyProof = {
  algorithm: typeof DEVICE_KEY_ALGORITHM;
  nonce: string;
  payload_sha256: string;
  schema_version: typeof DEVICE_KEY_PROOF_SCHEMA_VERSION;
  signature: string;
  signed_at: string;
};

export type DeviceKeyProofInput = {
  appVersion: string;
  deviceLabel: string;
  platform: "android" | "ios" | "web";
  privateSeedHex: string;
  publicKey: string;
  purpose: DeviceKeyProofPurpose;
};

const base64UrlPaddingPattern = /=+$/;
const base64UrlUnsafePlusPattern = /\+/g;
const base64UrlUnsafeSlashPattern = /\//g;
const base64UrlDashPattern = /-/g;
const base64UrlUnderscorePattern = /_/g;
const binaryChunkSize = 0x8000;

declare const Buffer:
  | {
      from(value: string | ArrayLike<number> | ArrayBuffer, encoding?: string): {
        toString(encoding?: string): string;
        length: number;
        [index: number]: number;
      };
    }
  | undefined;

function bytesToBase64(bytes: Uint8Array) {
  if (typeof btoa === "function") {
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += binaryChunkSize) {
      const chunk = bytes.subarray(offset, offset + binaryChunkSize);
      binary += String.fromCharCode(...Array.from(chunk));
    }
    return btoa(binary);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  throw new Error("Codificador Base64 indisponivel neste ambiente.");
}

export function bytesToBase64Url(bytes: Uint8Array) {
  return bytesToBase64(bytes)
    .replace(base64UrlPaddingPattern, "")
    .replace(base64UrlUnsafePlusPattern, "-")
    .replace(base64UrlUnsafeSlashPattern, "_");
}

export function base64UrlToBytes(value: string) {
  const paddedValue = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`;
  const base64 = paddedValue.replace(base64UrlDashPattern, "+").replace(base64UrlUnderscorePattern, "/");

  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  if (typeof Buffer !== "undefined") {
    const buffer = Buffer.from(base64, "base64");
    const bytes = new Uint8Array(buffer.length);
    for (let index = 0; index < buffer.length; index += 1) {
      bytes[index] = buffer[index];
    }
    return bytes;
  }

  throw new Error("Decodificador Base64 indisponivel neste ambiente.");
}

export function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(value: string) {
  if (value.length % 2 !== 0) {
    throw new Error("Valor hexadecimal invalido.");
  }

  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes;
}

function utf8ToBytes(value: string) {
  return new TextEncoder().encode(value);
}

function canonicalJson(value: Record<string, string>) {
  const sortedEntries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  return JSON.stringify(Object.fromEntries(sortedEntries));
}

export function sha256Hex(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? utf8ToBytes(value) : value;
  return bytesToHex(sha256(bytes));
}

export function createDevicePublicKey(privateSeedHex: string) {
  const publicKeyBytes = ed25519.getPublicKey(hexToBytes(privateSeedHex));
  return `${DEVICE_PUBLIC_KEY_PREFIX}:ed25519:${bytesToBase64Url(publicKeyBytes)}`;
}

export function buildDeviceKeyProofPayload(input: Omit<DeviceKeyProofInput, "privateSeedHex">, proof: Pick<DeviceKeyProof, "nonce" | "signed_at">) {
  return {
    app_version: input.appVersion,
    device_label: input.deviceLabel,
    key_algorithm: DEVICE_KEY_ALGORITHM,
    platform: input.platform,
    proof_nonce: proof.nonce,
    proof_schema_version: DEVICE_KEY_PROOF_SCHEMA_VERSION,
    public_key: input.publicKey,
    purpose: input.purpose,
    signed_at: proof.signed_at
  };
}

export function canonicalizeDeviceKeyProofPayload(payload: ReturnType<typeof buildDeviceKeyProofPayload>) {
  return canonicalJson(payload);
}

export function publicKeySha256Hex(publicKey: string) {
  return sha256Hex(publicKey);
}

export function verifyDeviceKeyProof(input: Omit<DeviceKeyProofInput, "privateSeedHex">, proof: DeviceKeyProof) {
  const payload = buildDeviceKeyProofPayload(input, proof);
  const canonicalPayload = canonicalizeDeviceKeyProofPayload(payload);
  const publicKeyParts = input.publicKey.split(":");
  const [, keyType, publicKeyValue] = publicKeyParts;

  if (
    publicKeyParts.length !== 3 ||
    !publicKeyValue ||
    proof.schema_version !== DEVICE_KEY_PROOF_SCHEMA_VERSION ||
    proof.algorithm !== DEVICE_KEY_ALGORITHM ||
    keyType !== "ed25519" ||
    proof.payload_sha256 !== sha256Hex(canonicalPayload)
  ) {
    return false;
  }

  return ed25519.verify(base64UrlToBytes(proof.signature), utf8ToBytes(canonicalPayload), base64UrlToBytes(publicKeyValue));
}

export function buildDeviceKeyProof(input: DeviceKeyProofInput, nonceBytes: Uint8Array) {
  const proofDraft = {
    algorithm: DEVICE_KEY_ALGORITHM,
    nonce: bytesToBase64Url(nonceBytes),
    schema_version: DEVICE_KEY_PROOF_SCHEMA_VERSION,
    signed_at: new Date().toISOString()
  } as const;
  const payload = buildDeviceKeyProofPayload(input, proofDraft);
  const canonicalPayload = canonicalizeDeviceKeyProofPayload(payload);
  const signature = ed25519.sign(utf8ToBytes(canonicalPayload), hexToBytes(input.privateSeedHex));

  return {
    ...proofDraft,
    payload_sha256: sha256Hex(canonicalPayload),
    signature: bytesToBase64Url(signature)
  };
}
