import { z } from "zod";

import {
  CreateEmergencySessionInput,
  CreateKeyEnvelopeInput,
  EmergencySessionListSchema,
  EmergencySessionResponseAction,
  EmergencySessionSchema,
  KeyEnvelopeSchema,
  LiveAuditMarkerSchema,
  LiveRecipientListSchema,
  P2PSignalSchema,
  RecordLiveAuditMarkerInput,
  SendP2PSignalInput
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";
import { toApiDateTime } from "@/services/api/utils";

export class EmergencyApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async createEmergencySession(input: CreateEmergencySessionInput) {
    return this.core.request("/emergency-sessions/", EmergencySessionSchema, {
      authenticated: true,
      body: {
        client_alert_id: input.clientAlertId,
        device: input.deviceId ?? null,
        idempotency_key: input.idempotencyKey,
        kind: input.kind,
        location_accuracy_meters:
          typeof input.locationAccuracyMeters === "number" ? String(input.locationAccuracyMeters) : null,
        location_status: input.locationStatus,
        protected_subject: input.protectedSubjectId ?? null,
        started_at: toApiDateTime(input.startedAt)
      },
      method: "POST"
    });
  }

  async listReceivedEmergencySessions() {
    return this.core.request("/emergency-sessions/received/", EmergencySessionListSchema, {
      authenticated: true
    });
  }

  async respondToEmergencySession(remoteSessionId: string, action: EmergencySessionResponseAction) {
    return this.core.request(`/emergency-sessions/${remoteSessionId}/respond/`, EmergencySessionSchema, {
      authenticated: true,
      body: { action },
      method: "POST"
    });
  }

  async listLiveRecipients(remoteSessionId: string) {
    return this.core.request(`/emergency-sessions/${remoteSessionId}/live-recipients/`, LiveRecipientListSchema, {
      authenticated: true
    });
  }

  async finishEmergencySession(remoteSessionId: string) {
    return this.core.request(`/emergency-sessions/${remoteSessionId}/finish/`, EmergencySessionSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async recordLiveAuditMarker(remoteSessionId: string, input: RecordLiveAuditMarkerInput) {
    return this.core.request(`/emergency-sessions/${remoteSessionId}/audit-marker/`, LiveAuditMarkerSchema, {
      authenticated: true,
      body: {
        call_session_id: input.callSessionId,
        connection_state: input.connectionState,
        device: input.deviceId ?? null,
        event: input.event,
        local_evidence_status: input.localEvidenceStatus,
        role: input.role
      },
      method: "POST"
    });
  }

  async createKeyEnvelope(input: CreateKeyEnvelopeInput) {
    const body: Record<string, unknown> = {
      algorithm: input.algorithm,
      emergency_session: input.emergencySessionId,
      expires_at: input.expiresAt,
      key_id: input.keyId,
      public_key_sha256: input.publicKeySha256,
      recipient: input.recipientId,
      recipient_device: input.recipientDeviceId ?? null,
      scope: input.scope
    };
    if (input.encryptedKey !== undefined) {
      body.encrypted_key = input.encryptedKey;
    }

    return this.core.request("/key-envelopes/", KeyEnvelopeSchema, {
      authenticated: true,
      body,
      method: "POST"
    });
  }

  async sendP2PSignal(input: SendP2PSignalInput) {
    return this.core.request("/p2p-signals/", P2PSignalSchema, {
      authenticated: true,
      body: {
        emergency_session: input.emergencySessionId,
        expires_at: input.expiresAt,
        payload: input.payload,
        recipient: input.recipientId,
        signal_type: input.signalType
      },
      method: "POST"
    });
  }

  async listP2PSignals() {
    return this.core.request("/p2p-signals/", z.array(P2PSignalSchema), {
      authenticated: true
    });
  }

  async consumeP2PSignal(signalId: string) {
    return this.core.request(`/p2p-signals/${signalId}/consume/`, P2PSignalSchema, {
      authenticated: true,
      method: "POST"
    });
  }
}
