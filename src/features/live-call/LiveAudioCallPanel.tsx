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
  stopLabel?: string;
};

function statusLabel(state: LiveAudioCallState) {
  if (state.role === "owner") {
    if (state.status === "connected") return "Transmitindo ao anjo";
    if (state.status === "connecting") return "Chamando seu anjo";
    if (state.status === "reconnecting") return "Reconectando chamada";
    if (state.status === "failed") return "Chamada não entrou";
    if (state.status === "waiting") return "Aguardando o anjo";
    if (state.status === "ended") return "Chamada encerrada";
    return "Chamar anjo";
  }

  if (state.role === "angel") {
    if (state.status === "connected") return "Acompanhando SOS";
    if (state.status === "connecting") return "Entrando como anjo";
    if (state.status === "reconnecting") return "Reconectando chamada";
    if (state.status === "failed") return "Chamada não entrou";
    if (state.status === "waiting") return "Você é o anjo";
    if (state.status === "ended") return "Chamada encerrada";
    return "Atender como anjo";
  }

  if (state.status === "failed") return "Chamada não entrou";
  return "Chamada com anjo";
}

function roleBadgeLabel(role: LiveAudioCallState["role"]) {
  if (role === "owner") return "Você pediu ajuda";
  if (role === "angel") return "Você é o anjo";
  return "Chamada segura";
}

function videoLabel(role: LiveAudioCallState["role"]) {
  if (role === "owner") return "Anjo";
  if (role === "angel") return "Pessoa protegida";
  return "Imagem recebida";
}

function accentColor(status: LiveAudioCallState["status"]) {
  if (status === "connected") return theme.colors.secure;
  if (status === "reconnecting") return theme.colors.warning;
  if (status === "failed") return theme.colors.warning;
  return theme.colors.primary;
}

export function LiveAudioCallPanel({
  actionLabel,
  disabled = false,
  onPrimaryAction,
  onStop,
  state,
  stopLabel = "Sair da chamada"
}: LiveAudioCallPanelProps) {
  const active =
    state.status === "connected" ||
    state.status === "connecting" ||
    state.status === "reconnecting" ||
    state.status === "waiting";
  const accent = accentColor(state.status);
  const remoteStreamUrl = state.remoteStreamUrl ?? state.remoteStream?.toURL();

  return (
    <View style={[styles.panel, { borderColor: accent }]}>
      <View style={[styles.roleBadge, { borderColor: accent }]}>
        <Text style={[styles.roleBadgeText, { color: accent }]}>{roleBadgeLabel(state.role)}</Text>
      </View>
      <View style={styles.header}>
        <View style={[styles.iconSlot, { backgroundColor: `${accent}18` }]}>
          <Radio size={18} color={accent} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{statusLabel(state)}</Text>
          <Text style={styles.message}>{state.message}</Text>
        </View>
      </View>

      {remoteStreamUrl ? (
        <View style={styles.videoFrame}>
          <RTCView key={remoteStreamUrl} objectFit="cover" streamURL={remoteStreamUrl} style={styles.remoteVideo} />
          <Text style={styles.videoLabel}>{videoLabel(state.role)}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {active ? (
          <Pressable
            accessibilityLabel={stopLabel}
            accessibilityRole="button"
            onPress={onStop}
            style={({ pressed }) => [styles.stopActionFull, pressed && styles.actionPressed]}
          >
            <PhoneOff size={17} color={theme.colors.danger} />
            <Text style={styles.stopActionText}>{stopLabel}</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
            disabled={disabled}
            onPress={onPrimaryAction}
            style={({ pressed }) => [
              styles.primaryAction,
              disabled && styles.actionDisabled,
              pressed && styles.actionPressed
            ]}
          >
            <Video size={17} color={theme.colors.textOnDark} />
            <Text style={styles.primaryActionText}>{actionLabel}</Text>
          </Pressable>
        )}
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
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase"
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
  stopActionFull: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm
  },
  stopActionText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
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
