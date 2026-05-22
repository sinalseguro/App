export type ResourceTileTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type ResourceTilePresentation = {
  descriptionTextFit: ResourceTileTextFit;
  labelTextFit: ResourceTileTextFit;
  shouldRenderDescription: boolean;
};

export const resourceTileLabelTextFit: ResourceTileTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
};

export const resourceTileDescriptionTextFit: ResourceTileTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 2
};

export function buildResourceTilePresentation(description?: string): ResourceTilePresentation {
  return {
    descriptionTextFit: resourceTileDescriptionTextFit,
    labelTextFit: resourceTileLabelTextFit,
    shouldRenderDescription: Boolean(description)
  };
}
