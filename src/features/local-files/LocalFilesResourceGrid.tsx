import { Archive, BookOpen, CirclePlay, RefreshCw } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { ResourceTile } from "@/components/ResourceTile";
import { theme } from "@/design/theme";
import { localFilesResourceTiles } from "@/features/emergency/localFilesPresentationPolicy";
import type {
  LocalFilesResourceIconKey,
  LocalFilesResourceTileId
} from "@/features/emergency/localFilesPresentationPolicy";
import {
  buildLocalFilesResourceGridRows,
  resolveLocalFilesResourceGridIconPresentation
} from "@/features/local-files/localFilesResourceGridPresentationPolicy";

type LocalFilesResourceGridProps = {
  onCheckUpdates: () => void;
  onOpenHowItWorks: () => void;
  onOpenPlayer: () => void;
  onOpenVault: () => void;
};

function renderLocalFilesResourceIcon(iconKey: LocalFilesResourceIconKey) {
  const iconPresentation = resolveLocalFilesResourceGridIconPresentation();
  const iconColor = theme.colors[iconPresentation.colorToken];

  switch (iconKey) {
    case "archive":
      return <Archive size={iconPresentation.size} color={iconColor} />;
    case "book":
      return <BookOpen size={iconPresentation.size} color={iconColor} />;
    case "play":
      return <CirclePlay size={iconPresentation.size} color={iconColor} />;
    case "refresh":
      return <RefreshCw size={iconPresentation.size} color={iconColor} />;
  }
}

export function LocalFilesResourceGrid({
  onCheckUpdates,
  onOpenHowItWorks,
  onOpenPlayer,
  onOpenVault
}: LocalFilesResourceGridProps) {
  const resourceRows = buildLocalFilesResourceGridRows(localFilesResourceTiles);

  function handleTilePress(tileId: LocalFilesResourceTileId) {
    if (tileId === "player") {
      onOpenPlayer();
      return;
    }
    if (tileId === "vault") {
      onOpenVault();
      return;
    }
    if (tileId === "how-it-works") {
      onOpenHowItWorks();
      return;
    }
    onCheckUpdates();
  }

  return (
    <>
      {resourceRows.map((row) => (
        <View key={row.id} style={styles.resourceGrid}>
          {row.tiles.map((tile) => (
            <ResourceTile
              key={tile.id}
              icon={renderLocalFilesResourceIcon(tile.iconKey)}
              label={tile.label}
              description={tile.description}
              onPress={() => handleTilePress(tile.id)}
            />
          ))}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  resourceGrid: {
    flexDirection: "row",
    gap: theme.spacing.md
  }
});
