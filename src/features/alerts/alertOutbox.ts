import * as Crypto from "expo-crypto";
import { LocalAlert } from "./types";

export async function createLocalAlert(kind: LocalAlert["kind"]): Promise<LocalAlert> {
  const id = Crypto.randomUUID();

  return {
    id,
    kind,
    status: "local_draft",
    createdAt: new Date().toISOString(),
    idempotencyKey: Crypto.randomUUID()
  };
}

export async function enqueueAlert(alert: LocalAlert): Promise<LocalAlert> {
  // Checkpoint inicial: envio externo fica bloqueado ate existir outbox criptografada auditada.
  return {
    ...alert,
    status: "blocked_until_secure_outbox"
  };
}
