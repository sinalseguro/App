import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { CalendarClock, FileLock2, MapPin, Pause, Play, RotateCcw, Video } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyPackage } from "@/features/emergency/types";
import {
  formatPackageDate,
  formatPackageTitle,
  summarizeLocation
} from "@/features/emergency/packagePresentation";

type EvidencePlayerCardProps = {
  packageRecord?: EmergencyPackage;
  mode?: "local" | "received";
};

export function EvidencePlayerCard({ packageRecord, mode = "local" }: EvidencePlayerCardProps) {
  const [previewTouched, setPreviewTouched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const mediaAssets = packageRecord?.media.status === "recorded_local" ? packageRecord.media.assets : [];
  const videoAsset = mediaAssets[selectedAssetIndex];
  const player = useVideoPlayer(videoAsset?.uri ?? null, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
  });
  const hasMedia = Boolean(videoAsset);
  const title = mode === "received" ? "Player seguro recebido" : "Player seguro local";
  const selectedTitle = packageRecord ? formatPackageTitle(packageRecord) : title;
  const previewTitle = previewTouched && packageRecord ? selectedTitle : title;
  const previewHint = hasMedia
    ? "Video local"
    : packageRecord
      ? "Sem video"
      : "Escolha arquivo";
  const packageDateLabel = packageRecord ? formatPackageDate(packageRecord) : undefined;
  const mediaSummary = hasMedia
    ? mediaAssets.length > 1
      ? `${mediaAssets.length} videos locais`
      : "1 video local"
    : packageRecord
      ? "Sem video"
      : "Escolha arquivo";
  const playerAccessibilityLabel = packageRecord
    ? `Visualizar ${formatPackageTitle(packageRecord)} no player seguro`
    : "Player seguro sem arquivo selecionado";

  useEffect(() => {
    setPlaying(false);
    setPreviewTouched(false);
    setProgress(0);
    setSelectedAssetIndex(0);
  }, [packageRecord?.id]);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [selectedAssetIndex]);

  useEffect(() => {
    if (!playing || !packageRecord) return;

    const timer = setInterval(() => {
      if (hasMedia) {
        const duration = player.duration;
        const currentTime = player.currentTime;

        if (Number.isFinite(duration) && duration > 0) {
          const nextProgress = Math.min(100, (currentTime / duration) * 100);
          setProgress(nextProgress);

          if (nextProgress >= 99.5) {
            player.pause();
            setPlaying(false);
          }
          return;
        }
      }

      setProgress((currentProgress) => {
        const nextProgress = Math.min(100, currentProgress + 6);
        if (nextProgress >= 100) {
          setPlaying(false);
        }
        return nextProgress;
      });
    }, 360);

    return () => clearInterval(timer);
  }, [hasMedia, packageRecord, player, playing]);

  function toggleLocalPlayback() {
    if (!packageRecord) return;

    setPreviewTouched(true);
    setPlaying((currentValue) => {
      if (hasMedia) {
        if (currentValue) {
          player.pause();
        } else {
          player.play();
        }
      }
      return !currentValue;
    });
  }

  function restartLocalPlayback() {
    if (!packageRecord) return;

    setPreviewTouched(true);
    setProgress(0);
    if (hasMedia) {
      player.currentTime = 0;
      player.play();
    }
    setPlaying(true);
  }

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={playerAccessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled: !packageRecord, selected: previewTouched && Boolean(packageRecord) }}
        disabled={!packageRecord}
        onPress={() => setPreviewTouched(true)}
        style={({ pressed }) => [
          styles.preview,
          previewTouched && packageRecord && styles.previewSelected,
          pressed && packageRecord && styles.previewPressed
        ]}
      >
        {hasMedia ? (
          <VideoView
            contentFit="contain"
            nativeControls
            player={player}
            style={styles.videoView}
          />
        ) : (
          <View style={styles.playBadge}>
            <Video size={36} color={theme.colors.textOnDark} />
          </View>
        )}
        <Text style={styles.previewTitle}>{previewTitle}</Text>
        <Text style={styles.previewHint}>{previewHint}</Text>
        {packageDateLabel ? <Text style={styles.packageId}>{packageDateLabel}</Text> : null}
      </Pressable>

      <View style={styles.controlPanel}>
        {mediaAssets.length > 1 ? (
          <View style={styles.assetSwitchRow}>
            {mediaAssets.map((asset, index) => (
              <Pressable
                accessibilityLabel={`Selecionar video da camera ${asset.cameraMode === "front" ? "frontal" : "traseira"}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedAssetIndex === index }}
                key={asset.id}
                onPress={() => setSelectedAssetIndex(index)}
                style={[
                  styles.assetSwitchButton,
                  selectedAssetIndex === index && styles.assetSwitchButtonSelected
                ]}
              >
                <Text
                  style={[
                    styles.assetSwitchLabel,
                    selectedAssetIndex === index && styles.assetSwitchLabelSelected
                  ]}
                >
                  {asset.cameraMode === "front" ? "Frontal" : "Traseira"}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineLabel}>{hasMedia ? "Reproducao" : "Revisao"}</Text>
          <Text style={styles.timelineValue}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.timelineTrack}>
          <View style={[styles.timelineFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.controlRow}>
          <Pressable
            accessibilityLabel={playing ? "Pausar revisao local" : "Reproduzir revisao local"}
            accessibilityRole="button"
            accessibilityState={{ disabled: !packageRecord, selected: playing }}
            disabled={!packageRecord}
            onPress={toggleLocalPlayback}
            style={({ pressed }) => [
              styles.controlButton,
              !packageRecord && styles.controlButtonDisabled,
              pressed && packageRecord && styles.controlButtonPressed
            ]}
          >
            {playing ? <Pause size={18} color={theme.colors.textOnDark} /> : <Play size={18} color={theme.colors.textOnDark} />}
            <Text style={styles.controlLabel}>{playing ? "Pausar" : hasMedia ? "Reproduzir" : "Revisar"}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Reiniciar revisao local"
            accessibilityRole="button"
            accessibilityState={{ disabled: !packageRecord }}
            disabled={!packageRecord}
            onPress={restartLocalPlayback}
            style={({ pressed }) => [
              styles.secondaryControlButton,
              !packageRecord && styles.controlButtonDisabled,
              pressed && packageRecord && styles.controlButtonPressed
            ]}
          >
            <RotateCcw size={18} color={theme.colors.primary} />
            <Text style={styles.secondaryControlLabel}>Reiniciar</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.secureBadge}>
        <FileLock2 size={16} color={theme.colors.primary} />
        <Text style={styles.secureBadgeText}>Privado</Text>
      </View>

      {packageRecord ? (
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <CalendarClock size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{packageDateLabel}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{summarizeLocation(packageRecord)}</Text>
          </View>
          <View style={styles.detailItem}>
            <FileLock2 size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{mediaSummary}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  assetSwitchButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: theme.spacing.sm
  },
  assetSwitchButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  assetSwitchLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  assetSwitchLabelSelected: {
    color: theme.colors.textOnDark
  },
  assetSwitchRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.md
  },
  controlButtonDisabled: {
    opacity: 0.42
  },
  controlButtonPressed: {
    opacity: 0.86
  },
  controlLabel: {
    color: theme.colors.textOnDark,
    fontSize: theme.typography.small,
    fontWeight: "900"
  },
  controlPanel: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  controlRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  detailGrid: {
    gap: theme.spacing.sm
  },
  detailItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  detailText: {
    color: theme.colors.textMuted,
    flex: 1,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  secondaryControlButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.md
  },
  secondaryControlLabel: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "900"
  },
  secureBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 30,
    paddingHorizontal: theme.spacing.sm
  },
  secureBadgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  timelineFill: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    height: "100%"
  },
  timelineHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between"
  },
  timelineLabel: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  timelineTrack: {
    backgroundColor: "rgba(30, 27, 46, 0.14)",
    borderRadius: theme.radius.pill,
    height: 7,
    overflow: "hidden"
  },
  timelineValue: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    minWidth: 42,
    textAlign: "right"
  },
  preview: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundStrong,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    minHeight: 116,
    justifyContent: "center",
    padding: theme.spacing.sm
  },
  previewPressed: {
    opacity: 0.9
  },
  previewSelected: {
    borderColor: theme.colors.accent,
    borderWidth: 2
  },
  packageId: {
    color: theme.colors.accentSoft,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  previewTitle: {
    color: theme.colors.textOnDark,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center"
  },
  previewHint: {
    color: theme.colors.textOnDarkMuted,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  },
  playBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 38,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  videoView: {
    alignSelf: "stretch",
    backgroundColor: "rgba(18, 10, 32, 0.62)",
    borderRadius: theme.radius.md,
    height: 132,
    overflow: "hidden",
    width: "100%"
  }
});
