import AsyncStorage from "@react-native-async-storage/async-storage";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { sha256 } from "@noble/hashes/sha2.js";
import * as Crypto from "expo-crypto";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";

declare const Buffer: {
  from(value: string | ArrayLike<number> | ArrayBuffer, encoding?: string): {
    toString(encoding?: string): string;
    length: number;
    [index: number]: number;
  };
} | undefined;

type StoredRecord = {
  id: string;
};

type EncryptedStoredRecord = {
  schemaVersion: "sinalseguro.secure-json-record.v1";
  algorithm: "xchacha20poly1305";
  ciphertext: string;
  ciphertextSha256: string;
  nonce: string;
};

const secureJsonRecordKeyBytes = 32;
const secureJsonRecordNonceBytes = 24;

function indexKey(namespace: string) {
  return `${namespace}.index`;
}

function itemKey(namespace: string, id: string) {
  return `${namespace}.item.${id}`;
}

function encryptedItemKey(namespace: string, id: string) {
  return `${namespace}.encrypted-item.${id}`;
}

function namespaceKeyRef(namespace: string) {
  return `${namespace}.record-key.v1`;
}

async function readIndex(namespace: string) {
  const raw = await AsyncStorage.getItem(indexKey(namespace));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function writeIndex(namespace: string, ids: string[]) {
  const uniqueIds = Array.from(new Set(ids));
  await AsyncStorage.setItem(indexKey(namespace), JSON.stringify(uniqueIds));
}

async function readNamespaceKey(namespace: string) {
  const keyRef = namespaceKeyRef(namespace);
  const existingKey = await readSecret(keyRef);
  if (existingKey) {
    try {
      const key = base64ToBytes(existingKey);
      if (key.length === secureJsonRecordKeyBytes) return key;
    } catch {
      return null;
    }
  }

  return null;
}

async function getOrCreateNamespaceKey(namespace: string) {
  const currentKey = await readNamespaceKey(namespace);
  if (currentKey) return currentKey;

  const keyRef = namespaceKeyRef(namespace);
  const nextKey = await Crypto.getRandomBytesAsync(secureJsonRecordKeyBytes);
  await saveSecret(keyRef, bytesToBase64(nextKey));
  return nextKey;
}

async function saveEncryptedRecord(namespace: string, id: string, raw: string) {
  const key = await getOrCreateNamespaceKey(namespace);
  const nonce = await Crypto.getRandomBytesAsync(secureJsonRecordNonceBytes);
  const aad = utf8ToBytes(stableJson({ id, namespace, schemaVersion: "sinalseguro.secure-json-record.v1" }));
  const sealedBytes = xchacha20poly1305(key, nonce, aad).encrypt(utf8ToBytes(raw));
  const envelope: EncryptedStoredRecord = {
    schemaVersion: "sinalseguro.secure-json-record.v1",
    algorithm: "xchacha20poly1305",
    ciphertext: bytesToBase64(sealedBytes),
    ciphertextSha256: bytesToHex(sha256(sealedBytes)),
    nonce: bytesToBase64(nonce)
  };

  await AsyncStorage.setItem(encryptedItemKey(namespace, id), JSON.stringify(envelope));
}

async function readEncryptedRecord(namespace: string, id: string) {
  const rawEnvelope = await AsyncStorage.getItem(encryptedItemKey(namespace, id));
  if (!rawEnvelope) return null;

  try {
    const envelope = JSON.parse(rawEnvelope) as Partial<EncryptedStoredRecord>;
    if (
      envelope.schemaVersion !== "sinalseguro.secure-json-record.v1" ||
      envelope.algorithm !== "xchacha20poly1305" ||
      typeof envelope.ciphertext !== "string" ||
      typeof envelope.ciphertextSha256 !== "string" ||
      typeof envelope.nonce !== "string"
    ) {
      return null;
    }

    const sealedBytes = base64ToBytes(envelope.ciphertext);
    if (bytesToHex(sha256(sealedBytes)) !== envelope.ciphertextSha256) {
      return null;
    }

    const key = await readNamespaceKey(namespace);
    if (!key) return null;

    const nonce = base64ToBytes(envelope.nonce);
    const aad = utf8ToBytes(stableJson({ id, namespace, schemaVersion: envelope.schemaVersion }));
    return bytesToUtf8(xchacha20poly1305(key, nonce, aad).decrypt(sealedBytes));
  } catch {
    return null;
  }
}

async function readRecord(namespace: string, id: string) {
  const encryptedRecord = await readEncryptedRecord(namespace, id);
  if (encryptedRecord) return encryptedRecord;

  const legacyRecord = await readSecret(itemKey(namespace, id));
  if (!legacyRecord) return null;

  await saveEncryptedRecord(namespace, id, legacyRecord);
  await deleteSecret(itemKey(namespace, id)).catch(() => undefined);
  return legacyRecord;
}

export async function saveSecureRecord<T extends StoredRecord>(namespace: string, value: T) {
  await saveEncryptedRecord(namespace, value.id, JSON.stringify(value));
  await deleteSecret(itemKey(namespace, value.id)).catch(() => undefined);

  const ids = await readIndex(namespace);
  if (!ids.includes(value.id)) {
    await writeIndex(namespace, [value.id, ...ids]);
  }
}

export async function listSecureRecords<T extends StoredRecord>(namespace: string): Promise<T[]> {
  const ids = await readIndex(namespace);
  const records: T[] = [];
  const validIds: string[] = [];

  for (const id of ids) {
    const raw = await readRecord(namespace, id);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as T;
      records.push(parsed);
      validIds.push(id);
    } catch {
      await deleteSecret(itemKey(namespace, id));
      await AsyncStorage.removeItem(encryptedItemKey(namespace, id));
    }
  }

  if (validIds.length !== ids.length) {
    await writeIndex(namespace, validIds);
  }

  return records;
}

export async function deleteSecureRecord(namespace: string, id: string) {
  await deleteSecret(itemKey(namespace, id));
  await AsyncStorage.removeItem(encryptedItemKey(namespace, id));
  const ids = await readIndex(namespace);
  await writeIndex(
    namespace,
    ids.filter((item) => item !== id)
  );
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function utf8ToBytes(value: string) {
  return new TextEncoder().encode(value);
}

function bytesToUtf8(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64(bytes: Uint8Array) {
  if (typeof btoa === "function") {
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      const chunk = bytes.subarray(offset, offset + 0x8000);
      binary += String.fromCharCode(...Array.from(chunk));
    }
    return btoa(binary);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  throw new Error("Codificador Base64 indisponivel neste ambiente.");
}

function base64ToBytes(base64: string) {
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
