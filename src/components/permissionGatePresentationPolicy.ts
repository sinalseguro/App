export type PermissionGateStatus = "pendente" | "permitido" | "negado" | "bloqueado";

export type PermissionGateTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type PermissionGatePresentation = {
  statusLabel: string;
  statusTextFit: PermissionGateTextFit;
  textTextFit: PermissionGateTextFit;
  titleTextFit: PermissionGateTextFit;
};

export const permissionGateStatusLabels: Record<PermissionGateStatus, string> = {
  pendente: "pendente",
  permitido: "permitido",
  negado: "negado",
  bloqueado: "bloqueado"
};

export const permissionGateStatusTextFit: PermissionGateTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 1
};

export const permissionGateTitleTextFit: PermissionGateTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
};

export const permissionGateBodyTextFit: PermissionGateTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.86,
  numberOfLines: 4
};

export function buildPermissionGatePresentation(status: PermissionGateStatus): PermissionGatePresentation {
  return {
    statusLabel: permissionGateStatusLabels[status],
    statusTextFit: permissionGateStatusTextFit,
    textTextFit: permissionGateBodyTextFit,
    titleTextFit: permissionGateTitleTextFit
  };
}
