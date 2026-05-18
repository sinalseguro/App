export type MediaStopSignalDecision =
  | {
      shouldSignal: false;
    }
  | {
      logEvent: "emergency_media_stop_signal";
      logPayload: {
        platform: string;
        stopRequestSerial: number;
      };
      serial: number;
      shouldSignal: true;
    };

export function resolveMediaStopSignal(input: {
  currentSerial: number;
  isWebPlatform: boolean;
  platform: string;
  requestLocalVideoOnSos: boolean;
}): MediaStopSignalDecision {
  if (!input.requestLocalVideoOnSos || input.isWebPlatform) {
    return { shouldSignal: false };
  }

  const serial = input.currentSerial + 1;
  return {
    logEvent: "emergency_media_stop_signal",
    logPayload: {
      platform: input.platform,
      stopRequestSerial: serial
    },
    serial,
    shouldSignal: true
  };
}
