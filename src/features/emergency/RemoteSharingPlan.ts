import { EmergencyDeliveryPlan, EmergencyRemoteSharingPlan } from "./types";

export type BuildEmergencyDeliveryPlanInput = {
  trustedContactIds: string[];
};

export class EmergencyRemoteSharingPlanner {
  buildRemoteSharingPlan(): EmergencyRemoteSharingPlan {
    return {
      coordinator: {
        status: "planned_ec2_coordination",
        service: "sinalseguro-api",
        responsibilities: [
          "login",
          "device_binding",
          "recipient_registry",
          "public_key_directory",
          "key_envelope_distribution",
          "p2p_signaling",
          "audit"
        ] as const
      },
      auth: {
        status: "login_required_before_remote_sharing",
        modes: ["oidc_prepared", "device_binding", "mfa_future"] as const
      },
      keyExchange: {
        status: "waiting_backend_key_registry",
        mediaKeyPolicy: "one_symmetric_key_per_asset_wrapped_per_recipient",
        liveSessionKeyPolicy: "ephemeral_session_keys_wrapped_per_authorized_recipient"
      },
      realtime: {
        status: "waiting_realtime_adapter",
        channels: ["video", "audio", "location"] as const,
        encryption: "e2ee_required_before_transport",
        activeOnlyPolicy: "share_only_while_emergency_recording_local"
      },
      p2p: {
        status: "waiting_adapter",
        candidates: ["webrtc", "nearby", "multipeer"] as const,
        fallback: "server_store_and_forward_future"
      },
      conveniados: {
        status: "future_contract_required",
        accessPolicy: "rbac_mfa_audit_retention_required"
      }
    };
  }

  buildDeliveryPlan({ trustedContactIds }: BuildEmergencyDeliveryPlanInput): EmergencyDeliveryPlan {
    return {
      api: {
        status: trustedContactIds.length > 0 ? "queued_local" : "waiting_backend",
        endpoint: "/emergency-sessions/"
      },
      p2p: {
        status: "waiting_adapter",
        candidates: ["webrtc", "nearby", "multipeer"] as const
      },
      trustedContacts: trustedContactIds.map((contactId) => ({
        contactId,
        status: "authorized_for_alert" as const
      })),
      remoteSharing: this.buildRemoteSharingPlan()
    };
  }

  normalizeDeliveryPlan(packageDeliveryPlan: EmergencyDeliveryPlan | Omit<EmergencyDeliveryPlan, "remoteSharing">): EmergencyDeliveryPlan {
    const trustedContactIds = packageDeliveryPlan.trustedContacts.map((contact) => contact.contactId);
    return {
      ...this.buildDeliveryPlan({ trustedContactIds }),
      api: packageDeliveryPlan.api,
      p2p: packageDeliveryPlan.p2p,
      trustedContacts: packageDeliveryPlan.trustedContacts.map((contact) => ({
        contactId: contact.contactId,
        status: contact.status === "authorized_for_alert" ? "authorized_for_alert" : "local_reference_pending_contract"
      })),
      remoteSharing: "remoteSharing" in packageDeliveryPlan ? packageDeliveryPlan.remoteSharing : this.buildRemoteSharingPlan()
    };
  }
}

export const emergencyRemoteSharingPlanner = new EmergencyRemoteSharingPlanner();
