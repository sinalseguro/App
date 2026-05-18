import { HealthSchema } from "@/services/api/contracts";
import { AuthApiClient } from "@/services/api/authClient";
import { ContactsApiClient } from "@/services/api/contactsClient";
import { DevicesApiClient } from "@/services/api/devicesClient";
import { EmergencyApiClient } from "@/services/api/emergencyClient";
import { ProfilesApiClient } from "@/services/api/profilesClient";
import { ReleasesApiClient } from "@/services/api/releasesClient";
import { secureSessionStore } from "@/services/api/sessionStore";
import {
  ApiRequestError,
  SinalSeguroApiCore,
  apiBaseUrl,
  apiConfig,
  apiEnabled
} from "@/services/api/core";

export type {
  AcceptInvitationInput,
  ApiAppRelease,
  ApiConsentRecord,
  ApiConsentScope,
  ApiDevice,
  ApiEmergencyRecipient,
  ApiEmergencySession,
  ApiInvitation,
  ApiInvitationPublicStatus,
  ApiKeyEnvelope,
  ApiLiveAuditMarker,
  ApiLiveRecipient,
  ApiLiveRecipientDevice,
  ApiLiveRecipientList,
  ApiP2PSignal,
  ApiProtectionProfile,
  ApiSession,
  ApiTrustedContact,
  ApiTrustedContactRelationship,
  ApiUser,
  CreateConsentRecordInput,
  CreateEmergencySessionInput,
  CreateInvitationInput,
  CreateKeyEnvelopeInput,
  CreateTrustedContactInput,
  EmergencySessionResponseAction,
  GetCurrentAppReleaseInput,
  LiveAuditMarkerEvent,
  LoginDeviceContext,
  LogoutDeviceContext,
  RecordLiveAuditMarkerInput,
  RegisterDeviceInput,
  RotateDeviceKeyInput,
  SendP2PSignalInput,
  UpdateProtectionProfileInput
} from "@/services/api/contracts";

export { ApiRequestError, apiConfig };

export class SinalSeguroApiClient {
  private readonly auth: AuthApiClient;
  private readonly contacts: ContactsApiClient;
  private readonly devices: DevicesApiClient;
  private readonly emergency: EmergencyApiClient;
  private readonly profiles: ProfilesApiClient;
  private readonly releases: ReleasesApiClient;
  private readonly core: SinalSeguroApiCore;

  constructor(baseUrl = apiBaseUrl, enabled = apiEnabled) {
    this.core = new SinalSeguroApiCore(baseUrl, enabled, secureSessionStore);
    this.auth = new AuthApiClient(this.core);
    this.contacts = new ContactsApiClient(this.core);
    this.devices = new DevicesApiClient(this.core);
    this.emergency = new EmergencyApiClient(this.core);
    this.profiles = new ProfilesApiClient(this.core);
    this.releases = new ReleasesApiClient(this.core);
  }

  get isEnabled() {
    return this.core.isEnabled;
  }

  async getStoredSession() {
    return this.auth.getStoredSession();
  }

  async clearSession() {
    return this.auth.clearSession();
  }

  async getHealth() {
    return this.core.request("/health", HealthSchema, { authenticated: false });
  }

  loginWithEmail: AuthApiClient["loginWithEmail"] = (...args) => this.auth.loginWithEmail(...args);

  loginWithGoogleIdToken: AuthApiClient["loginWithGoogleIdToken"] = (...args) =>
    this.auth.loginWithGoogleIdToken(...args);

  loginWithAppleIdentityToken: AuthApiClient["loginWithAppleIdentityToken"] = (...args) =>
    this.auth.loginWithAppleIdentityToken(...args);

  logout: AuthApiClient["logout"] = (...args) => this.auth.logout(...args);

  getMe: AuthApiClient["getMe"] = () => this.auth.getMe();

  registerDevice: DevicesApiClient["registerDevice"] = (...args) => this.devices.registerDevice(...args);

  rotateDeviceKey: DevicesApiClient["rotateDeviceKey"] = (...args) => this.devices.rotateDeviceKey(...args);

  revokeDevice: DevicesApiClient["revokeDevice"] = (...args) => this.devices.revokeDevice(...args);

  markDeviceLost: DevicesApiClient["markDeviceLost"] = (...args) => this.devices.markDeviceLost(...args);

  createConsentRecord: DevicesApiClient["createConsentRecord"] = (...args) =>
    this.devices.createConsentRecord(...args);

  getProtectionProfile: ProfilesApiClient["getProtectionProfile"] = () =>
    this.profiles.getProtectionProfile();

  updateProtectionProfile: ProfilesApiClient["updateProtectionProfile"] = (...args) =>
    this.profiles.updateProtectionProfile(...args);

  createTrustedContact: ContactsApiClient["createTrustedContact"] = (...args) =>
    this.contacts.createTrustedContact(...args);

  listTrustedContacts: ContactsApiClient["listTrustedContacts"] = () => this.contacts.listTrustedContacts();

  listTrustedContactRelationships: ContactsApiClient["listTrustedContactRelationships"] = () =>
    this.contacts.listTrustedContactRelationships();

  revokeTrustedContact: ContactsApiClient["revokeTrustedContact"] = (...args) =>
    this.contacts.revokeTrustedContact(...args);

  createInvitation: ContactsApiClient["createInvitation"] = (...args) => this.contacts.createInvitation(...args);

  listInvitations: ContactsApiClient["listInvitations"] = () => this.contacts.listInvitations();

  revokeInvitation: ContactsApiClient["revokeInvitation"] = (...args) =>
    this.contacts.revokeInvitation(...args);

  getInvitationStatus: ContactsApiClient["getInvitationStatus"] = (...args) =>
    this.contacts.getInvitationStatus(...args);

  acceptInvitation: ContactsApiClient["acceptInvitation"] = (...args) => this.contacts.acceptInvitation(...args);

  createEmergencySession: EmergencyApiClient["createEmergencySession"] = (...args) =>
    this.emergency.createEmergencySession(...args);

  listReceivedEmergencySessions: EmergencyApiClient["listReceivedEmergencySessions"] = () =>
    this.emergency.listReceivedEmergencySessions();

  respondToEmergencySession: EmergencyApiClient["respondToEmergencySession"] = (...args) =>
    this.emergency.respondToEmergencySession(...args);

  listLiveRecipients: EmergencyApiClient["listLiveRecipients"] = (...args) =>
    this.emergency.listLiveRecipients(...args);

  finishEmergencySession: EmergencyApiClient["finishEmergencySession"] = (...args) =>
    this.emergency.finishEmergencySession(...args);

  recordLiveAuditMarker: EmergencyApiClient["recordLiveAuditMarker"] = (...args) =>
    this.emergency.recordLiveAuditMarker(...args);

  createKeyEnvelope: EmergencyApiClient["createKeyEnvelope"] = (...args) =>
    this.emergency.createKeyEnvelope(...args);

  sendP2PSignal: EmergencyApiClient["sendP2PSignal"] = (...args) => this.emergency.sendP2PSignal(...args);

  listP2PSignals: EmergencyApiClient["listP2PSignals"] = () => this.emergency.listP2PSignals();

  consumeP2PSignal: EmergencyApiClient["consumeP2PSignal"] = (...args) =>
    this.emergency.consumeP2PSignal(...args);

  getCurrentAppRelease: ReleasesApiClient["getCurrentAppRelease"] = (...args) =>
    this.releases.getCurrentAppRelease(...args);
}

export const apiClient = new SinalSeguroApiClient();

export async function getHealth() {
  return apiClient.getHealth();
}
