import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { ApiEmergencySession } from "@/services/apiClient";

export const emergencyAlertChannelId = "sinalseguro-emergency-alerts";
let channelPromise: Promise<void> | null = null;

export type IncomingEmergencyNotificationContent = {
  body: string;
  data: {
    remoteSessionId: string;
    route: "/alerta";
    source: "sinalseguro.incoming-emergency";
  };
  color: string;
  priority: Notifications.AndroidNotificationPriority.MAX;
  sound: "default";
  title: string;
  vibrate: number[];
};

function protectedPersonLabel(session: Pick<ApiEmergencySession, "owner_display_name">) {
  return session.owner_display_name?.trim() || "Pessoa protegida";
}

export async function ensureEmergencyAlertChannel() {
  if (Platform.OS !== "android") return;
  if (!channelPromise) {
    channelPromise = Notifications.setNotificationChannelAsync(emergencyAlertChannelId, {
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.NOTIFICATION_COMMUNICATION_REQUEST
      },
      description: "Avisos de SOS recebidos quando voce atua como anjo.",
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#A02D6D",
      name: "Chamados de emergência",
      sound: "default",
      vibrationPattern: [0, 250, 180, 250]
    }).then(() => undefined);
  }
  await channelPromise;
}

export function buildIncomingEmergencyNotificationContent(
  session: Pick<ApiEmergencySession, "id" | "owner_display_name">
): IncomingEmergencyNotificationContent {
  const ownerLabel = protectedPersonLabel(session);
  return {
    body: `${ownerLabel} acionou o SOS. O registro do chamado foi iniciado e o acompanhamento ao vivo esta sendo preparado.`,
    color: "#A02D6D",
    data: {
      remoteSessionId: session.id,
      route: "/alerta",
      source: "sinalseguro.incoming-emergency"
    },
    priority: Notifications.AndroidNotificationPriority.MAX,
    sound: "default",
    title: "SOS recebido",
    vibrate: [0, 250, 180, 250, 180, 350]
  };
}

export async function notifyIncomingEmergency(session: ApiEmergencySession) {
  const permission = await Notifications.getPermissionsAsync();
  const allowed = permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!allowed) {
    return { status: "permission_denied" as const };
  }

  await ensureEmergencyAlertChannel();
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: buildIncomingEmergencyNotificationContent(session),
    trigger: Platform.OS === "android" ? { channelId: emergencyAlertChannelId } : null
  });

  return { notificationId, status: "scheduled" as const };
}
