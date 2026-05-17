import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  FileText,
  PhoneCall,
  PhoneIncoming,
  RefreshCw,
  Share2,
  ShieldAlert,
  Video
} from "lucide-react-native";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";
import { LiveAudioCallPanel } from "@/features/live-call/LiveAudioCallPanel";
import {
  beginReceivedLiveCallArchive,
  buildLiveCallShareText,
  formatLiveCallDate,
  formatLiveCallDuration,
  listReceivedLiveCallArchives,
  updateReceivedLiveCallArchive,
  type LiveCallArchiveRecord
} from "@/features/live-call/liveCallHistory";
import { notifyIncomingEmergency } from "@/features/live-call/incomingEmergencyNotification";
import {
  canAngelAutoAcceptIncomingEmergency,
  currentEmergencyRecipientStatus
} from "@/features/live-call/liveCallRolePolicy";
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

function phaseLabel(session: ApiEmergencySession, recipientStatus?: string, acceptedByCurrentUser = false) {
  if (acceptedByCurrentUser) return "Você está atendendo como anjo";
  if (recipientStatus === "accepted") return "Você está atendendo como anjo";
  if (recipientStatus === "declined") return "Você recusou";
  if (recipientStatus === "ended") return "Encerrado";
  if (recipientStatus === "seen") return "Visualizado";
  if (session.phase === "accepted") return "Atendimento em andamento";
  if (session.phase === "ended" || session.status !== "active") return "Encerrado";
  return "Pedido de ajuda";
}

function sortAlerts(alerts: ApiEmergencySession[]) {
  return [...alerts].sort((left, right) => new Date(right.started_at).getTime() - new Date(left.started_at).getTime());
}

function archiveStatusLabel(status: LiveCallArchiveRecord["status"]) {
  if (status === "connected") return "ao vivo conectado";
  if (status === "ended") return "finalizado";
  if (status === "failed") return "chamada indisponível";
  return "registro ativo";
}

