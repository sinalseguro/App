import assert from "node:assert/strict";

import {
  resolveMediaStopSettlementLog,
  resolvePendingMediaStopRequestSettlement
} from "../src/features/emergency-home/mediaStopSettlementRequestPolicy";

assert.deepEqual(
  resolveMediaStopSettlementLog({
    platform: "android",
    result: {
      attachedAssets: 2,
      status: "attached"
    }
  }),
  {
    logEvent: "emergency_media_stop_settled",
    logPayload: {
      attachedAssets: 2,
      platform: "android",
      status: "attached"
    }
  }
);

assert.deepEqual(resolvePendingMediaStopRequestSettlement({ pendingSerial: 4, serial: 4 }), {
  shouldResolvePendingRequest: true
});

assert.deepEqual(resolvePendingMediaStopRequestSettlement({ pendingSerial: 3, serial: 4 }), {
  shouldResolvePendingRequest: false
});

assert.deepEqual(resolvePendingMediaStopRequestSettlement({ pendingSerial: null, serial: 4 }), {
  shouldResolvePendingRequest: false
});

console.log("media-stop-settlement-request-policy ok");
