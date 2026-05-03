import { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Archive, Shield, Users, Settings, Radio, PhoneCall, LockKeyhole, X } from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { ButtonIcon } from "@/components/ButtonIcon";
import { EmergencyCallButton } from "@/components/EmergencyCallButton";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { countPendingEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import {
  finishEmergencyPackage,
  finishExpiredActiveEmergencyPackage,
  getActiveEmergencyPackage,
  startEmergencyPackage
} from "@/features/emergency/emergencyRecorder";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishConfirmationOpen, setFinishConfirmationOpen] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [recordingStatus, setRecordingStatus] = useState(
    "Pronto para gravar pacote local de teste com horario, consentimento e localizacao pontual. Envio externo bloqueado."
  );

  async function refreshOutboxCount() {
    await finishExpiredActiveEmergencyPackage();
    const activePackage = await getActiveEmergencyPackage();
    setActivePackageId(activePackage?.id ?? null);
    setOutboxCount(await countPendingEmergencyPackages());
  }

  useFocusEffect(
    useCallback(() => {
      async function prepareScreen() {
        const nextPreferences = await getEmergencyPreferences();
        setPreferences(nextPreferences);
        await refreshOutboxCount();
      }

      void prepareScreen();
    }, [])
  );

  useEffect(() => {
    if (!activePackageId) return;

    const timer = setTimeout(() => {
      void finishEmergencyPackage(activePackageId, "default_duration_elapsed").then(async (result) => {
        if (!result) return;
        setRecordingStatus(
          `Chamado ${result.packageRecord.id.slice(0, 8)} finalizado pelo tempo padrao e preservado somente no cofre local.`
        );
        await refreshOutboxCount();
      });
    }, preferences.defaultDurationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [activePackageId, preferences.defaultDurationSeconds]);

  async function handlePanicTrigger() {
    if (activePackageId) {
      requestFinishActiveCall();
      return;
    }

    setRecordingStatus("Iniciando chamado local e capturando localizacao pontual...");

    const result = await startEmergencyPackage({
      kind: "test",
      trustedContactIds: [],
      defaultDurationSeconds: preferences.defaultDurationSeconds,
      locationConsentMode:
        preferences.locationMode === "foreground_pre_authorized"
          ? "foreground_pre_authorized"
          : "foreground_when_triggered"
    });
    await refreshOutboxCount();

    const locationText =
      result.packageRecord.location.status === "captured"
        ? "localizacao registrada"
        : `localizacao ${result.packageRecord.location.status}`;

    setRecordingStatus(
      `Chamado ${result.packageRecord.id.slice(0, 8)} ativo por ate ${formatDuration(preferences.defaultDurationSeconds)}; ${locationText}; envio externo so podera ocorrer apos backend, autorizacao e revisao juridica.`
    );
  }

  function requestFinishActiveCall() {
    if (!activePackageId) return;

    setFinishError("");
    setFinishCodeInput("");

    if (preferences.finishSafety.requireCode) {
      setFinishConfirmationOpen(true);
      return;
    }

    Alert.alert(
      "Encerrar chamado ativo?",
      "O pacote sera encerrado e preservado no cofre local deste dispositivo. Nenhuma evidencia sera apagada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Encerrar",
          style: "destructive",
          onPress: () => {
            void handleFinishActiveCall();
          }
        }
      ]
    );
  }

  async function handleFinishActiveCall() {
    if (!activePackageId) return;

    setRecordingStatus("Finalizando chamado local...");
    const result = await finishEmergencyPackage(activePackageId, "manual_finish");
    await refreshOutboxCount();

    if (!result) {
      setRecordingStatus("Nenhum chamado ativo encontrado para finalizar.");
      return;
    }

    setRecordingStatus(
      `Chamado ${result.packageRecord.id.slice(0, 8)} finalizado e preservado somente no cofre local deste dispositivo.`
    );
    setFinishConfirmationOpen(false);
    setFinishCodeInput("");
    setFinishError("");
  }

  async function confirmFinishWithCode() {
    if (!preferences.finishSafety.requireCode) {
      void handleFinishActiveCall();
      return;
    }

    const codeHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, finishCodeInput.trim());

    if (codeHash !== preferences.finishSafety.codeHash) {
      setFinishError("Codigo incorreto. O chamado continua ativo.");
      return;
    }

    void handleFinishActiveCall();
  }

  return (
    <SafeScreen
      title="SinalSeguro"
      subtitle="Rede de apoio discreta, consentida e em validacao controlada."
      footer="Em risco imediato, use os canais oficiais como 190 e 180."
      showBrand
    >
      <PanicButton
        active={Boolean(activePackageId)}
        label={activePackageId ? "Segurar para encerrar" : "Segurar para acionar"}
        holdMs={preferences.inAppHoldMs}
        onTrigger={handlePanicTrigger}
      />

      <View style={styles.shortcutGrid}>
        {preferences.emergencyPhoneCall.call190ShortcutEnabled ? (
          <EmergencyCallButton compact style={styles.shortcut} />
        ) : (
          <Link href="/configuracoes" asChild>
            <ButtonIcon
              icon={<PhoneCall size={18} color={theme.colors.primary} />}
              label="Ativar 190"
              style={styles.shortcut}
            />
          </Link>
        )}
        <Link href="/contatos" asChild>
          <ButtonIcon icon={<Users size={18} color={theme.colors.primary} />} label="Anjos" style={styles.shortcut} />
        </Link>
        <Link href="/arquivos" asChild>
          <ButtonIcon icon={<Archive size={18} color={theme.colors.primary} />} label="Cofre" style={styles.shortcut} />
        </Link>
        <Link href="/configuracoes" asChild>
          <ButtonIcon icon={<Settings size={18} color={theme.colors.primary} />} label="Config." style={styles.shortcut} />
        </Link>
      </View>

      <StatusBanner
        tone="secure"
        title="Modo discreto ativo"
        text="A tela inicial evita termos sensiveis e mostra apenas acoes essenciais."
      />

      <StatusBanner
        tone="warning"
        title={`Cofre local: ${outboxCount} pacote(s)`}
        text={recordingStatus}
      />

      <Link href="/alerta" asChild>
        <ButtonIcon icon={<Radio size={20} color={theme.colors.primary} />} label="Ver preparo de alerta" />
      </Link>
      <Link href="/onboarding" asChild>
        <ButtonIcon icon={<Shield size={20} color={theme.colors.primary} />} label="Revisar onboarding" />
      </Link>

      <Modal
        animationType="fade"
        onRequestClose={() => setFinishConfirmationOpen(false)}
        transparent
        visible={finishConfirmationOpen}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.finishModal}>
            <View style={styles.finishHeader}>
              <LockKeyhole size={22} color={theme.colors.primary} />
              <Text style={styles.finishTitle}>Confirmar encerramento</Text>
              <Pressable
                accessibilityLabel="Cancelar encerramento"
                accessibilityRole="button"
                onPress={() => setFinishConfirmationOpen(false)}
                style={styles.closeButton}
              >
                <X size={18} color={theme.colors.textMuted} />
              </Pressable>
            </View>
            <Text style={styles.finishText}>
              O codigo de seguranca impede encerramento nao autorizado caso outra pessoa tome o aparelho.
            </Text>
            <TextInput
              accessibilityLabel="Codigo para encerrar chamado"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={setFinishCodeInput}
              placeholder="Codigo de encerramento"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              style={styles.codeInput}
              value={finishCodeInput}
            />
            {finishError ? <Text style={styles.finishError}>{finishError}</Text> : null}
            <ButtonIcon
              icon={<LockKeyhole size={20} color={theme.colors.danger} />}
              label="Encerrar chamado"
              onPress={confirmFinishWithCode}
            />
            <ButtonIcon
              icon={<X size={20} color={theme.colors.primary} />}
              label="Manter ativo"
              onPress={() => setFinishConfirmationOpen(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  shortcut: {
    flexBasis: "48%",
    flexGrow: 1
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36
  },
  codeInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md
  },
  finishError: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 18
  },
  finishHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  finishModal: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    maxWidth: 420,
    padding: theme.spacing.lg,
    width: "100%"
  },
  finishText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  },
  finishTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(18, 10, 32, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xl
  }
});
