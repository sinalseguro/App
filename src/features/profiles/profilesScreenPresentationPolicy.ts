import type { ProtectionProfileKind } from "@/features/profiles/profilePolicy";

export type ProfilesScreenTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type ProfilesScreenIconPresentation = {
  colorToken: "primary" | "secure" | "textOnDark";
  size: number;
};

export type ProfilesContinueButtonPresentation = {
  accessibilityRole: "button";
  icon: ProfilesScreenIconPresentation;
  label: string;
  textFit: ProfilesScreenTextFit;
};

export type ProfilesOptionCardPresentation = {
  accessibilityRole: "button";
  descriptionTextFit: ProfilesScreenTextFit;
  icon: ProfilesScreenIconPresentation;
  titleTextFit: ProfilesScreenTextFit;
};

export const profilesScreenCopy = {
  footer: "Esta etapa não coleta documento, data de nascimento completa, endereço, agenda ou relato sensível.",
  loadingStatus: "Carregando perfil local...",
  missingStatus: "Perfil ainda não configurado.",
  savedStatus: "Perfil salvo neste aparelho.",
  subtitle: "Defina quem usa este aparelho antes de preparar rede de apoio.",
  title: "Perfis e papéis",
  loadedStatus: "Perfil local carregado."
} as const;

export const profilesLimitNotice = {
  text: "Menor não cria anjo nem atua como anjo. Videochamada, localização ao vivo, envio externo e instituições conveniadas ainda não estão disponíveis.",
  title: "Limites de proteção",
  tone: "warning" as const
};

export const profilesOptionTitleTextFit: ProfilesScreenTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
};

export const profilesOptionDescriptionTextFit: ProfilesScreenTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 3
};

export const profilesContinueTextFit: ProfilesScreenTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 1
};

export const profilesStatusTextFit: ProfilesScreenTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 2
};

export function resolveProfileOptionIconPresentation(selected: boolean): ProfilesScreenIconPresentation {
  return {
    colorToken: selected ? "secure" : "primary",
    size: 22
  };
}

export function resolveProfileOptionCardPresentation(selected: boolean): ProfilesOptionCardPresentation {
  return {
    accessibilityRole: "button",
    descriptionTextFit: profilesOptionDescriptionTextFit,
    icon: resolveProfileOptionIconPresentation(selected),
    titleTextFit: profilesOptionTitleTextFit
  };
}

export function resolveProfilesContinueButtonPresentation(): ProfilesContinueButtonPresentation {
  return {
    accessibilityRole: "button",
    icon: {
      colorToken: "textOnDark",
      size: 20
    },
    label: "Voltar para anjos",
    textFit: profilesContinueTextFit
  };
}

export function resolveProfileStatusAfterLoad(profileKind?: ProtectionProfileKind) {
  return profileKind ? profilesScreenCopy.loadedStatus : profilesScreenCopy.missingStatus;
}
