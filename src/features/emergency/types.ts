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
  storage: "app_private_sandbox" | "app_private_encrypted_chunks" | "app_private_native_segments";
  cameraMode: "front" | "back";
  requestedCameraMode?: "front" | "back" | "both";
  sizeBytes: number;
  sha256: string;
  hashMode: "content_sha256" | "metadata_sha256_pending_streaming" | "chunked_plaintext_sha256";
  recordedAt: string;
  completedAt: string;
  captureProfile?: MediaCaptureCompatibilityProfile;
  encryptionStatus:
    | "local_sandbox_pending_backend_envelope"
    | "encrypted_chunked_xchacha20poly1305"
    | "encrypted_native_segmented_v1";
  encryptedVideo?: EncryptedVideoEnvelope;
};

export type MediaCaptureCompatibilityProfile = {
  schemaVersion: "sinalseguro.media-capture-profile.v1";
  platform: "android" | "ios" | "web" | "windows" | "macos";
  platformVersion: string;
  requestedCameraMode?: "front" | "back" | "both";
  runtimeCameraMode: "front" | "back" | "both";
  actualCameraMode: "front" | "back";
  compatibilityTier:
    | "android_single_camera_conservative"
    | "android_single_camera_fallback"
    | "ios_h264_low_bitrate_segmented"
    | "generic_single_camera_conservative";
  recordingContainer: "mp4";
  videoCodec: "h264" | "platform_default_h264_mp4";
  videoQuality: "2160p" | "1080p" | "720p" | "480p" | "4:3";
  targetVideoBitrate: number;
  segmentDurationSeconds: number | null;
  pictureSizeCount: number | null;
  pictureSizesSample: string[];
  availableLenses: string[];
  availableVideoCodecs: string[];
  p2pCompatibility: {
    callMediaInterop: "recording_profile_conservative_mp4_h264";
    envelopeScope: "media_asset";
    requiresRecipientKeyEnvelope: true;
    supportsDeferredRecipientEnvelope: true;
  };
};

export type MediaProcessingState =
  | "stop_requested"
  | "camera_released"
  | "plaintext_detected"
  | "encrypting"
  | "packaging"
  | "cleanup"
  | "attached"
  | "no_media"
  | "error";

export type RecipientKeyEnvelope = {
  schemaVersion: "sinalseguro.recipient-key-envelope.placeholder.v1";
  status: "deferred_until_recipient_crypto";
  recipientDeviceId?: string;
  recipientKeyId?: string;
  keyAgreement?: "x25519_future" | "backend_registry_pending";
};

export type MediaDiagnosticsSnapshot = {
  schemaVersion: "sinalseguro.media-diagnostics.v1";
  runId: string;
  recordedAt: string;
  events: Array<{
    schemaVersion: "sinalseguro.media-diagnostic-event.v1";
    runId: string;
    stage:
      | "capture_mount"
      | "capture_recording"
      | "loopback_open"
      | "loopback_stream"
      | "native_engine_cleanup"
      | "native_engine_encrypt_segment"
      | "native_engine_open_playback"
      | "native_engine_playback_prepare"
      | "native_engine_segment_total"
      | "player_cache_prepare"
      | "player_loopback_skipped"
      | "playback_first_progress"
      | "playback_prepare"
      | "preserve_cleanup"
      | "preserve_encrypt_chunks"
      | "preserve_source_stat"
      | "preserve_thumbnail"
      | "preserve_total"
      | "preserve_verify";
    status: "cancelled" | "error" | "ok";
    startedAt: string;
    durationMs: number;
    metrics?: Record<string, boolean | number | string | null>;
    errorCode?: "cancelled" | "media_error";
  }>;
};

export type MediaCaptureFailureReason =
  | "camera_mount_error"
  | "camera_no_file_returned"
  | "camera_output_not_ready"
  | "camera_recording_error"
  | "media_permissions_denied";

export type MediaCaptureDiagnosticSummary = {
  schemaVersion: "sinalseguro.media-capture-diagnostic.v1";
  status: "capture_failed";
  reason: MediaCaptureFailureReason;
  recordedAt: string;
  diagnostics: MediaDiagnosticsSnapshot;
};

export type EncryptedVideoEnvelope = {
  protocolVersion: "sinalseguro.encrypted-video.v1";
  algorithm: "xchacha20poly1305" | "aes-256-gcm";
  packageId: string;
  keyId?: string;
  keyRef: string;
  emergencySessionId?: string | null;
  envelopeScope?: "media_asset";
  storageEngine?: "js_chunked_v1" | "native_segmented_v1";
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
  plaintextCleanup?: {
    attemptedAt: string;
    status: "deleted" | "cleanup_pending";
  };
  captureProfile?: MediaCaptureCompatibilityProfile;
  diagnostics?: MediaDiagnosticsSnapshot;
  recipientKeyEnvelopes: RecipientKeyEnvelope[];
  playbackAdapter: "range_data_source_required" | "native_encrypted_source";
  nativePlayback?: {
    engine: "SinalSeguroMediaEngine";
    sourceUri?: string;
    segmentManifestUri?: string;
    temporaryCleartextPolicy?: "cache_no_backup_delete_on_close";
  };
  processingState?: MediaProcessingState;
};

export type MediaCaptureManifest =
  | {
      status: "pending_local_recording";
      recordingMode: "video";
      assets: [];
      policy: string;
      diagnostic?: MediaCaptureDiagnosticSummary;
    }
  | {
      status: "recorded_local";
      recordingMode: "video";
      assets: LocalMediaAsset[];
      policy: string;
      diagnostic?: MediaCaptureDiagnosticSummary;
    }
  | {
      status: "blocked_public_build";
      recordingMode: "none";
      assets: [];
      policy: string;
    };

export type EmergencyFinishReason =
  | "manual_finish"
  | "recording_duration_elapsed"
  | "immediate_package"
  | "interrupted_on_launch";

export type EmergencyRemoteSharingPlan = {
  coordinator: {
    status: "planned_ec2_coordination";
    service: "sinalseguro-api";
    responsibilities: readonly [
      "login",
      "device_binding",
      "recipient_registry",
      "public_key_directory",
      "key_envelope_distribution",
      "p2p_signaling",
      "audit"
    ];
  };
  auth: {
    status: "login_required_before_remote_sharing";
    modes: readonly ["oidc_prepared", "device_binding", "mfa_future"];
  };
  keyExchange: {
    status: "waiting_backend_key_registry";
    mediaKeyPolicy: "one_symmetric_key_per_asset_wrapped_per_recipient";
    liveSessionKeyPolicy: "ephemeral_session_keys_wrapped_per_authorized_recipient";
  };
  realtime: {
    status: "waiting_realtime_adapter";
    channels: readonly ["video", "audio", "location"];
    encryption: "e2ee_required_before_transport";
    activeOnlyPolicy: "share_only_while_emergency_recording_local";
  };
  p2p: {
    status: "waiting_adapter";
    candidates: readonly ["webrtc", "nearby", "multipeer"];
    fallback: "server_store_and_forward_future";
  };
  conveniados: {
    status: "future_contract_required";
    accessPolicy: "rbac_mfa_audit_retention_required";
  };
};

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
  remoteSharing: EmergencyRemoteSharingPlan;
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
