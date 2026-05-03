export const evidenceAccessPolicy = {
  contractVersion: "streaming-homologacao-2026-05-02",
  status: "blocked_public_build",
  allowedPurpose: "Uso exclusivo em processo judicial, procedimento protetivo ou atendimento autorizado pela titular.",
  receiverCommitment:
    "Quem recebe deve preservar sigilo, nao compartilhar com terceiros e usar os dados somente dentro do SinalSeguro ou por exportacao auditada.",
  encryptionModel:
    "Midia e localizacao devem usar criptografia por envelope: chave de midia por alerta, protegida no backend e liberada apenas a usuarios autorizados.",
  requiredBeforeRelease: [
    "contrato eletronico bilateral",
    "RIPD/DPIA",
    "RBAC/MFA",
    "auditoria de acesso",
    "retencao e revogacao",
    "homologacao com dados ficticios ou participantes consentidos"
  ]
} as const;
