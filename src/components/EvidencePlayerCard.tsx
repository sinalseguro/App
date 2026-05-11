import { useEffect, useMemo, useRef, useState } from "react";
import { AppState, LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { CalendarClock, Clock3, FileLock2, HardDrive, MapPin, Maximize2, Pause, Play, RotateCcw, Video } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EncryptedVideoLoopbackServer, EncryptedVideoLoopbackSession } from "@/features/emergency/EncryptedVideoLoopbackServer";
import { EncryptedVideoPlaybackCache } from "@/features/emergency/EncryptedVideoPlaybackCache";
import {
  createMediaDiagnosticRun,
  startMediaDiagnosticEvent,
  summarizeMediaDiagnostics
} from "@/features/emergency/MediaDiagnostics";
import {
  NativePlaybackHandle,
  closeNativePlaybackHandle,
  openNativeEncryptedAsset
} from "@/features/emergency/SinalSeguroMediaEngine";
import { attachLocalMediaAsset } from "@/features/emergency/emergencyRecorder";
import {
  getAssetProtectionLabel,
  getAssetSizeLabel,
  getAssetStorageLabel,
  getCameraLabel,
  getPackageMediaCountLabel,
  getPackageMediaDiagnosticLabel,
  getPackageMediaProtectionLabel,
  isEncryptedVideoAsset
} from "@/features/emergency/mediaInterfacePresentation";
import { EmergencyPackage, LocalMediaAsset } from "@/features/emergency/types";
import {
  formatPackageDate,
  formatPackageDurationLabel,
  formatPackageTitle,
  summarizeLocation
} from "@/features/emergency/packagePresentation";

type EvidencePlayerCardProps = {
  packageRecord?: EmergencyPackage;
  mode?: "local" | "received";
};

const temporaryPlaybackTtlMs = 10 * 60 * 1000;

