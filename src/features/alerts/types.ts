export type AlertKind = "test" | "real";

export type AlertStatus = "draft" | "queued" | "sent" | "acknowledged" | "cancelled" | "failed";

export type LocalAlert = {
  id: string;
  kind: AlertKind;
  status: AlertStatus;
  createdAt: string;
  idempotencyKey: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
  };
};
