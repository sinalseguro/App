import * as Crypto from "expo-crypto";
import { LocalAlert } from "./types";

export async function createLocalAlert(kind: LocalAlert["kind"]): Promise<LocalAlert> {
  const id = Crypto.randomUUID();

  return {
    id,
    kind,
    status: "draft",
    createdAt: new Date().toISOString(),
    idempotencyKey: Crypto.randomUUID()
  };
}

export async function enqueueAlert(alert: LocalAlert): Promise<LocalAlert> {
  // Checkpoint inicial: a persistencia criptografada real entra na fase de outbox.
  return {
    ...alert,
    status: "queued"
  };
}
