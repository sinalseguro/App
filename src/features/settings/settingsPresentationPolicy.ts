import type { LocalVideoCameraMode } from "@/features/emergency/emergencyPreferences";

export type PermissionStatusText = "pendente" | "permitido" | "negado" | "bloqueado";

export type SettingsPanel =
  | "duracao"
  | "encerramento"
  | "localizacao"
  | "compartilhamento"
  | "video"
  | "atualizacao"
  | "termos"
  | "login"
  | null;

export type SettingsConcretePanel = Exclude<SettingsPanel, null>;

export type SettingsLegalConsentItem = {
  text: string;
  title: string;
};

export type SettingsPanelHelp = {
  message: string;
  title: string;
};

export const settingsLegalConsentItems: SettingsLegalConsentItem[] = [
  {
    title: "Uso emergencial",
    text: "O SinalSeguro apoia um pedido de ajuda e guarda arquivos locais autorizados. Ele nao substitui 190, 193, 192 nem atendimento publico."
  },
  {
    title: "Privacidade",
    text: "Localizacao, video e audio so devem ser usados para protecao, orientacao e entrega autorizada dentro do fluxo SinalSeguro."
  },
  {
    title: "Arquivos locais",
    text: "Os arquivos ficam neste aparelho ate exclusao local ou envio futuro com backend, chaves, auditoria, termos completos e revisao juridica."
  }
];

export const settingsPanelTitles = {
  compartilhamento: "Compartilhamento",
  duracao: "Tempo de gravacao",
  encerramento: "Codigo de seguranca",
  localizacao: "Localizacao",
  login: "Login",
  atualizacao: "Atualizacao",
  termos: "Termos e privacidade",
  video: "Video local"
} satisfies Record<SettingsConcretePanel, string>;

const settingsPanelHelpMessages = {
  compartilhamento:
    "Os anjos recebem dados somente quando houver convite aceito, autorizacao da usuaria e contrato de privacidade. A opcao de ligar 190 junto com o SOS vem desativada por padrao.",
  duracao:
    "Este tempo controla apenas a gravacao local. O chamado de emergencia continua ativo ate a usuaria encerrar pelo botao SOS.",
  encerramento: "Quando ativo, o codigo protege o encerramento do SOS e o acesso as areas privadas do app.",
  localizacao:
    "Autorizar localizacao antes da emergencia reduz etapas no momento do acionamento. A permissao pode ser revogada no sistema.",
  login: "Use sua conta para proteger convites, anjos e acesso aos arquivos autorizados.",
  atualizacao:
    "A verificacao usa o canal oficial de download do SinalSeguro e informa quando houver uma versao Android mais recente.",
  termos:
    "Termos e privacidade registram consentimento para uso emergencial, anjos autorizados e preservacao dos arquivos.",
  video:
    "O SOS pode gravar video local no aparelho autorizado. A opcao padrao tenta usar as duas cameras; se o aparelho bloquear, o app preserva a camera disponivel."
} satisfies Record<SettingsConcretePanel, string>;

export function resolveSettingsPermissionStatus(status: unknown): PermissionStatusText {
  if (status === "granted") return "permitido";
  if (status === "denied") return "negado";
  return "pendente";
}

export function formatSettingsCameraModeLabel(cameraMode: LocalVideoCameraMode) {
  if (cameraMode === "back") return "Traseira";
  if (cameraMode === "both") return "Duas cameras";
  return "Frontal";
}

export function formatSettingsTrustedContactStatus(status: string) {
  if (status === "accepted" || status === "ativo" || status === "validado") return "Autorizado";
  if (status === "pending" || status === "pendente") return "Aguardando aceite";
  if (status === "revoked" || status === "revogado") return "Revogado";
  return "Em revisao";
}

export function buildSettingsPanelHelp(panel: SettingsConcretePanel): SettingsPanelHelp {
  return {
    message: settingsPanelHelpMessages[panel],
    title: `Ajuda: ${settingsPanelTitles[panel]}`
  };
}
