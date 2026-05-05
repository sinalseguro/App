export type EmergencyKind = "test" | "real";

export type LocationSnapshot =
  | {
      status: "captured";
      capturedAt: string;
      latitude: number;
      longitude: number;
      accuracyMeters: number;
      altitudeMeters?: number | null;
      headingDegrees?: number | null;
      speedMetersPerSecond?: number | null;
    }
  | {
      status: "permission_denied" | "services_disabled" | "skipped" | "error";
      capturedAt: string;
      reason: string;
    };

export type LocalMediaAsset = {
  id: string;
  kind: "video";
  uri: string;
  fileName: string;
  mimeType: "video/mp4";
  storage: "app_private_sandbox" | "app_private_encrypted_chunks";
  cameraMode: "front" | "back";
  requestedCameraMode?: "front" | "back" | "both";
  sizeBytes: number;
  sha256: string;
  hashMode: "content_sha256" | "metadata_sha256_pending_streaming" | "chunked_plaintext_sha256";
  recordedAt: string;
  completedAt: string;
  encryptionStatus: "local_sandbox_pending_backend_envelope" | "encrypted_chunked_xchacha20poly1305";
  encryptedVideo?: EncryptedVideoEnvelope;
};

export type EncryptedVideoEnvelope = {
  protocolVersion: "sinalseguro.encrypted-video.v1";
  algorithm: "xchacha20poly1305";
  packageId: string;
  keyRef: string;
  manifestUri: string;
  manifestNonce: string;
  manifestTag: string;
  manifestSha256: string;
  storageDirectoryUri: string;
  chunkSizeBytes: number;
  chunkCount: number;
  plaintextSizeBytes: number;
  encryptedSizeBytes: number;
  codec: "video/mp4";
  durationMs?: number | null;
  recipientKeyEnvelopes: [];
  playbackAdapter: "range_data_source_required";
};

export type MediaCaptureManifest =
  | {
      status: "pending_local_recording";
      recordingMode: "video";
      assets: [];
      policy: string;
    }
  | {
      status: "recorded_local";
      recordingMode: "video";
      assets: LocalMediaAsset[];
      policy: string;
    }
  | {
      status: "blocked_public_build";
      recordingMode: "none";
      assets: [];
      policy: string;
    };

export type EmergencyFinishReason = "manual_finish" | "recording_duration_elapsed" | "immediate_package";

export type EmergencyDeliveryPlan = {
  api: {
    status: "waiting_backend";
    endpoint: "/alerts";
  };
  p2p: {
    status: "waiting_adapter";
    candidates: readonly ["webrtc", "nearby", "multipeer"];
  };
  trustedContacts: Array<{
    contactId: string;
    status: "local_reference_pending_contract";
  }>;
};

export type EmergencyPackage = {
  id: string;
  schemaVersion: "sinalseguro.emergency-package.v1";
  kind: EmergencyKind;
  status: "recording_local" | "recorded_local";
  clientAlertId: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  capture: {
    status: "recording" | "recorded";
    startedAt: string;
    completedAt?: string;
    plannedDurationSeconds: number;
    elapsedMs?: number;
    endReason?: EmergencyFinishReason;
    evidenceTypes: readonly ["timestamp", "location_snapshot", "media_manifest", "delivery_plan"];
  };
  consentSnapshot: {
    termsVersion: "mvp-controlado-2026-05-02";
    location: "foreground_when_triggered" | "foreground_pre_authorized";
    media: "local_recording_enabled_with_explicit_permission";
    sharing: "blocked_until_contract_backend_audit";
  };
  location: LocationSnapshot;
  media: MediaCaptureManifest;
  deliveryPlan: EmergencyDeliveryPlan;
  integrity: {
    sha256: string;
    calculatedAt: string;
  };
};

export type EmergencyExchangeEnvelope = {
  protocolVersion: "sinalseguro.emergency-exchange.v1";
  packageId: string;
  clientAlertId: string;
  idempotencyKey: string;
  readyForBackend: false;
  readyForP2PAdapter: false;
  locationStatus: LocationSnapshot["status"];
  mediaStatus: MediaCaptureManifest["status"];
  packageSha256: string;
  createdAt: string;
};
