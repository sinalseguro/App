import type { LocalFilesResourceTile } from "@/features/emergency/localFilesPresentationPolicy";

export type LocalFilesResourceGridIconPresentation = {
  colorToken: "primary";
  size: number;
};

export type LocalFilesResourceGridRow = {
  id: string;
  tiles: readonly LocalFilesResourceTile[];
};

export type LocalFilesResourceGridPresentation = {
  icon: LocalFilesResourceGridIconPresentation;
  rowStartIndexes: readonly number[];
  tilesPerRow: number;
};

export const localFilesResourceGridPresentation: LocalFilesResourceGridPresentation = {
  icon: {
    colorToken: "primary",
    size: 24
  },
  rowStartIndexes: [0, 2],
  tilesPerRow: 2
};

export function buildLocalFilesResourceGridRows(
  tiles: readonly LocalFilesResourceTile[]
): readonly LocalFilesResourceGridRow[] {
  return localFilesResourceGridPresentation.rowStartIndexes.map((startIndex) => ({
    id: `resource-row-${startIndex}`,
    tiles: tiles.slice(startIndex, startIndex + localFilesResourceGridPresentation.tilesPerRow)
  }));
}

export function resolveLocalFilesResourceGridIconPresentation(): LocalFilesResourceGridIconPresentation {
  return localFilesResourceGridPresentation.icon;
}
