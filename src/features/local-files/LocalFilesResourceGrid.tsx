import { Archive, BookOpen, CirclePlay, RefreshCw } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { ResourceTile } from "@/components/ResourceTile";
import { theme } from "@/design/theme";
import { localFilesResourceTiles } from "@/features/emergency/localFilesPresentationPolicy";
import type {
  LocalFilesResourceIconKey,
  LocalFilesResourceTileId
} from "@/features/emergency/localFilesPresentationPolicy";

type LocalFilesResourceGridProps = {
  onCheckUpdates: () => void;
  onOpenHowItWorks: () => void;
  onOpenPlayer: () => void;
  onOpenVault: () => void;
};

function renderLocalFilesResourceIcon(iconKey: LocalFilesResourceIconKey) {
  switch (iconKey) {
    case "archive":
      return <Archive size={24} color={theme.colors.primary} />;
    case "book":
      return <BookOpen size={24} color={theme.colors.primary} />;
    case "play":
      return <CirclePlay size={24} color={theme.colors.primary} />;
    case "refresh":
      return <RefreshCw size={24} color={theme.colors.primary} />;
  }
}

export function LocalFilesResourceGrid({
  onCheckUpdates,
  onOpenHowItWorks,
  onOpenPlayer,
  onOpenVault
}: LocalFilesResourceGridProps) {
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
      {[0, 2].map((startIndex) => (
        <View key={startIndex} style={styles.resourceGrid}>
          {localFilesResourceTiles.slice(startIndex, startIndex + 2).map((tile) => (
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
