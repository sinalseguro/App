export type AlertKind = "test" | "real";

export type AlertStatus = "local_draft" | "blocked_until_secure_outbox" | "cancelled" | "failed";

export type LocalAlert = {
  id: string;
  kind: AlertKind;
  status: AlertStatus;
  createdAt: string;
  idempotencyKey: string;
  locationStatus?: "not_requested" | "authorized_local_only" | "denied" | "unavailable";
};