export function EvidencePlayerCard({ packageRecord, mode = "local" }: EvidencePlayerCardProps) {
  const [previewTouched, setPreviewTouched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [playableUri, setPlayableUri] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState("");
  const [preparingPlayback, setPreparingPlayback] = useState(false);
  const [preparationProgress, setPreparationProgress] = useState(0);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const loopbackServerRef = useRef(new EncryptedVideoLoopbackServer());
  const loopbackSessionRef = useRef<EncryptedVideoLoopbackSession | null>(null);
  const nativePlaybackHandleRef = useRef<NativePlaybackHandle | null>(null);
  const playbackCacheRef = useRef(new EncryptedVideoPlaybackCache());
  const playbackDiagnosticRunRef = useRef(createMediaDiagnosticRun("playback"));
  const playbackFirstProgressTimerRef = useRef<ReturnType<typeof startMediaDiagnosticEvent> | null>(null);
  const playbackTemporaryCleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadAbortRef = useRef<AbortController | null>(null);
  const selectedAssetIdRef = useRef<string | undefined>(undefined);
  const videoViewRef = useRef<VideoView | null>(null);
  const mediaAssets = packageRecord?.media.status === "recorded_local" ? packageRecord.media.assets : [];
  const videoAsset = mediaAssets[selectedAssetIndex];
  const hasRepeatedCameraMode = new Set(mediaAssets.map((asset) => asset.cameraMode)).size < mediaAssets.length;
  const encryptedAsset = isEncryptedVideoAsset(videoAsset);
  const canUseInternalDirectPlayer = Boolean(videoAsset && playableUri && !preparingPlayback && !playbackError);
  const player = useVideoPlayer(null, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
  });
  const hasMedia = Boolean(videoAsset);
  const title = mode === "received" ? "Player seguro recebido" : "Player seguro local";
  const selectedTitle = packageRecord ? formatPackageTitle(packageRecord) : title;
  const previewTitle = previewTouched && packageRecord ? selectedTitle : title;
  const mediaDiagnosticLabel = getPackageMediaDiagnosticLabel(packageRecord);
  const previewHint = hasMedia
    ? preparingPlayback
      ? `Preparando player seguro ${preparationProgress}%`
      : playbackError
        ? "Video indisponivel"
        : canUseInternalDirectPlayer
          ? "Video local"
          : encryptedAsset
            ? "Arquivo protegido pronto"
            : "Video local"
    : packageRecord
      ? mediaDiagnosticLabel ?? "Nenhum video neste arquivo"
      : "Abra um item do cofre";
  const packageDateLabel = packageRecord ? formatPackageDate(packageRecord) : undefined;
  const mediaSummary = hasMedia
    ? mediaAssets.length > 1
      ? `${getPackageMediaCountLabel(packageRecord)} - ${getPackageMediaProtectionLabel(packageRecord)}`
      : `${getPackageMediaCountLabel(packageRecord)} - ${getAssetProtectionLabel(videoAsset)}`
    : packageRecord
      ? mediaDiagnosticLabel ?? "Nenhum video neste arquivo"
      : "Abra um item do cofre";
  const playerAccessibilityLabel = packageRecord
    ? `Visualizar ${formatPackageTitle(packageRecord)} no player seguro`
    : "Player seguro sem arquivo selecionado";
  const playbackDisabled = !packageRecord || !hasMedia || preparingPlayback;
  const playableDuration = durationSeconds > 0 ? durationSeconds : getPlayableDurationSeconds(player.duration, videoAsset);
  const canSeek = canUseInternalDirectPlayer && playableDuration > 0;
  const currentTimeLabel = formatPlaybackTime(canUseInternalDirectPlayer ? currentTimeSeconds : 0);
  const durationLabel = formatPlaybackTime(canUseInternalDirectPlayer ? playableDuration : 0);
  const playbackButtonLabel = playing
    ? "Pausar"
    : preparingPlayback
      ? "Preparando"
      : playbackError
        ? "Indisponivel"
        : hasMedia
          ? "Reproduzir"
          : "Sem video local";

  useEffect(() => {
    setPlaying(false);
    setPreviewTouched(false);
    setProgress(0);
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
    setSelectedAssetIndex(0);
  }, [packageRecord?.id]);

  useEffect(() => {
    void playbackCacheRef.current.clearAll().catch(() => undefined);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        player.pause();
        setPlaying(false);
        setPlayableUri(null);
        setPreparationProgress(0);
        setPreparingPlayback(false);
        setProgress(0);
        setCurrentTimeSeconds(0);
        setDurationSeconds(0);
        playbackCacheRef.current.deletePlayableUri(selectedAssetIdRef.current ?? "");
        void closePlaybackHandles();
      }
    });

    return () => {
      subscription.remove();
      void closePlaybackHandles();
    };
  }, [player]);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
    setPreparationProgress(0);
  }, [selectedAssetIndex]);

  useEffect(() => {
    selectedAssetIdRef.current = videoAsset?.id;
    playbackDiagnosticRunRef.current = createMediaDiagnosticRun("playback");
    playbackFirstProgressTimerRef.current = null;
  }, [videoAsset?.id]);

  useEffect(() => {
    const selectedAsset = videoAsset;
    const playbackCache = playbackCacheRef.current;
    const preloadController = new AbortController();

    preloadAbortRef.current?.abort();
    void closePlaybackHandles();
    preloadAbortRef.current = preloadController;
    setPlayableUri(null);
    setPlaybackError("");
    setPreparingPlayback(false);
    setPreparationProgress(0);
    setProgress(0);
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
    player.pause();
    void player.replaceAsync(null);

    if (!selectedAsset) {
      preloadAbortRef.current = null;
      return;
    }

    if (!selectedAsset.encryptedVideo) {
      setPlayableUri(selectedAsset.uri);
      preloadAbortRef.current = null;
    } else {
      void prepareEncryptedPlayback(selectedAsset, preloadController.signal);
    }

    return () => {
      preloadController.abort();
      if (preloadAbortRef.current === preloadController) {
        preloadAbortRef.current = null;
      }
      player.pause();
      void player.replaceAsync(null);
      playbackCache.deletePlayableUri(selectedAsset.id);
      void closePlaybackHandles();
    };
  }, [player, videoAsset]);

  async function prepareEncryptedPlayback(
    selectedAsset = videoAsset,
    abortSignal?: AbortSignal
  ) {
    if (!selectedAsset?.encryptedVideo) return null;

    const diagnosticRunId = playbackDiagnosticRunRef.current;
    const prepareTimer = startMediaDiagnosticEvent(diagnosticRunId, "playback_prepare");
    setPlaybackError("");
    setPreparingPlayback(true);
    setPreparationProgress(0);

    try {
      await closePlaybackHandles();
      if (selectedAsset.encryptedVideo.storageEngine === "native_segmented_v1") {
        const nativePrepareTimer = startMediaDiagnosticEvent(diagnosticRunId, "native_engine_playback_prepare");
        setPreparationProgress(18);
        const nativePlaybackHandle = await openNativeEncryptedAsset(selectedAsset);
        nativePrepareTimer.finish(nativePlaybackHandle ? "ok" : "error", {
          chunkCount: selectedAsset.encryptedVideo.chunkCount,
          plaintextSizeBytes: selectedAsset.encryptedVideo.plaintextSizeBytes
        });
        if (!nativePlaybackHandle) {
          throw new Error("native_playback_unavailable");
        }
        if (abortSignal?.aborted || selectedAssetIdRef.current !== selectedAsset.id) {
          await closeNativePlaybackHandle(nativePlaybackHandle).catch(() => undefined);
          prepareTimer.finish("cancelled", undefined, new Error("playback_asset_changed"));
          return null;
        }
        nativePlaybackHandleRef.current = nativePlaybackHandle;
        const nextPlayableUri = nativePlaybackHandle.playableUri;
        setPreparationProgress(88);
        setPlayableUri(nextPlayableUri);
        scheduleTemporaryPlaybackCleanup(selectedAsset.id);
        await player.replaceAsync({
          contentType: "progressive",
          uri: nextPlayableUri,
          useCaching: false
        });
        setPreparationProgress(100);
        prepareTimer.finish("ok", {
          chunkCount: selectedAsset.encryptedVideo.chunkCount,
          playbackAdapter: "native_encrypted_source",
          plaintextSizeBytes: selectedAsset.encryptedVideo.plaintextSizeBytes
        });
        void persistPlaybackDiagnostics(selectedAsset);
        return nextPlayableUri;
      }

      const cachePrepareTimer = startMediaDiagnosticEvent(diagnosticRunId, "player_cache_prepare");
      try {
        const nextPlayableUri = await playbackCacheRef.current.preparePlayableUri(selectedAsset, {
          abortSignal,
          onProgress: ({ completedChunks, totalChunks }) => {
            const nextProgress = totalChunks > 0 ? Math.round((completedChunks / totalChunks) * 86) : 0;
            setPreparationProgress(Math.max(8, Math.min(94, nextProgress)));
          }
        });
        cachePrepareTimer.finish("ok", {
          chunkCount: selectedAsset.encryptedVideo.chunkCount,
          plaintextSizeBytes: selectedAsset.encryptedVideo.plaintextSizeBytes
        });
        startMediaDiagnosticEvent(diagnosticRunId, "player_loopback_skipped").finish("ok", {
          chunkCount: selectedAsset.encryptedVideo.chunkCount
        });
        if (abortSignal?.aborted || selectedAssetIdRef.current !== selectedAsset.id) {
          playbackCacheRef.current.deletePlayableUri(selectedAsset.id);
          prepareTimer.finish("cancelled", undefined, new Error("playback_asset_changed"));
          return null;
        }
        setPreparationProgress(100);
        setPlayableUri(nextPlayableUri);
        scheduleTemporaryPlaybackCleanup(selectedAsset.id);
        await player.replaceAsync({
          contentType: "progressive",
          uri: nextPlayableUri,
          useCaching: false
        });
        prepareTimer.finish("ok", {
          chunkCount: selectedAsset.encryptedVideo.chunkCount,
          playbackAdapter: "temporary_playback_cache",
          plaintextSizeBytes: selectedAsset.encryptedVideo.plaintextSizeBytes
        });
        void persistPlaybackDiagnostics(selectedAsset);
        return nextPlayableUri;
      } catch (cacheError) {
        cachePrepareTimer.finish("error", undefined, cacheError);
      }

      const nextSession = await loopbackServerRef.current.open(selectedAsset, abortSignal, diagnosticRunId);
      if (abortSignal?.aborted || selectedAssetIdRef.current !== selectedAsset.id) {
        await nextSession.close().catch(() => undefined);
        prepareTimer.finish("cancelled", undefined, new Error("playback_asset_changed"));
        return null;
      }
      loopbackSessionRef.current = nextSession;
      const nextPlayableUri = nextSession.uri;
      setPreparationProgress(100);
      setPlayableUri(nextPlayableUri);
      scheduleTemporaryPlaybackCleanup(selectedAsset.id);
      await player.replaceAsync({
        contentType: "progressive",
        uri: nextPlayableUri,
        useCaching: false
      });
      prepareTimer.finish("ok", {
        chunkCount: selectedAsset.encryptedVideo.chunkCount,
        plaintextSizeBytes: selectedAsset.encryptedVideo.plaintextSizeBytes
      });
      void persistPlaybackDiagnostics(selectedAsset);
      return nextPlayableUri;
    } catch (error) {
      if (abortSignal?.aborted) {
        prepareTimer.finish("cancelled", undefined, error);
        void persistPlaybackDiagnostics(selectedAsset);
        return null;
      }
      prepareTimer.finish("error", undefined, error);
      void persistPlaybackDiagnostics(selectedAsset);
      setPlaybackError("Nao foi possivel preparar este video para reproducao local.");
      player.pause();
      setPlaying(false);
      return null;
    } finally {
      if (!abortSignal?.aborted && selectedAssetIdRef.current === selectedAsset.id) {
        setPreparingPlayback(false);
      }
    }
  }

  useEffect(() => {
    player.pause();
    setPlaying(false);
    setProgress(0);
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
    if (playableUri && !encryptedAsset) {
      void player.replaceAsync(playableUri);
    }
  }, [playableUri, player]);

  useEffect(() => {
    if (!packageRecord || !hasMedia || !canUseInternalDirectPlayer) return;

    const syncPlaybackState = () => {
      const duration = getPlayableDurationSeconds(player.duration, videoAsset);
      const currentTime = Number.isFinite(player.currentTime) ? Math.max(0, player.currentTime) : 0;

      setDurationSeconds(duration);
      setCurrentTimeSeconds(currentTime);
      if (duration > 0) {
        const nextProgress = Math.min(100, (currentTime / duration) * 100);
        setProgress(nextProgress);

        if (playing && currentTime > 0 && playbackFirstProgressTimerRef.current) {
          playbackFirstProgressTimerRef.current.finish("ok", {
            currentTimeMs: currentTime * 1000,
            durationMs: duration * 1000,
            progressPercent: nextProgress
          });
          playbackFirstProgressTimerRef.current = null;
          void persistPlaybackDiagnostics(videoAsset);
        }

        if (playing && nextProgress >= 99.5) {
          player.pause();
          setPlaying(false);
        }
        return;
      }
    };

    syncPlaybackState();
    const timer = setInterval(syncPlaybackState, playing ? 120 : 250);

    return () => clearInterval(timer);
  }, [canUseInternalDirectPlayer, hasMedia, packageRecord, player, playing, videoAsset]);

  const timelinePanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => canSeek,
        onStartShouldSetPanResponder: () => canSeek,
        onPanResponderGrant: (event) => seekFromTimelinePosition(event.nativeEvent.locationX),
        onPanResponderMove: (event) => seekFromTimelinePosition(event.nativeEvent.locationX)
      }),
    [canSeek, player, timelineWidth]
  );

  async function toggleLocalPlayback() {
    if (!packageRecord) return;

    setPreviewTouched(true);
    if (!hasMedia) {
      player.pause();
      setPlaying(false);
      setProgress(0);
      setCurrentTimeSeconds(0);
      return;
    }

    if (!canUseInternalDirectPlayer) {
      const preparedUri = videoAsset?.encryptedVideo ? await prepareEncryptedPlayback(videoAsset) : playableUri;
      if (!preparedUri) return;
    }

    setPlaying((currentValue) => {
      if (currentValue) {
        player.pause();
        setCurrentTimeSeconds(Number.isFinite(player.currentTime) ? Math.max(0, player.currentTime) : 0);
        playbackFirstProgressTimerRef.current?.finish("cancelled", undefined, new Error("playback_paused"));
        playbackFirstProgressTimerRef.current = null;
      } else {
        playbackFirstProgressTimerRef.current = startMediaDiagnosticEvent(
          playbackDiagnosticRunRef.current,
          "playback_first_progress"
        );
        player.play();
      }
      return !currentValue;
    });
  }

  async function restartLocalPlayback() {
    if (!packageRecord) return;

    setPreviewTouched(true);
    setProgress(0);
    setCurrentTimeSeconds(0);
    if (!hasMedia) {
      player.pause();
      setPlaying(false);
      return;
    }

    if (!canUseInternalDirectPlayer) {
      const preparedUri = videoAsset?.encryptedVideo ? await prepareEncryptedPlayback(videoAsset) : playableUri;
      if (!preparedUri) return;
    }

    player.currentTime = 0;
    setCurrentTimeSeconds(0);
    playbackFirstProgressTimerRef.current = startMediaDiagnosticEvent(
      playbackDiagnosticRunRef.current,
      "playback_first_progress"
    );
    player.play();
    setPlaying(true);
  }

  function handleTimelineLayout(event: LayoutChangeEvent) {
    setTimelineWidth(event.nativeEvent.layout.width);
  }

  function seekFromTimelinePosition(locationX: number) {
    if (!canSeek || timelineWidth <= 0) return;

    const nextProgress = Math.max(0, Math.min(1, locationX / timelineWidth));
    const nextTimeSeconds = nextProgress * playableDuration;
    player.currentTime = nextTimeSeconds;
    setCurrentTimeSeconds(nextTimeSeconds);
    setProgress(nextProgress * 100);
  }

  async function openFullscreen() {
    if (!canUseInternalDirectPlayer || preparingPlayback) return;

    setPreviewTouched(true);
    try {
      await videoViewRef.current?.enterFullscreen();
    } catch {
      setPlaybackError("Nao foi possivel abrir o video em tela cheia neste dispositivo.");
    }
  }

  async function retryPlaybackPreparation() {
    if (!videoAsset?.encryptedVideo || preparingPlayback) return;

    const retryController = new AbortController();
    preloadAbortRef.current?.abort();
    preloadAbortRef.current = retryController;
    await prepareEncryptedPlayback(videoAsset, retryController.signal);
  }

  async function closeLoopbackSession() {
    const currentSession = loopbackSessionRef.current;
    loopbackSessionRef.current = null;
    if (currentSession) {
      await currentSession.close().catch(() => undefined);
    }
  }

  async function closeNativePlaybackSession() {
    const currentHandle = nativePlaybackHandleRef.current;
    nativePlaybackHandleRef.current = null;
    await closeNativePlaybackHandle(currentHandle).catch(() => undefined);
  }

  function clearTemporaryPlaybackCleanupTimer() {
    if (playbackTemporaryCleanupTimerRef.current) {
      clearTimeout(playbackTemporaryCleanupTimerRef.current);
      playbackTemporaryCleanupTimerRef.current = null;
    }
  }

  function scheduleTemporaryPlaybackCleanup(assetId: string) {
    clearTemporaryPlaybackCleanupTimer();
    playbackTemporaryCleanupTimerRef.current = setTimeout(() => {
      playbackTemporaryCleanupTimerRef.current = null;
      if (selectedAssetIdRef.current !== assetId) return;

      player.pause();
      void player.replaceAsync(null);
      playbackCacheRef.current.deletePlayableUri(assetId);
      void closePlaybackHandles();
      setPlayableUri(null);
      setPlaying(false);
      setProgress(0);
      setCurrentTimeSeconds(0);
      setDurationSeconds(0);
      setPreparationProgress(0);
      setPreparingPlayback(false);
    }, temporaryPlaybackTtlMs);
  }

  async function closePlaybackHandles() {
    clearTemporaryPlaybackCleanupTimer();
    await Promise.all([closeLoopbackSession(), closeNativePlaybackSession()]);
  }

  async function persistPlaybackDiagnostics(asset?: LocalMediaAsset) {
    if (!packageRecord || !asset?.encryptedVideo) return;

    const nextSnapshot = summarizeMediaDiagnostics(playbackDiagnosticRunRef.current);
    const previousSnapshot = asset.encryptedVideo.diagnostics;
    const eventsByKey = new Map(
      [...(previousSnapshot?.events ?? []), ...nextSnapshot.events].map((event) => [
        `${event.runId}:${event.stage}:${event.startedAt}`,
        event
      ])
    );
    await attachLocalMediaAsset(packageRecord.id, {
      ...asset,
      encryptedVideo: {
        ...asset.encryptedVideo,
        diagnostics: {
          ...nextSnapshot,
          events: [...eventsByKey.values()]
        }
      }
    }).catch(() => undefined);
  }

  function formatAssetSwitchLabel(asset: LocalMediaAsset, index: number) {
    const cameraLabel = asset.cameraMode === "front" ? "Frontal" : "Traseira";
    const segmentLabel = hasRepeatedCameraMode ? ` ${index + 1}` : "";
    return `${cameraLabel}${segmentLabel}${isEncryptedVideoAsset(asset) ? " protegida" : ""}`;
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
        {hasMedia && canUseInternalDirectPlayer ? (
          <VideoView
            allowsPictureInPicture={false}
            contentFit="contain"
            fullscreenOptions={{ enable: true, orientation: "landscape", autoExitOnRotate: true }}
            nativeControls={false}
            player={player}
            ref={videoViewRef}
            surfaceType="textureView"
            style={styles.videoView}
          />
        ) : (
          <View style={styles.playBadge}>
            {hasMedia ? <FileLock2 size={36} color={theme.colors.textOnDark} /> : <Video size={36} color={theme.colors.textOnDark} />}
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
                accessibilityLabel={`Selecionar ${formatAssetSwitchLabel(asset, index)}`}
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
                  {formatAssetSwitchLabel(asset, index)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineLabel}>{hasMedia && encryptedAsset ? "Player seguro" : hasMedia ? "Reproducao" : "Previa"}</Text>
          <Text style={styles.timelineValue}>{canUseInternalDirectPlayer ? `${currentTimeLabel} / ${durationLabel}` : `${Math.round(progress)}%`}</Text>
        </View>
        <View
          accessibilityLabel="Linha do tempo do video"
          accessibilityRole="adjustable"
          accessibilityState={{ disabled: !canSeek }}
          onLayout={handleTimelineLayout}
          style={[styles.timelineTrack, !canSeek && styles.timelineTrackDisabled]}
          {...timelinePanResponder.panHandlers}
        >
          <View style={[styles.timelineFill, { width: `${progress}%` }]} />
          {canSeek ? <View style={[styles.timelineThumb, { left: `${progress}%` }]} /> : null}
        </View>
        <View style={styles.controlRow}>
          <Pressable
            accessibilityLabel={playing ? "Pausar revisao local" : "Reproduzir revisao local"}
            accessibilityRole="button"
            accessibilityState={{ disabled: playbackDisabled, selected: playing }}
            disabled={playbackDisabled}
            onPress={() => {
              void toggleLocalPlayback();
            }}
            style={({ pressed }) => [
              styles.controlButton,
              playbackDisabled && styles.controlButtonDisabled,
              pressed && !playbackDisabled && styles.controlButtonPressed
            ]}
          >
            {playing ? <Pause size={18} color={theme.colors.textOnDark} /> : <Play size={18} color={theme.colors.textOnDark} />}
            <Text style={styles.controlLabel}>{playbackButtonLabel}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Reiniciar revisao local"
            accessibilityRole="button"
            accessibilityState={{ disabled: playbackDisabled }}
            disabled={playbackDisabled}
            onPress={() => {
              void restartLocalPlayback();
            }}
            style={({ pressed }) => [
              styles.secondaryControlButton,
              playbackDisabled && styles.controlButtonDisabled,
              pressed && !playbackDisabled && styles.controlButtonPressed
            ]}
          >
            <RotateCcw size={18} color={theme.colors.primary} />
            <Text style={styles.secondaryControlLabel}>Reiniciar</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Abrir video em tela cheia"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canUseInternalDirectPlayer || preparingPlayback }}
            disabled={!canUseInternalDirectPlayer || preparingPlayback}
            onPress={() => {
              void openFullscreen();
            }}
            style={({ pressed }) => [
              styles.iconControlButton,
              (!canUseInternalDirectPlayer || preparingPlayback) && styles.controlButtonDisabled,
              pressed && canUseInternalDirectPlayer && !preparingPlayback && styles.controlButtonPressed
            ]}
          >
            <Maximize2 size={18} color={theme.colors.primary} />
          </Pressable>
        </View>
        {playbackError ? (
          <Pressable
            accessibilityLabel="Tentar preparar video novamente"
            accessibilityRole="button"
            disabled={preparingPlayback}
            onPress={() => {
              void retryPlaybackPreparation();
            }}
            style={({ pressed }) => [styles.retryButton, pressed && !preparingPlayback && styles.controlButtonPressed]}
          >
            <Text style={styles.retryLabel}>Tentar novamente</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.secureBadge}>
        <FileLock2 size={16} color={theme.colors.primary} />
        <Text style={styles.secureBadgeText}>{getPackageMediaProtectionLabel(packageRecord)}</Text>
      </View>

      {packageRecord ? (
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <CalendarClock size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{packageDateLabel}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock3 size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{formatPackageDurationLabel(packageRecord)}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{summarizeLocation(packageRecord)}</Text>
          </View>
          <View style={styles.detailItem}>
            <FileLock2 size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{mediaSummary}</Text>
          </View>
          <View style={styles.detailItem}>
            <Video size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{getCameraLabel(videoAsset)}</Text>
          </View>
          <View style={styles.detailItem}>
            <HardDrive size={17} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.detailText}>{`${getAssetStorageLabel(videoAsset)} - ${getAssetSizeLabel(videoAsset)}`}</Text>
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
  iconControlButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    width: 48
  },
  retryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md
  },
  retryLabel: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "900"
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
    height: 7,
    position: "absolute",
    top: 3
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
    height: 14
  },
  timelineTrackDisabled: {
    opacity: 0.62
  },
  timelineThumb: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.accent,
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    marginLeft: -7,
    position: "absolute",
    top: -3,
    width: 14
  },
  timelineValue: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    minWidth: 88,
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

function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getPlayableDurationSeconds(nativeDuration: number, asset: LocalMediaAsset | undefined) {
  if (Number.isFinite(nativeDuration) && nativeDuration > 0) return nativeDuration;

  const encryptedDurationMs = asset?.encryptedVideo?.durationMs;
  if (typeof encryptedDurationMs === "number" && encryptedDurationMs > 0) {
    return encryptedDurationMs / 1000;
  }

  if (!asset?.recordedAt || !asset.completedAt) return 0;

  const recordedAt = Date.parse(asset.recordedAt);
  const completedAt = Date.parse(asset.completedAt);
  if (!Number.isFinite(recordedAt) || !Number.isFinite(completedAt) || completedAt <= recordedAt) return 0;

  return (completedAt - recordedAt) / 1000;
}
