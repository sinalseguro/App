import {
  ApiAppReleaseSchema,
  GetCurrentAppReleaseInput
} from "@/services/api/contracts";
import { SinalSeguroApiCore } from "@/services/api/core";
import { currentPlatform } from "@/services/api/utils";

export class ReleasesApiClient {
  constructor(private readonly core: SinalSeguroApiCore) {}

  async getCurrentAppRelease(input: GetCurrentAppReleaseInput = {}) {
    const query = new URLSearchParams();
    query.set("platform", input.platform ?? (currentPlatform() === "ios" ? "ios" : "android"));
    if (input.version) query.set("version", input.version);
    if (typeof input.versionCode === "number") query.set("version_code", String(input.versionCode));

    return this.core.request(`/app-releases/current?${query.toString()}`, ApiAppReleaseSchema, {
      authenticated: false
    });
  }
}
