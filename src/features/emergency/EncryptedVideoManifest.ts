import {
  encryptedVideoAlgorithm,
  encryptedVideoProtocolVersion
} from "./VideoCryptoService";

type ActualCameraMode = "front" | "back";
type RequestedCameraMode = "front" | "back" | "both";

export type EncryptedVideoChunkManifest = {
  index: number;
  chunkUri: string;
  plaintextOffset: number;
  plaintextSizeBytes: number;
  sealedSizeBytes: number;
  ciphertextSizeBytes: number;
  nonce: string;
  tag: string;
  plaintextSha256: string;
  ciphertextSha256: string;
};

export type EncryptedVideoManifest = {
  protocolVersion: typeof encryptedVideoProtocolVersion;
  algorithm: typeof encryptedVideoAlgorithm;
  assetId: string;
  packageId: string;
  sourceFileName: string;
  mimeType: "video/mp4";
  codec: "video/mp4";
  durationMs: null;
  chunkSizeBytes: number;
  chunkCount: number;
  plaintextSizeBytes: number;
  encryptedSizeBytes: number;
  plaintextSha256: string;
  ciphertextSha256: string;
  recordedAt: string;
  completedAt: string;
  cameraMode: ActualCameraMode;
  requestedCameraMode?: RequestedCameraMode;
  thumbnail: {
    status: "pending_secure_derivation";
    reason: string;
  };
  recipientKeyEnvelopes: [];
  chunks: EncryptedVideoChunkManifest[];
};

export function encryptedVideoChunkAad(
  assetId: string,
  chunk: Pick<EncryptedVideoChunkManifest, "index" | "plaintextOffset" | "plaintextSizeBytes">
) {
  return {
    protocolVersion: encryptedVideoProtocolVersion,
    scope: "chunk",
    assetId,
    index: chunk.index,
    plaintextOffset: chunk.plaintextOffset,
    plaintextSizeBytes: chunk.plaintextSizeBytes
  };
}

export function encryptedVideoManifestAad(assetId: string, packageId: string) {
  return {
    protocolVersion: encryptedVideoProtocolVersion,
    scope: "manifest",
    assetId,
    packageId
  };
}
