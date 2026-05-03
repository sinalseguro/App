import { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Archive, Shield, Users, Settings, Radio, Square, PhoneCall } from "lucide-react-native";
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
      setRecordingStatus("Ja existe um chamado local ativo. Finalize o chamado atual antes de iniciar outro.");
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
  }

  return (
    <SafeScreen
      title="SinalSeguro"
      subtitle="Rede de apoio discreta, consentida e em validacao controlada."
      footer="Em risco imediato, use os canais oficiais como 190 e 180."
      showBrand
    >
      <PanicButton
        label="Segurar para acionar"
        holdMs={preferences.inAppHoldMs}
        onTrigger={handlePanicTrigger}
      />

      {activePackageId ? (
        <ButtonIcon
          icon={<Square size={20} color={theme.colors.danger} />}
          label="Finalizar chamado ativo"
          onPress={handleFinishActiveCall}
        />
      ) : null}

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
  }
});
