export const profilePolicyVersion = "frente-1.3-mvp-2026-05-13";

export type ProtectionProfileKind =
  | "adult_self_managed"
  | "minor_protected"
  | "responsible_without_minor"
  | "responsible_with_minor";

export type MajorityStatus = "adult" | "minor" | "unknown";

export type ProtectionProfile = {
  id: "active";
  schemaVersion: "sinalseguro.protection-profile.v1";
  kind: ProtectionProfileKind;
  majorityStatus: MajorityStatus;
  configuredAt: string;
  updatedAt: string;
  policyVersion: typeof profilePolicyVersion;
};

export type ProfileGateDecisionCode =
  | "profile_missing"
  | "adult_self_managed_allowed"
  | "minor_cannot_invite"
  | "minor_cannot_act_as_angel"
  | "responsible_minor_missing"
  | "responsible_minor_allowed";

export type ProfileGateDecision = {
  allowed: boolean;
  code: ProfileGateDecisionCode;
  message: string;
  title: string;
  tone: "secure" | "warning" | "danger";
};

export type TrustedContactDeliveryPolicyInput = {
  authorizationStatus: "authorized" | "pending" | "revoked";
  contactStatus: "accepted" | "invited" | "pending" | "revoked";
};

export const profileOptions: Array<{
  kind: ProtectionProfileKind;
  label: string;
  description: string;
}> = [
  {
    kind: "adult_self_managed",
    label: "Sou adulto usando para mim",
    description: "Permite preparar convites da própria rede de apoio."
  },
  {
    kind: "responsible_with_minor",
    label: "Sou responsável por menor",
    description: "Prepara a vinculação do protegido sem coletar documentos ou dados sensíveis."
  },
  {
    kind: "minor_protected",
    label: "Sou menor protegido",
    description: "Mantém SOS local, mas bloqueia convite e atuação como anjo."
  },
  {
    kind: "responsible_without_minor",
    label: "Responsável sem menor vinculado",
    description: "Estado conservador até existir protegido menor nesta configuração."
  }
];

function profileKindMajorityStatus(kind: ProtectionProfileKind): MajorityStatus {
  if (kind === "minor_protected") return "minor";
  if (kind === "responsible_without_minor" || kind === "responsible_with_minor" || kind === "adult_self_managed") {
    return "adult";
  }
  return "unknown";
}

export function buildProtectionProfile(kind: ProtectionProfileKind, now = new Date()): ProtectionProfile {
  const timestamp = now.toISOString();
  return {
    id: "active",
    schemaVersion: "sinalseguro.protection-profile.v1",
    kind,
    majorityStatus: profileKindMajorityStatus(kind),
    configuredAt: timestamp,
    updatedAt: timestamp,
    policyVersion: profilePolicyVersion
  };
}

export function isProtectionProfile(value: unknown): value is ProtectionProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Partial<ProtectionProfile>;
  return (
    profile.id === "active" &&
    profile.schemaVersion === "sinalseguro.protection-profile.v1" &&
    profile.policyVersion === profilePolicyVersion &&
    typeof profile.configuredAt === "string" &&
    typeof profile.updatedAt === "string" &&
    profileOptions.some((option) => option.kind === profile.kind) &&
    (profile.majorityStatus === "adult" || profile.majorityStatus === "minor" || profile.majorityStatus === "unknown")
  );
}

export function getProfileLabel(profile: ProtectionProfile | null) {
  if (!profile) return "Perfil não definido";
  return profileOptions.find((option) => option.kind === profile.kind)?.label ?? "Perfil em revisão";
}

export function getProfileSummary(profile: ProtectionProfile | null) {
  if (!profile) {
    return {
      text: "Configure quem usa este aparelho antes de criar rede de apoio.",
      title: "Perfil não definido",
      tone: "warning" as const
    };
  }

  if (profile.kind === "adult_self_managed") {
    return {
      text: "Adulto protegido pode preparar a propria rede de apoio.",
      title: "Adulto protegido",
      tone: "secure" as const
    };
  }

  if (profile.kind === "minor_protected") {
    return {
      text: "Menor protegido usa o SOS local, mas nao cria convites nem atua como anjo.",
      title: "Menor protegido",
      tone: "warning" as const
    };
  }

  if (profile.kind === "responsible_with_minor") {
    return {
      text: "Responsavel pode autorizar contatos para o menor, com escopos e revogacao.",
      title: "Responsável por menor",
      tone: "warning" as const
    };
  }

  return {
    text: "Adicione o protegido menor antes de autorizar contatos.",
    title: "Responsável sem menor",
    tone: "warning" as const
  };
}

export function canCreateTrustedContactInvitation(profile: ProtectionProfile | null): ProfileGateDecision {
  if (!profile) {
    return {
      allowed: false,
      code: "profile_missing",
      title: "Configure o perfil",
      message: "Defina se este aparelho e usado por adulto, menor protegido ou responsavel antes de criar convite.",
      tone: "warning"
    };
  }

  if (profile.kind === "adult_self_managed") {
    return {
      allowed: true,
      code: "adult_self_managed_allowed",
      title: "Convite permitido",
      message: "Adulto protegido pode preparar a propria rede de apoio.",
      tone: "secure"
    };
  }

  if (profile.kind === "responsible_with_minor") {
    return {
      allowed: false,
      code: "responsible_minor_missing",
      title: "Autorização pendente",
      message: "Responsavel precisa de protegido, vinculo e autorizacao ativos na API antes de criar convite.",
      tone: "warning"
    };
  }

  if (profile.kind === "minor_protected") {
    return {
      allowed: false,
      code: "minor_cannot_invite",
      title: "Convite bloqueado",
      message: "Menor protegido nao cria anjos. A rede de apoio precisa ser autorizada por responsavel.",
      tone: "danger"
    };
  }

  return {
    allowed: false,
    code: "responsible_minor_missing",
    title: "Protegido pendente",
    message: "Responsavel precisa vincular o protegido menor antes de autorizar contatos.",
    tone: "warning"
  };
}

export function canAcceptAngelInvitation(profile: ProtectionProfile | null): ProfileGateDecision {
  if (!profile) {
    return {
      allowed: false,
      code: "profile_missing",
      title: "Configure o perfil",
      message: "Antes de aceitar convite, defina que este aparelho pertence a um adulto autorizado.",
      tone: "warning"
    };
  }

  if (profile.kind === "minor_protected") {
    return {
      allowed: false,
      code: "minor_cannot_act_as_angel",
      title: "Aceite bloqueado",
      message: "Menor protegido nao pode atuar como anjo nesta etapa.",
      tone: "danger"
    };
  }

  if (profile.kind === "responsible_without_minor") {
    return {
      allowed: true,
      code: "adult_self_managed_allowed",
      title: "Aceite permitido",
      message: "Adulto responsavel pode aceitar convite com a propria conta e dispositivo.",
      tone: "secure"
    };
  }

  return {
    allowed: true,
    code: profile.kind === "responsible_with_minor" ? "responsible_minor_allowed" : "adult_self_managed_allowed",
    title: "Aceite permitido",
    message: "Adulto pode aceitar convite com conta propria, dispositivo ativo e chave publica.",
    tone: "secure"
  };
}

export function canReceiveFutureEmergencyDelivery(input: TrustedContactDeliveryPolicyInput) {
  return input.contactStatus === "accepted" && input.authorizationStatus === "authorized";
}
