import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BellRing, CheckCircle2, RefreshCw, ShieldAlert, Video, XCircle } from "lucide-react-native";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";
import { LiveAudioCallPanel } from "@/features/live-call/LiveAudioCallPanel";
import { useLiveAudioCall } from "@/features/live-call/useLiveAudioCall";
import { ApiEmergencySession, apiClient } from "@/services/apiClient";

type AlertDialog = {
  actions: BrandedDialogAction[];
  message: string;
  title: string;
};

function formatAlertDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

function currentRecipientStatus(session: ApiEmergencySession) {
  if (session.current_recipient_status) return session.current_recipient_status;

  const recipients = session.recipients ?? [];
  if (recipients.length === 1) return recipients[0]?.status;
  return undefined;
}

function phaseLabel(session: ApiEmergencySession, recipientStatus?: string, acceptedByCurrentUser = false) {
  if (acceptedByCurrentUser) return "Você aceitou acompanhar";
  if (recipientStatus === "accepted") return "Você aceitou acompanhar";
  if (recipientStatus === "declined") return "Você recusou";
  if (recipientStatus === "ended") return "Encerrado";
  if (recipientStatus === "seen") return "Visualizado";
  if (session.phase === "accepted") return "Atendimento em andamento";
  if (session.phase === "ended" || session.status !== "active") return "Encerrado";
  return "Novo pedido de apoio";
}

function sortAlerts(alerts: ApiEmergencySession[]) {
  return [...alerts].sort((left, right) => new Date(right.started_at).getTime() - new Date(left.started_at).getTime());
}