export default function AlertScreen() {
  const [alerts, setAlerts] = useState<ApiEmergencySession[]>([]);
  const [status, setStatus] = useState("Carregando pedidos recebidos...");
  const [refreshing, setRefreshing] = useState(false);
  const [dialog, setDialog] = useState<AlertDialog | null>(null);
  const [locallyAcceptedSessionIds, setLocallyAcceptedSessionIds] = useState<Set<string>>(() => new Set());
  const [callArchiveRecords, setCallArchiveRecords] = useState<LiveCallArchiveRecord[]>([]);
  const [selectedArchiveRecord, setSelectedArchiveRecord] = useState<LiveCallArchiveRecord | null>(null);
  const activeCallArchiveIdRef = useRef<string | null>(null);
  const autoAcceptingSessionIdsRef = useRef<Set<string>>(new Set());
  const autoRealtimeSessionIdsRef = useRef<Set<string>>(new Set());
  const archivedSessionIdsRef = useRef<Set<string>>(new Set());
  const lastArchivedCallStatusRef = useRef<string | null>(null);
  const liveAudioCall = useLiveAudioCall();
  const liveAudioCallStateRef = useRef(liveAudioCall.state);

  const sortedAlerts = useMemo(() => sortAlerts(alerts), [alerts]);

  const loadCallArchives = useCallback(async () => {
    const records = await listReceivedLiveCallArchives();
    setCallArchiveRecords(records);
  }, []);

  const refreshAlerts = useCallback(async (nextStatus?: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setRefreshing(true);
    }
    try {
      const receivedAlerts = await apiClient.listReceivedEmergencySessions();
      setAlerts(receivedAlerts);
      setStatus(nextStatus ?? (receivedAlerts.length ? "Pedidos atualizados." : "Nenhum pedido recebido agora."));
    } catch (error) {
      const currentCallState = liveAudioCallStateRef.current;
      const activeLiveCall =
        currentCallState.role === "angel" &&
        (currentCallState.status === "waiting" ||
          currentCallState.status === "connecting" ||
          currentCallState.status === "connected");

      setStatus(
        activeLiveCall
          ? "Você está atendendo como anjo."
          : error instanceof Error
            ? error.message
            : "Não foi possível atualizar os pedidos."
      );
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
      return updatedSession;
    } catch (error) {
      setDialog({
        title: "Pedido não atualizado",
        message: error instanceof Error ? error.message : "Tente novamente quando houver conexão.",
        actions: [{ label: "Entendi" }]
      });
      return null;
    }
  }

  async function acceptAndSaveIncomingCall(
    session: ApiEmergencySession,
    alreadyAccepted: boolean,
    options?: { silentFailure?: boolean }
  ) {
    try {
      const acceptedSession = alreadyAccepted ? session : await respondToAlert(session, "accept");
      if (!acceptedSession) return;

      const archiveRecord = await beginReceivedLiveCallArchive(acceptedSession);
      archivedSessionIdsRef.current.add(acceptedSession.id);
      await loadCallArchives();
      setStatus("Você está atendendo como anjo.");
      return { archiveRecord, session: acceptedSession };
    } catch (error) {
      if (options?.silentFailure) {
        setStatus(error instanceof Error ? error.message : "Não foi possível registrar chamada recebida agora.");
        return null;
      }
      setDialog({
        title: "Chamada não registrada",
        message: error instanceof Error ? error.message : "Não foi possível salvar o registro local agora.",
        actions: [{ label: "Entendi" }]
      });
      return null;
    }
  }

  async function startRealtimeForAcceptedCall(session: ApiEmergencySession, archiveRecord: LiveCallArchiveRecord) {
    const currentCallState = liveAudioCallStateRef.current;
    const sameSessionActive =
      currentCallState.remoteSessionId === session.id &&
      (currentCallState.status === "waiting" ||
        currentCallState.status === "connecting" ||
        currentCallState.status === "connected");
    const otherSessionActive =
      Boolean(currentCallState.remoteSessionId) &&
      currentCallState.remoteSessionId !== session.id &&
      currentCallState.status !== "ended" &&
      currentCallState.status !== "failed";

    if (sameSessionActive || otherSessionActive) return;

    activeCallArchiveIdRef.current = archiveRecord.id;
    lastArchivedCallStatusRef.current = archiveRecord.status;
    setStatus("Você é o anjo. Aguardando chamada.");
    await liveAudioCall.startAngelAudioCall(session);
  }

  async function openRealtimeCall(session: ApiEmergencySession, alreadyAccepted: boolean) {
    try {
      const acceptedCall = await acceptAndSaveIncomingCall(session, alreadyAccepted);
      if (!acceptedCall) return;

      setStatus("Você é o anjo. Entrando na chamada.");
      await startRealtimeForAcceptedCall(acceptedCall.session, acceptedCall.archiveRecord);
    } catch (error) {
      setDialog({
        title: "Tempo real indisponível",
        message: error instanceof Error ? error.message : "Não foi possível abrir a videochamada agora. O registro local permanece salvo.",
        actions: [{ label: "Entendi" }]
      });
    }
  }

  function stopRealtimeCall() {
    liveAudioCall.stopLiveAudioCall();
    activeCallArchiveIdRef.current = null;
    lastArchivedCallStatusRef.current = null;
    setStatus("Você saiu da chamada. O pedido continua na tela ate o fim.");
  }

  async function shareArchiveRecord(record: LiveCallArchiveRecord) {
    await Share.share({ message: buildLiveCallShareText(record) });
  }

  useEffect(() => {
    liveAudioCallStateRef.current = liveAudioCall.state;
  }, [liveAudioCall.state]);

  useEffect(() => {
    void refreshAlerts();
    void loadCallArchives();
    const refreshTimer = setInterval(() => {
      void refreshAlerts(undefined, { silent: true });
    }, 8000);
    return () => clearInterval(refreshTimer);
  }, [loadCallArchives, refreshAlerts]);

  useEffect(() => {
    const archiveId = activeCallArchiveIdRef.current;
    if (!archiveId || liveAudioCall.state.role !== "angel") return;
    if (lastArchivedCallStatusRef.current === liveAudioCall.state.status) return;

    lastArchivedCallStatusRef.current = liveAudioCall.state.status;

    if (liveAudioCall.state.status === "connected") {
      void updateReceivedLiveCallArchive(archiveId, {
        connectedAt: new Date().toISOString(),
        status: "connected"
      }).then(() => loadCallArchives());
    }

    if (liveAudioCall.state.status === "failed") {
      void updateReceivedLiveCallArchive(archiveId, {
        status: "failed"
      }).then(() => {
        activeCallArchiveIdRef.current = null;
        void loadCallArchives();
      });
    }
  }, [liveAudioCall.state.role, liveAudioCall.state.status, loadCallArchives]);

  useEffect(() => {
    let cancelled = false;

    async function syncBackgroundArchives() {
      let changed = false;

      for (const session of alerts) {
        const recipientStatus = currentEmergencyRecipientStatus(session);
        const hasAccepted = recipientStatus === "accepted" || locallyAcceptedSessionIds.has(session.id);
        const isActive = session.status === "active" && session.phase !== "ended";
        const existingRecord = callArchiveRecords.find((record) => record.remoteSessionId === session.id);

        if (
          canAngelAutoAcceptIncomingEmergency(session) &&
          !hasAccepted &&
          !autoAcceptingSessionIdsRef.current.has(session.id)
        ) {
          autoAcceptingSessionIdsRef.current.add(session.id);
          await notifyIncomingEmergency(session).catch(() => null);
          const acceptedCall = await acceptAndSaveIncomingCall(session, false, { silentFailure: true });
          if (acceptedCall && !autoRealtimeSessionIdsRef.current.has(session.id)) {
            autoRealtimeSessionIdsRef.current.add(session.id);
            await startRealtimeForAcceptedCall(acceptedCall.session, acceptedCall.archiveRecord);
          }
          autoAcceptingSessionIdsRef.current.delete(session.id);
          continue;
        }

        if (
          hasAccepted &&
          isActive &&
          existingRecord &&
          !autoRealtimeSessionIdsRef.current.has(session.id)
        ) {
          autoRealtimeSessionIdsRef.current.add(session.id);
          await startRealtimeForAcceptedCall(session, existingRecord);
        }

        if (
          hasAccepted &&
          isActive &&
          !existingRecord &&
          !archivedSessionIdsRef.current.has(session.id)
        ) {
          const archiveRecord = await beginReceivedLiveCallArchive(session);
          archivedSessionIdsRef.current.add(session.id);
          changed = true;
          if (!autoRealtimeSessionIdsRef.current.has(session.id)) {
            autoRealtimeSessionIdsRef.current.add(session.id);
            await startRealtimeForAcceptedCall(session, archiveRecord);
          }
        }

        if (existingRecord && !isActive && existingRecord.status !== "ended") {
          await updateReceivedLiveCallArchive(existingRecord.id, {
            endedAt: session.finished_at ?? session.updated_at ?? new Date().toISOString(),
            status: "ended"
          });
          autoRealtimeSessionIdsRef.current.delete(session.id);
          changed = true;
        }
      }

      if (changed && !cancelled) {
        await loadCallArchives();
      }
    }

    void syncBackgroundArchives().catch(() => {
      for (const sessionId of autoAcceptingSessionIdsRef.current) {
        if (alerts.some((session) => session.id === sessionId)) {
          autoAcceptingSessionIdsRef.current.delete(sessionId);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [alerts, callArchiveRecords, loadCallArchives, locallyAcceptedSessionIds]);

  return (
    <SafeScreen
      title="Alertas recebidos"
      subtitle="Quando você for anjo de alguém, os pedidos aparecem aqui."
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
            const recipientStatus = currentEmergencyRecipientStatus(session);
            const hasAccepted = recipientStatus === "accepted" || locallyAcceptedSessionIds.has(session.id);
            const canEnterCall = isActive && hasAccepted;
            const canReceiveCall = isActive && recipientStatus !== "declined";
            const isCallPanelSession = liveAudioCall.state.remoteSessionId === session.id;
            const hasOtherCallSession = Boolean(liveAudioCall.state.remoteSessionId) && !isCallPanelSession;
            return (
              <View key={session.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIcon}>
                    <ShieldAlert size={19} color={isActive ? theme.colors.danger : theme.colors.secure} />
                  </View>
                  <View style={styles.alertTitleBlock}>
                    <Text style={styles.alertTitle}>Você é anjo de {session.owner_display_name ?? "pessoa protegida"}</Text>
                    <Text style={styles.alertMeta}>{formatAlertDate(session.started_at)}</Text>
                  </View>
                </View>

                <Text style={styles.alertStatus}>{phaseLabel(session, recipientStatus, hasAccepted)}</Text>
                <Text style={styles.alertBody}>
                  Toque em Atender para entrar como anjo. Você só fala quando entrar.
                </Text>

                {canReceiveCall && !isCallPanelSession ? (
                  <View style={styles.incomingCallPanel}>
                    <View style={styles.callPromptHeader}>
                      <View style={styles.incomingCallIcon}>
                        <PhoneIncoming size={19} color={theme.colors.textOnDark} />
                      </View>
                      <View style={styles.callPromptTextBlock}>
                        <Text style={styles.incomingCallTitle}>{hasAccepted ? "Você é o anjo" : "Atender como anjo"}</Text>
                        <Text style={styles.incomingCallText}>
                          {hasAccepted
                            ? "Entre na chamada se puder acompanhar agora."
                            : `${session.owner_display_name ?? "Pessoa protegida"} pediu ajuda.`}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.phoneActionRow}>
                      <Pressable
                        accessibilityLabel={hasAccepted ? "Entrar na chamada" : "Atender como anjo"}
                        accessibilityRole="button"
                        disabled={hasOtherCallSession}
                        onPress={() => {
                          if (hasAccepted) {
                            void openRealtimeCall(session, true);
                            return;
                          }
                          void acceptAndSaveIncomingCall(session, false);
                        }}
                        style={({ pressed }) => [
                          styles.answerCallAction,
                          hasOtherCallSession && styles.actionDisabled,
                          pressed && styles.actionPressed
                        ]}
                      >
                        {hasAccepted ? (
                          <Video size={18} color={theme.colors.textOnDark} />
                        ) : (
                          <PhoneCall size={18} color={theme.colors.textOnDark} />
                        )}
                        <Text style={styles.answerCallActionText}>
                          {hasAccepted ? "Entrar na chamada" : "Atender como anjo"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}

                {isCallPanelSession ? (
                  <LiveAudioCallPanel
                    actionLabel="Entrar como anjo"
                    disabled={!canEnterCall || hasOtherCallSession}
                    onPrimaryAction={() => {
                      void openRealtimeCall(session, hasAccepted);
                    }}
                    onStop={() => {
                      stopRealtimeCall();
                    }}
                    state={liveAudioCall.state}
                    stopLabel="Sair da chamada"
                  />
                ) : null}

                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityLabel="Avisar que estou ciente"
                    accessibilityRole="button"
                    disabled={!isActive || hasAccepted}
                    onPress={() => {
                      void respondToAlert(session, "seen");
                    }}
                    style={({ pressed }) => [
                      styles.mutedAction,
                      (!isActive || hasAccepted) && styles.actionDisabled,
                      pressed && styles.actionPressed
                    ]}
                  >
                    <Text style={styles.mutedActionText}>Estou ciente</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Aceitar acompanhar"
                    accessibilityRole="button"
                    disabled={!isActive || hasAccepted}
                    onPress={() => {
                      void acceptAndSaveIncomingCall(session, hasAccepted);
                    }}
                    style={({ pressed }) => [
                      styles.primaryAction,
                      (!isActive || hasAccepted) && styles.actionDisabled,
                      pressed && styles.actionPressed
                    ]}
                  >
                    <CheckCircle2 size={18} color={theme.colors.textOnDark} />
                    <Text style={styles.primaryActionText}>{hasAccepted ? "Atendendo" : "Atender como anjo"}</Text>
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

      {callArchiveRecords.length ? (
        <View style={styles.archiveSection}>
          <View style={styles.archiveHeader}>
            <View style={styles.statusIcon}>
              <FileText size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.alertTitleBlock}>
              <Text style={styles.archiveTitle}>Registros de chamados</Text>
              <Text style={styles.archiveSubtitle}>Registros locais por pessoa protegida, com snapshot e duração.</Text>
            </View>
          </View>
          {callArchiveRecords.map((record) => (
            <View key={record.id} style={styles.archiveCard}>
              <View style={styles.archiveSnapshotRow}>
                <View style={styles.snapshotThumb}>
                  <Text style={styles.snapshotThumbText}>{record.snapshot.label}</Text>
                </View>
                <View style={styles.alertTitleBlock}>
                  <Text style={styles.archiveRecordTitle}>{record.protectedDisplayName}</Text>
                  <Text style={styles.archiveRecordMeta}>{formatLiveCallDate(record.startedAt)}</Text>
                </View>
              </View>
              <View style={styles.archiveMetaGrid}>
                <View style={styles.archiveMetaItem}>
                  <Clock3 size={15} color={theme.colors.textMuted} />
                  <Text style={styles.archiveMetaText}>{formatLiveCallDuration(record.durationSeconds)}</Text>
                </View>
                <View style={styles.archiveMetaItem}>
                  <Video size={15} color={theme.colors.textMuted} />
                  <Text style={styles.archiveMetaText}>{archiveStatusLabel(record.status)}</Text>
                </View>
              </View>
              <Text style={styles.archiveLegalText}>{record.legal.shareRestriction}</Text>
              <View style={styles.actionRow}>
                <Pressable
                  accessibilityLabel="Abrir registro da chamada"
                  accessibilityRole="button"
                  onPress={() => setSelectedArchiveRecord(record)}
                  style={({ pressed }) => [styles.mutedAction, pressed && styles.actionPressed]}
                >
                  <Text style={styles.mutedActionText}>Abrir registro</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel="Compartilhar registro da chamada"
                  accessibilityRole="button"
                  onPress={() => {
                    void shareArchiveRecord(record);
                  }}
                  style={({ pressed }) => [styles.primaryAction, pressed && styles.actionPressed]}
                >
                  <Share2 size={17} color={theme.colors.textOnDark} />
                  <Text style={styles.primaryActionText}>Compartilhar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <BrandedDialog
        actions={dialog?.actions ?? []}
        icon={<ShieldAlert size={18} color={theme.colors.primary} />}
        message={dialog?.message ?? ""}
        onClose={() => setDialog(null)}
        title={dialog?.title ?? ""}
        visible={Boolean(dialog)}
      />
      <BrandedDialog
        actions={[
          { label: "Fechar", tone: "muted" },
          {
            label: "Compartilhar",
            onPress: () => {
              if (selectedArchiveRecord) {
                void shareArchiveRecord(selectedArchiveRecord);
              }
            }
          }
        ]}
        icon={<FileText size={18} color={theme.colors.primary} />}
        message={
          selectedArchiveRecord
            ? buildLiveCallShareText(selectedArchiveRecord)
            : ""
        }
        onClose={() => setSelectedArchiveRecord(null)}
        title="Registro da chamada"
        visible={Boolean(selectedArchiveRecord)}
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
  answerCallAction: {
    alignItems: "center",
    backgroundColor: theme.colors.secure,
    borderColor: theme.colors.secure,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1.2,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: theme.spacing.sm
  },
  answerCallActionText: {
    color: theme.colors.textOnDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  archiveCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow
  },
  archiveHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  archiveLegalText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  archiveMetaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  archiveMetaItem: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6
  },
  archiveMetaText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  archiveRecordMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  archiveRecordTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  archiveSection: {
    gap: theme.spacing.md
  },
  archiveSnapshotRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  archiveSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  archiveTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
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
  callPromptHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  callPromptTextBlock: {
    flex: 1,
    minWidth: 0
  },
  incomingCallIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.panic,
    borderRadius: theme.radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  incomingCallPanel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.panic,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadow
  },
  incomingCallText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 19
  },
  incomingCallTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21
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
  phoneActionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
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
  snapshotThumb: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  snapshotThumbText: {
    color: theme.colors.textOnDark,
    fontSize: 17,
    fontWeight: "900"
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
