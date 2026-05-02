import { LocalAlert } from "@/features/alerts/types";

const memoryOutbox = new Map<string, LocalAlert>();

export async function savePendingAlert(alert: LocalAlert) {
  // Implementacao temporaria para o app shell. A fase 5 troca por armazenamento criptografado.
  memoryOutbox.set(alert.id, alert);
}

export async function listPendingAlerts() {
  return Array.from(memoryOutbox.values());
}

export async function removePendingAlert(alertId: string) {
  memoryOutbox.delete(alertId);
}
