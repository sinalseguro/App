import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { ApiEmergencySession } from "@/services/apiClient";

const emergencyAlertChannelId = "sinalseguro-emergency-alerts";
let channelPromise: Promise<void> | null = null;

export type IncomingEmergencyNotificationContent = {
  body: string;
  data: {
    remoteSessionId: string;
    route: "/alerta";
    source: "sinalseguro.incoming-emergency";
  };
  sound: "default";
  title: string;
};

function protectedPersonLabel(session: Pick<ApiEmergencySession, "owner_display_name">) {
  return session.owner_display_name?.trim() || "Pessoa protegida";
}

async function ensureEmergencyAlertChannel() {
  if (Platform.OS !== "android") return;
  if (!channelPromise) {
    channelPromise = Notifications.setNotificationChannelAsync(emergencyAlertChannelId, {
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
    data: {
      remoteSessionId: session.id,
      route: "/alerta",
      source: "sinalseguro.incoming-emergency"
    },
    sound: "default",
    title: "SOS recebido"
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
    trigger: null
  });

  return { notificationId, status: "scheduled" as const };
}
