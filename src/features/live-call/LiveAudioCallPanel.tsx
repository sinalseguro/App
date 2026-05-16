import { Pressable, StyleSheet, Text, View } from "react-native";
import { PhoneOff, Radio, Video } from "lucide-react-native";
import { RTCView } from "react-native-webrtc";

import { theme } from "@/design/theme";
import type { LiveAudioCallState } from "./useLiveAudioCall";

type LiveAudioCallPanelProps = {
  actionLabel: string;
  disabled?: boolean;
  onPrimaryAction: () => void;
  onStop: () => void;
  state: LiveAudioCallState;
};

function statusLabel(status: LiveAudioCallState["status"]) {
  if (status === "connected") return "Videochamada conectada";
  if (status === "connecting") return "Conectando";
  if (status === "failed") return "Videochamada indisponivel";
  if (status === "waiting") return "Aguardando";
  if (status === "ended") return "Videochamada encerrada";
  return "Videochamada com anjo";
}

function accentColor(status: LiveAudioCallState["status"]) {
  if (status === "connected") return theme.colors.secure;
  if (status === "failed") return theme.colors.warning;
  return theme.colors.primary;
}

export function LiveAudioCallPanel({
  actionLabel,
  disabled = false,
  onPrimaryAction,
  onStop,
  state
}: LiveAudioCallPanelProps) {
  const active = state.status === "connected" || state.status === "connecting" || state.status === "waiting";
  const accent = accentColor(state.status);
  const remoteStreamUrl = state.remoteStream?.toURL();

  return (
    <View style={[styles.panel, { borderColor: accent }]}>
      <View style={styles.header}>
        <View style={[styles.iconSlot, { backgroundColor: `${accent}18` }]}>
          <Radio size={18} color={accent} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{statusLabel(state.status)}</Text>
          <Text style={styles.message}>{state.message}</Text>
        </View>
      </View>

      {remoteStreamUrl ? (
        <View style={styles.videoFrame}>
          <RTCView objectFit="cover" streamURL={remoteStreamUrl} style={styles.remoteVideo} />
          <Text style={styles.videoLabel}>{state.role === "owner" ? "Imagem do anjo" : "Imagem recebida"}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          disabled={disabled || active}
          onPress={onPrimaryAction}
          style={({ pressed }) => [
            styles.primaryAction,
            (disabled || active) && styles.actionDisabled,
            pressed && styles.actionPressed
          ]}
        >
          <Video size={17} color={theme.colors.textOnDark} />
          <Text style={styles.primaryActionText}>{actionLabel}</Text>
        </Pressable>
        {active ? (
          <Pressable
            accessibilityLabel="Encerrar videochamada"
            accessibilityRole="button"
            onPress={onStop}
            style={({ pressed }) => [styles.stopAction, pressed && styles.actionPressed]}
          >
            <PhoneOff size={17} color={theme.colors.danger} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionDisabled: {
    opacity: 0.48
  },
  actionPressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }]
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  iconSlot: {
    alignItems: "center",
    borderRadius: theme.radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  message: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm
  },
  primaryActionText: {
    color: theme.colors.textOnDark,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  stopAction: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 48
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  remoteVideo: {
    flex: 1
  },
  videoFrame: {
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.md,
    height: 120,
    overflow: "hidden"
  },
  videoLabel: {
    backgroundColor: "rgba(0,0,0,0.42)",
    bottom: 0,
    color: theme.colors.textOnDark,
    fontSize: 11,
    fontWeight: "900",
    left: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    position: "absolute",
    right: 0
  }
});
