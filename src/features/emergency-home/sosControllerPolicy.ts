import type { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";

import {
  resolveEmergencyStartRuntimeActions,
  type EmergencyStartRuntimeActionsDecision
} from "./emergencyStartRuntimePolicy";
import {
  resolveFinishActiveCallRuntimeStartActions
} from "./finishActiveCallRuntimeStartPolicy";
import {
  resolveFinishActiveCallRuntimeStateActions,
  type FinishActiveCallRuntimeStateActions
} from "./finishActiveCallRuntimeStateActionsPolicy";
import {
  resolveFinishActiveCallStart,
  type FinishActiveCallStartDecision,
  type FinishActiveCallStartInput
} from "./finishActiveCallStartPolicy";
import {
  type FinishFlowMediaStopStatus,
  resolveMediaProtectionInProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";
import {
  resolveFinishMediaStopRequestActions,
  resolveFinishMediaStopSignaledActions,
  type FinishMediaStopRequestActions,
  type FinishMediaStopSignaledActions
} from "./finishMediaStopRequestActionsPolicy";
import {
  resolveFinishMediaStopResultActions,
  type FinishMediaStopResultActionsDecision
} from "./finishMediaStopResultPolicy";
import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";
import { resolvePanicTriggerDecision } from "./panicTriggerPolicy";

export type SosControllerTriggerInput = {
  activePackageId: string | null;
  currentFinishProgress: number;
  mediaStopPending: boolean;
  platform: string;
  preferences: EmergencyPreferences;
  startInProgress: boolean;
};

export type SosControllerTriggerDecision =
  | {
      action: "finish_active_call";
    }
  | {
      action: "ignore_start_in_progress";
    }
  | {
      action: "request_recording_consent";
    }
  | {
      action: "show_media_protection_progress";
      finishProgress: FinishFlowProgress;
      recordingStatus: string;
    }
  | {
      action: "start_emergency_package";
      startRuntimeActions: EmergencyStartRuntimeActionsDecision;
    };

export type SosControllerFinishStartInput = FinishActiveCallStartInput & {
  platform: string;
};

export type SosControllerFinishStartDecision =
  | {
      shouldStart: false;
      startDecision: FinishActiveCallStartDecision;
    }
  | {
      mediaWasHandedToLiveCall: boolean;
      packageId: string;
      remoteSessionIdToFinish: string | null;
      runtimeStateActions: FinishActiveCallRuntimeStateActions;
      shouldStart: true;
      startDecision: FinishActiveCallStartDecision;
    };

export type SosControllerFinishMediaStopRequestDecision = {
  mediaStopPurpose: "finish";
  requestActions: FinishMediaStopRequestActions;
};

export function resolveSosControllerTrigger(input: SosControllerTriggerInput): SosControllerTriggerDecision {
  const panicDecision = resolvePanicTriggerDecision({
    activePackageId: input.activePackageId,
    mediaStopPending: input.mediaStopPending,
    preferences: input.preferences,
    startInProgress: input.startInProgress
  });

  switch (panicDecision) {
    case "ignore_start_in_progress":
      return { action: "ignore_start_in_progress" };
    case "show_media_protection_progress":
      return {
        action: "show_media_protection_progress",
        finishProgress: resolveMediaProtectionInProgress(input.currentFinishProgress),
        recordingStatus: resolveLocalSosPackageStatus({ event: "media_protection_in_progress" })
      };
    case "finish_active_call":
      return { action: "finish_active_call" };
    case "request_recording_consent":
      return { action: "request_recording_consent" };
    case "start_emergency_package":
      return {
        action: "start_emergency_package",
        startRuntimeActions: resolveEmergencyStartRuntimeActions({
          platform: input.platform,
          preferences: input.preferences
        })
      };
  }
}

export function resolveSosControllerFinishStart(input: SosControllerFinishStartInput): SosControllerFinishStartDecision {
  const startDecision = resolveFinishActiveCallStart(input);
  if (!startDecision.shouldStart) {
    return {
      shouldStart: false,
      startDecision
    };
  }

  const runtimeStartActions = resolveFinishActiveCallRuntimeStartActions({
    platform: input.platform,
    remoteSessionIdToFinish: startDecision.remoteSessionIdToFinish
  });
  const runtimeStateActions = resolveFinishActiveCallRuntimeStateActions({
    remoteSessionIdToFinish: startDecision.remoteSessionIdToFinish,
    runtimeStartActions
  });

  return {
    mediaWasHandedToLiveCall: startDecision.mediaWasHandedToLiveCall,
    packageId: startDecision.packageId,
    remoteSessionIdToFinish: startDecision.remoteSessionIdToFinish,
    runtimeStateActions,
    shouldStart: true,
    startDecision
  };
}

export function resolveSosControllerFinishMediaStopRequest(input: {
  mediaWasHandedToLiveCall: boolean;
}): SosControllerFinishMediaStopRequestDecision {
  return {
    mediaStopPurpose: "finish",
    requestActions: resolveFinishMediaStopRequestActions({
      mediaWasHandedToLiveCall: input.mediaWasHandedToLiveCall
    })
  };
}

export function resolveSosControllerFinishMediaStopSignaled(input: {
  packageId: string;
  stopSerial: number | null;
}): FinishMediaStopSignaledActions {
  return resolveFinishMediaStopSignaledActions(input);
}

export function resolveSosControllerFinishMediaStopResult(input: {
  attachedAssets: number;
  platform: string;
  status: FinishFlowMediaStopStatus;
}): FinishMediaStopResultActionsDecision {
  return resolveFinishMediaStopResultActions(input);
}
