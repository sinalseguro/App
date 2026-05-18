import {
  ProtectionProfileSchema,
  UpdateProtectionProfileInput
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";

export class ProfilesApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async getProtectionProfile() {
    return this.core.request("/profiles/me", ProtectionProfileSchema, {
      authenticated: true
    });
  }

  async updateProtectionProfile(input: UpdateProtectionProfileInput) {
    return this.core.request("/profiles/me", ProtectionProfileSchema, {
      authenticated: true,
      body: {
        kind: input.kind
      },
      method: "PATCH"
    });
  }
}
