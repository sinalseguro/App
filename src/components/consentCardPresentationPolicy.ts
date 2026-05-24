export type ConsentCardStatus = "obrigatorio" | "opcional" | "bloqueado";

export type ConsentCardTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type ConsentCardPresentation = {
  statusLabel: string;
  statusTextFit: ConsentCardTextFit;
  textTextFit: ConsentCardTextFit;
  titleTextFit: ConsentCardTextFit;
};

export const consentCardStatusLabels: Record<ConsentCardStatus, string> = {
  obrigatorio: "obrigatorio",
  opcional: "opcional",
  bloqueado: "bloqueado"
};

export const consentCardStatusTextFit: ConsentCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 1
};

export const consentCardTitleTextFit: ConsentCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
};

export const consentCardBodyTextFit: ConsentCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.86,
  numberOfLines: 4
};

export function buildConsentCardPresentation(status: ConsentCardStatus): ConsentCardPresentation {
  return {
    statusLabel: consentCardStatusLabels[status],
    statusTextFit: consentCardStatusTextFit,
    textTextFit: consentCardBodyTextFit,
    titleTextFit: consentCardTitleTextFit
  };
}
