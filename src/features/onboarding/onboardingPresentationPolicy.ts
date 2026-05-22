export type OnboardingStepStatus = "obrigatorio" | "opcional";

export type OnboardingStep = {
  id: "limites" | "privacidade" | "localizacao" | "midia";
  status: OnboardingStepStatus;
  text: string;
  title: string;
};

export const onboardingScreenCopy = {
  title: "Boas-vindas",
  subtitle: "Antes de usar, revise os limites e consentimentos do SinalSeguro."
} as const;

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: "limites",
    title: "Limites do servico",
    text: "O SinalSeguro apoia sua rede de confianca, mas nao substitui canais oficiais de emergencia.",
    status: "obrigatorio"
  },
  {
    id: "privacidade",
    title: "Privacidade",
    text: "Dados sensiveis nao devem ser enviados sem consentimento, finalidade e retencao definida.",
    status: "obrigatorio"
  },
  {
    id: "localizacao",
    title: "Localizacao pontual",
    text: "A localizacao sera solicitada apenas quando for util ao alerta e com permissao clara.",
    status: "opcional"
  },
  {
    id: "midia",
    title: "Midia local",
    text: "Video e audio entram quando a usuaria autoriza e o aparelho permitir.",
    status: "opcional"
  }
];
