import {
  AcceptInvitationInput,
  CreateInvitationInput,
  CreateTrustedContactInput,
  InvitationListSchema,
  InvitationPublicStatusSchema,
  InvitationSchema,
  TrustedContactListSchema,
  TrustedContactRelationshipListSchema,
  TrustedContactRelationshipSchema,
  TrustedContactSchema
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";

export class ContactsApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async createTrustedContact(input: CreateTrustedContactInput) {
    return this.core.request("/trusted-contacts/", TrustedContactSchema, {
      authenticated: true,
      body: {
        can_receive_alerts: input.canReceiveAlerts ?? true,
        can_receive_location: input.canReceiveLocation ?? false,
        can_receive_media: input.canReceiveMedia ?? false,
        display_label: input.displayLabel,
        protected_subject: input.protectedSubjectId ?? null
      },
      method: "POST"
    });
  }

  async listTrustedContacts() {
    return this.core.request("/trusted-contacts/", TrustedContactListSchema, {
      authenticated: true
    });
  }

  async listTrustedContactRelationships() {
    return this.core.request("/trusted-contacts/relationships", TrustedContactRelationshipListSchema, {
      authenticated: true
    });
  }

  async revokeTrustedContact(trustedContactId: string) {
    return this.core.request(`/trusted-contacts/${trustedContactId}/revoke/`, TrustedContactSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async createInvitation(input: CreateInvitationInput) {
    return this.core.request("/invitations/", InvitationSchema, {
      authenticated: true,
      body: {
        display_label: input.displayLabel,
        trusted_contact: input.trustedContactId
      },
      method: "POST"
    });
  }

  async listInvitations() {
    return this.core.request("/invitations/", InvitationListSchema, {
      authenticated: true
    });
  }

  async revokeInvitation(invitationId: string) {
    return this.core.request(`/invitations/${invitationId}/revoke/`, InvitationSchema, {
      authenticated: true,
      method: "POST"
    });
  }

  async getInvitationStatus(token: string) {
    return this.core.request("/invitations/status", InvitationPublicStatusSchema, {
      authenticated: false,
      body: { token },
      method: "POST"
    });
  }

  async acceptInvitation(input: AcceptInvitationInput) {
    return this.core.request("/invitations/accept", TrustedContactRelationshipSchema, {
      authenticated: true,
      body: {
        display_label: input.displayLabel,
        token: input.token
      },
      method: "POST"
    });
  }
}
