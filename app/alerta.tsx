import { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { Archive, Database, Square } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { countPendingEmergencyPackages, listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
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
import { getEmergencyDeliveryReadiness } from "@/services/emergencyDelivery";

export default function AlertScreen() {
  const [status, setStatus] = useState("Nenhum novo pacote gravado nesta tela.");
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);

  async function refreshOutboxCount() {
    await finishExpiredActiveEmergencyPackage();
    const activePackage = await getActiveEmergencyPackage();
    setActivePackageId(activePackage?.id ?? null);
    setOutboxCount(await countPendingEmergencyPackages());
  }

  useFocusEffect(
    useCallback(() => {
      async function prepareScreen() {
        setPreferences(await getEmergencyPreferences());
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
        setStatus(`Chamado ${result.packageRecord.id.slice(0, 8)} finalizado pelo tempo padrao e preservado somente no cofre local.`);
        await refreshOutboxCount();
      });
    }, preferences.defaultDurationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [activePackageId, preferences.defaultDurationSeconds]);

  async function handleTestTrigger() {
    if (activePackageId) {
      setStatus("Ja existe um chamado local ativo. Finalize antes de iniciar outro teste.");
      return;
    }

    setStatus("Iniciando chamado local de teste...");
    const result = await startEmergencyPackage({
      kind: "test",
      defaultDurationSeconds: preferences.defaultDurationSeconds,
      locationConsentMode:
        preferences.locationMode === "foreground_pre_authorized"
          ? "foreground_pre_authorized"
          : "foreground_when_triggered"
    });
    const readiness = getEmergencyDeliveryReadiness(result.packageRecord);
    await refreshOutboxCount();
    setStatus(
      `${readiness.reason} Chamado ativo por ate ${formatDuration(preferences.defaultDurationSeconds)}. Hash ${result.packageRecord.integrity.sha256.slice(0, 12)} registrado.`
    );
  }

  async function handleFinishActiveCall() {
    if (!activePackageId) return;

    setStatus("Finalizando chamado local...");
    const result = await finishEmergencyPackage(activePackageId, "manual_finish");
    await refreshOutboxCount();

    if (!result) {
      setStatus("Nenhum chamado ativo encontrado.");
      return;
    }

    setStatus(`Chamado ${result.packageRecord.id.slice(0, 8)} finalizado manualmente e preservado em cofre local.`);
  }

  async function inspectLastPackage() {
    const packages = await listEmergencyPackages();
    const lastPackage = packages[0];
    if (!lastPackage) {
      setStatus("Cofre local vazio.");
      return;
    }

    setStatus(
      `Ultimo pacote ${lastPackage.id.slice(0, 8)}: localizacao ${lastPackage.location.status}; envio externo bloqueado neste build.`
    );
  }

  return (
    <SafeScreen
      title="Alerta de teste"
      subtitle="Use esta area para validar gesto, gravacao local, georreferencia e preparo de entrega sem enviar alerta real."
    >
      <StatusBanner
        tone="warning"
        title="Ambiente de validacao"
        text="Este checkpoint grava metadados e localizacao pontual autorizada em cofre local. Midia real e transmissao seguem bloqueadas."
      />
      <StatusBanner
        tone="secure"
        title={`Pacotes pendentes: ${outboxCount}`}
        text={status}
      />
      <PanicButton
        label="Segurar para teste"
        holdMs={2200}
        onTrigger={handleTestTrigger}
      />
      {activePackageId ? (
        <ButtonIcon
          icon={<Square size={20} color={theme.colors.danger} />}
          label="Finalizar chamado ativo"
          onPress={handleFinishActiveCall}
        />
      ) : null}
      <ButtonIcon
        icon={<Database size={20} color={theme.colors.primary} />}
        label="Inspecionar ultimo pacote"
        onPress={inspectLastPackage}
      />
      <Link href="/arquivos" asChild>
        <ButtonIcon icon={<Archive size={20} color={theme.colors.primary} />} label="Abrir arquivos locais" />
      </Link>
    </SafeScreen>
  );
}
