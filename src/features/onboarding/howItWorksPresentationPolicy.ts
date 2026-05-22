export type HowItWorksStepIconKey = "archive" | "key" | "location" | "radio" | "shield" | "video";

export type HowItWorksStep = {
  iconKey: HowItWorksStepIconKey;
  id: string;
  text: string;
  title: string;
};

export const howItWorksSteps: readonly HowItWorksStep[] = [
  {
    iconKey: "radio",
    id: "acionamento",
    title: "Acionamento",
    text: "O SOS exige pressao longa para evitar toque acidental. Atalhos fisicos entram quando forem seguros no aparelho."
  },
  {
    iconKey: "location",
    id: "localizacao",
    title: "Localizacao",
    text: "A localizacao pontual pode ser pre-autorizada para reduzir atrito no momento do chamado."
  },
  {
    iconKey: "archive",
    id: "cofre-local",
    title: "Cofre local",
    text: "O pacote e o video autorizado ficam preservados no dispositivo para revisao local segura."
  },
  {
    iconKey: "key",
    id: "protecao-arquivos",
    title: "Protecao dos arquivos",
    text: "Arquivos e localizacao ficam protegidos no app e so devem sair com autorizacao."
  },
  {
    iconKey: "video",
    id: "midia",
    title: "Midia",
    text: "Video local autorizado pode ficar salvo no aparelho para revisao privada."
  },
  {
    iconKey: "shield",
    id: "privacidade",
    title: "Privacidade",
    text: "Dados devem ser usados apenas para protecao, orientacao e entrega autorizada."
  }
];
