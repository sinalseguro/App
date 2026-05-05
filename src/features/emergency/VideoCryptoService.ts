import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { base64ToBytes, bytesToBase64, bytesToHex, utf8ToBytes } from "./videoByteEncoding";

export const encryptedVideoProtocolVersion = "sinalseguro.encrypted-video.v1" as const;
export const encryptedVideoAlgorithm = "xchacha20poly1305" as const;
export const encryptedVideoKeyBytes = 32;
export const encryptedVideoNonceBytes = 24;
export const encryptedVideoTagBytes = 16;

export type EncryptedVideoAlgorithm = typeof encryptedVideoAlgorithm;

export type VideoCryptoRandomSource = {
  getRandomBytes: (byteCount: number) => Uint8Array;
};

export type EncryptedVideoChunkCryptoResult = {
  sealedBytes: Uint8Array;
  nonce: string;
  tag: string;
  ciphertextBytes: Uint8Array;
};

function defaultRandomSource(): VideoCryptoRandomSource {
  return {
    getRandomBytes: (byteCount) => {
      const bytes = new Uint8Array(byteCount);
      const webCrypto = globalThis.crypto;
      if (!webCrypto?.getRandomValues) {
        throw new Error("Fonte criptografica segura indisponivel para gerar chave/nonce de video.");
      }

      webCrypto.getRandomValues(bytes);
      return bytes;
    }
  };
}

export function stableJson(value: unknown): string {
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

export function sha256Hex(bytes: Uint8Array) {
  return bytesToHex(sha256(bytes));
}

export function createSha256() {
  return sha256.create();
}

export class VideoCryptoService {
  private readonly randomSource: VideoCryptoRandomSource;

  constructor(randomSource: VideoCryptoRandomSource = defaultRandomSource()) {
    this.randomSource = randomSource;
  }

  generateVideoKey() {
    return this.randomSource.getRandomBytes(encryptedVideoKeyBytes);
  }

  generateNonce() {
    return this.randomSource.getRandomBytes(encryptedVideoNonceBytes);
  }

  encryptChunk(key: Uint8Array, plaintextBytes: Uint8Array, aad: unknown): EncryptedVideoChunkCryptoResult {
    const nonceBytes = this.generateNonce();
    const aadBytes = utf8ToBytes(stableJson(aad));
    const sealedBytes = xchacha20poly1305(key, nonceBytes, aadBytes).encrypt(plaintextBytes);
    const ciphertextBytes = sealedBytes.subarray(0, sealedBytes.length - encryptedVideoTagBytes);
    const tagBytes = sealedBytes.subarray(sealedBytes.length - encryptedVideoTagBytes);

    return {
      sealedBytes,
      nonce: bytesToBase64(nonceBytes),
      tag: bytesToBase64(tagBytes),
      ciphertextBytes
    };
  }

  decryptChunk(key: Uint8Array, sealedBytes: Uint8Array, nonceBase64: string, aad: unknown) {
    const nonceBytes = base64ToBytes(nonceBase64);
    if (nonceBytes.length !== encryptedVideoNonceBytes) {
      throw new Error("Nonce do chunk invalido.");
    }

    try {
      return xchacha20poly1305(key, nonceBytes, utf8ToBytes(stableJson(aad))).decrypt(sealedBytes);
    } catch {
      throw new Error("Falha de autenticacao do chunk criptografado.");
    }
  }

  encryptManifest(key: Uint8Array, manifestBytes: Uint8Array, aad: unknown) {
    return this.encryptChunk(key, manifestBytes, aad);
  }

  decryptManifest(key: Uint8Array, sealedBytes: Uint8Array, nonceBase64: string, aad: unknown) {
    try {
      return this.decryptChunk(key, sealedBytes, nonceBase64, aad);
    } catch {
      throw new Error("Manifesto criptografado invalido ou chave incorreta.");
    }
  }
}
