import type { MediaCaptureFailureReason } from "@/features/emergency/types";

import type { FinishOutcomeDiagnosticReason } from "./finishOutcomePolicy";

export type FinishNoMediaDiagnosticDecision =
  | {
      shouldPersist: false;
    }
  | {
      packageId: string;
      reason: MediaCaptureFailureReason;
      shouldPersist: true;
    };

const finishNoMediaDiagnosticReasons: Record<FinishOutcomeDiagnosticReason, MediaCaptureFailureReason> = {
  camera_no_file_returned: "camera_no_file_returned"
};

export function resolveFinishNoMediaDiagnosticRequest(input: {
  diagnosticReason?: FinishOutcomeDiagnosticReason;
  packageId: string;
}): FinishNoMediaDiagnosticDecision {
  if (!input.diagnosticReason) {
    return {
      shouldPersist: false
    };
  }

  return {
    packageId: input.packageId,
    reason: finishNoMediaDiagnosticReasons[input.diagnosticReason],
    shouldPersist: true
  };
}