export default function AlertScreen() {
  const [alerts, setAlerts] = useState<ApiEmergencySession[]>([]);
  const [status, setStatus] = useState("Carregando pedidos recebidos...");
  const [refreshing, setRefreshing] = useState(false);
  const [dialog, setDialog] = useState<AlertDialog | null>(null);
  const [locallyAcceptedSessionIds, setLocallyAcceptedSessionIds] = useState<Set<string>>(() => new Set());
  const liveAudioCall = useLiveAudioCall();

  const sortedAlerts = useMemo(() => sortAlerts(alerts), [alerts]);

  const refreshAlerts = useCallback(async (nextStatus?: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setRefreshing(true);
    }
    try {
      const receivedAlerts = await apiClient.listReceivedEmergencySessions();
      setAlerts(receivedAlerts);
      setStatus(nextStatus ?? (receivedAlerts.length ? "Pedidos atualizados." : "Nenhum pedido recebido agora."));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível atualizar os pedidos.");
    } finally {
      if (!options?.silent) {
        setRefreshing(false);
      }
    }
  }, []);

  async function respondToAlert(session: ApiEmergencySession, action: "accept" | "decline" | "seen") {
    const actionLabel = action === "accept" ? "aceito" : action === "decline" ? "recusado" : "visualizado";
    try {
      const updatedSession = await apiClient.respondToEmergencySession(session.id, action);
      setAlerts((currentAlerts) =>
        currentAlerts.map((item) => (item.id === updatedSession.id ? updatedSession : item))
      );
      setLocallyAcceptedSessionIds((current) => {
        const next = new Set(current);
        if (action === "accept") {
          next.add(session.id);
        } else if (action === "decline") {
          next.delete(session.id);
        }
        return next;
      });
      setStatus(`Pedido ${actionLabel}.`);
    } catch (error) {
      setDialog({
        title: "Pedido não atualizado",
        message: error instanceof Error ? error.message : "Tente novamente quando houver conexão.",
        actions: [{ label: "Entendi" }]
      });
    }
  }

  useEffect(() => {
    void refreshAlerts();
    const refreshTimer = setInterval(() => {
      void refreshAlerts(undefined, { silent: true });
    }, 8000);
    return () => clearInterval(refreshTimer);
  }, [refreshAlerts]);

  return (
    <SafeScreen
      title="Alertas recebidos"
      subtitle="Quando você for anjo de alguém, os pedidos autorizados aparecem aqui."
      showBack
    >
      <View style={styles.statusRow}>
        <View style={styles.statusIcon}>
          <BellRing size={18} color={theme.colors.primary} />
        </View>
        <Text style={styles.statusText}>{status}</Text>
        <Pressable
          accessibilityLabel="Atualizar alertas recebidos"
          accessibilityRole="button"
          disabled={refreshing}
          onPress={() => {
            void refreshAlerts();
          }}
          style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshButtonPressed]}
        >
          <RefreshCw size={18} color={theme.colors.textOnDark} />
        </Pressable>
      </View>

      {sortedAlerts.length ? (
        <View style={styles.alertStack}>
          {sortedAlerts.map((session) => {
            const isActive = session.status === "active" && session.phase !== "ended";
            const recipientStatus = currentRecipientStatus(session);
            const hasAccepted = recipientStatus === "accepted" || locallyAcceptedSessionIds.has(session.id);
            const canEnterCall = isActive && hasAccepted;
            const isCallPanelSession = liveAudioCall.state.remoteSessionId === session.id;
            const hasOtherCallSession = Boolean(liveAudioCall.state.remoteSessionId) && !isCallPanelSession;
            return (
              <View key={session.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIcon}>
                    <ShieldAlert size={19} color={isActive ? theme.colors.danger : theme.colors.secure} />
                  </View>
                  <View style={styles.alertTitleBlock}>
                    <Text style={styles.alertTitle}>Pedido de {session.owner_display_name ?? "pessoa protegida"}</Text>
                    <Text style={styles.alertMeta}>{formatAlertDate(session.started_at)}</Text>
                  </View>
                </View>

                <Text style={styles.alertStatus}>{phaseLabel(session, recipientStatus, hasAccepted)}</Text>
                <Text style={styles.alertBody}>
                  O app registra o pedido autorizado. Sua voz só inicia quando você tocar em entrar.
                </Text>

                {canEnterCall && !isCallPanelSession ? (
                  <View style={styles.callPromptPanel}>
                    <View style={styles.callPromptHeader}>
                      <View style={styles.callPromptIcon}>
                        <Video size={18} color={theme.colors.primary} />
                      </View>
                      <View style={styles.callPromptTextBlock}>
                        <Text style={styles.callPromptTitle}>Videochamada com anjo</Text>
                        <Text style={styles.callPromptText}>Toque para abrir a videochamada segura deste pedido.</Text>
                      </View>
                    </View>
                    <Pressable
                      accessibilityLabel="Entrar na videochamada"
                      accessibilityRole="button"
                      disabled={hasOtherCallSession}
                      onPress={() => {
                        void liveAudioCall.startAngelAudioCall(session);
                      }}
                      style={({ pressed }) => [
                        styles.callPrimaryAction,
                        hasOtherCallSession && styles.actionDisabled,
                        pressed && styles.actionPressed
                      ]}
                    >
                      <Video size={18} color={theme.colors.textOnDark} />
                      <Text style={styles.callPrimaryActionText}>Entrar na videochamada</Text>
                    </Pressable>
                  </View>
                ) : null}

                {isCallPanelSession ? (
                  <LiveAudioCallPanel
                    actionLabel="Entrar na videochamada"
                    disabled={!canEnterCall || hasOtherCallSession}
                    onPrimaryAction={() => {
                      void liveAudioCall.startAngelAudioCall(session);
                    }}
                    onStop={liveAudioCall.stopLiveAudioCall}
                    state={liveAudioCall.state}
                  />
                ) : null}

                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityLabel="Avisar que estou ciente"
                    accessibilityRole="button"
                    onPress={() => {
                      void respondToAlert(session, "seen");
                    }}
                    style={({ pressed }) => [styles.mutedAction, pressed && styles.actionPressed]}
                  >
                    <Text style={styles.mutedActionText}>Estou ciente</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Recusar pedido"
                    accessibilityRole="button"
                    onPress={() => {
                      void respondToAlert(session, "decline");
                    }}
                    style={({ pressed }) => [styles.iconAction, pressed && styles.actionPressed]}
                  >
                    <XCircle size={18} color={theme.colors.danger} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Aceitar acompanhar"
                    accessibilityRole="button"
                    disabled={!isActive || hasAccepted}
                    onPress={() => {
                      void respondToAlert(session, "accept");
                    }}
                    style={({ pressed }) => [
                      styles.primaryAction,
                      (!isActive || hasAccepted) && styles.actionDisabled,
                      pressed && styles.actionPressed
                    ]}
                  >
                    <CheckCircle2 size={18} color={theme.colors.textOnDark} />
                    <Text style={styles.primaryActionText}>{hasAccepted ? "Acompanhando" : "Acompanhar"}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <ShieldAlert size={22} color={theme.colors.primary} />
          <Text style={styles.emptyTitle}>Sem pedidos recebidos</Text>
          <Text style={styles.emptyText}>Quando alguém que autorizou você acionar SOS, o pedido aparecerá aqui.</Text>
        </View>
      )}

      <BrandedDialog
        actions={dialog?.actions ?? []}
        icon={<ShieldAlert size={18} color={theme.colors.primary} />}
        message={dialog?.message ?? ""}
        onClose={() => setDialog(null)}
        title={dialog?.title ?? ""}
        visible={Boolean(dialog)}
      />
    </SafeScreen>
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
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  alertBody: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 20
  },
  alertCard: {
    ...theme.buttonSurface,
    alignItems: "stretch",
    gap: theme.spacing.md,
    padding: theme.spacing.md
  },
  alertHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  alertIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  alertMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700"
  },
  alertStack: {
    gap: theme.spacing.md
  },
  alertStatus: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21
  },
  alertTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
  },
  alertTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  callPrimaryAction: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  callPrimaryActionText: {
    color: theme.colors.textOnDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  callPromptHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  callPromptIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  callPromptPanel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow
  },
  callPromptText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  callPromptTextBlock: {
    flex: 1,
    minWidth: 0
  },
  callPromptTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  emptyCard: {
    ...theme.buttonSurface,
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 20,
    textAlign: "center"
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  iconAction: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 48
  },
  mutedAction: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.sm
  },
  mutedActionText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.sm
  },
  primaryActionText: {
    color: theme.colors.textOnDark,
    fontSize: 13,
    fontWeight: "900"
  },
  refreshButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    height: 42,
    justifyContent: "center",
    width: 44
  },
  refreshButtonPressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }]
  },
  statusIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  statusRow: {
    alignItems: "center",
    ...theme.buttonSurface,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 62,
    padding: theme.spacing.sm
  },
  statusText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 19
  }
});
