export type PermissionGateStatus = "pendente" | "permitido" | "negado" | "bloqueado";

export type PermissionGatePresentation = {
  statusLabel: string;
};

export const permissionGateStatusLabels: Record<PermissionGateStatus, string> = {
  pendente: "pendente",
  permitido: "permitido",
  negado: "negado",
  bloqueado: "bloqueado"
};

export function buildPermissionGatePresentation(status: PermissionGateStatus): PermissionGatePresentation {
  return {
    statusLabel: permissionGateStatusLabels[status]
  };
}
