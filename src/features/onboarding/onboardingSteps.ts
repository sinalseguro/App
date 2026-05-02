export const onboardingSteps = [
  {
    id: "limites",
    title: "Limites do servico",
    text: "O SinalSeguro apoia sua rede de confianca, mas nao substitui canais oficiais de emergencia.",
    status: "obrigatorio" as const
  },
  {
    id: "privacidade",
    title: "Privacidade",
    text: "Dados sensiveis nao devem ser enviados sem consentimento, finalidade e retencao definida.",
    status: "obrigatorio" as const
  },
  {
    id: "localizacao",
    title: "Localizacao pontual",
    text: "A localizacao sera solicitada apenas quando for util ao alerta e com permissao clara.",
    status: "opcional" as const
  },
  {
    id: "midia",
    title: "Midia homologada",
    text: "Gravacao e upload ficam bloqueados para producao ate revisao juridica e de seguranca.",
    status: "bloqueado" as const
  }
];
