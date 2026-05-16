import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BellRing, CheckCircle2, RefreshCw, ShieldAlert, XCircle } from "lucide-react-native";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";
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

function phaseLabel(session: ApiEmergencySession) {
  const recipientStatus = session.recipients?.find((recipient) => recipient.emergency_session === session.id)?.status;
  if (recipientStatus === "accepted") return "Você aceitou acompanhar";
  if (recipientStatus === "declined") return "Você recusou";
  if (recipientStatus === "ended") return "Encerrado";
  if (recipientStatus === "seen") return "Visualizado";
  if (session.phase === "accepted") return "Atendimento aceito";
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

  const sortedAlerts = useMemo(() => sortAlerts(alerts), [alerts]);

  async function refreshAlerts(nextStatus?: string) {
    setRefreshing(true);
    try {
      const receivedAlerts = await apiClient.listReceivedEmergencySessions();
      setAlerts(receivedAlerts);
      setStatus(nextStatus ?? (receivedAlerts.length ? "Pedidos atualizados." : "Nenhum pedido recebido agora."));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível atualizar os pedidos.");
    } finally {
      setRefreshing(false);
    }
  }

  async function respondToAlert(session: ApiEmergencySession, action: "accept" | "decline" | "seen") {
    const actionLabel = action === "accept" ? "aceito" : action === "decline" ? "recusado" : "visualizado";
    try {
      const updatedSession = await apiClient.respondToEmergencySession(session.id, action);
      setAlerts((currentAlerts) =>
        currentAlerts.map((item) => (item.id === updatedSession.id ? updatedSession : item))
      );
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
  }, []);

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

                <Text style={styles.alertStatus}>{phaseLabel(session)}</Text>
                <Text style={styles.alertBody}>
                  O app registra apenas o pedido autorizado. Ainda não envia mídia, localização ao vivo ou chamada.
                </Text>

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
                    disabled={!isActive}
                    onPress={() => {
                      void respondToAlert(session, "accept");
                    }}
                    style={({ pressed }) => [
                      styles.primaryAction,
                      !isActive && styles.actionDisabled,
                      pressed && styles.actionPressed
                    ]}
                  >
                    <CheckCircle2 size={18} color={theme.colors.textOnDark} />
                    <Text style={styles.primaryActionText}>Acompanhar</Text>
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
