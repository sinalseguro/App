import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Archive, Database } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { countPendingEmergencyPackages, listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { recordEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { getEmergencyDeliveryReadiness } from "@/services/emergencyDelivery";

export default function AlertScreen() {
  const [status, setStatus] = useState("Nenhum novo pacote gravado nesta tela.");
  const [outboxCount, setOutboxCount] = useState(0);

  async function refreshOutboxCount() {
    setOutboxCount(await countPendingEmergencyPackages());
  }

  useEffect(() => {
    void refreshOutboxCount();
  }, []);

  async function handleTestTrigger() {
    setStatus("Gravando pacote tecnico local...");
    const result = await recordEmergencyPackage({ kind: "test" });
    const readiness = getEmergencyDeliveryReadiness(result.packageRecord);
    await refreshOutboxCount();
    setStatus(`${readiness.reason} Hash ${result.packageRecord.integrity.sha256.slice(0, 12)} registrado.`);
  }

  async function inspectLastPackage() {
    const packages = await listEmergencyPackages();
    const lastPackage = packages[0];
    if (!lastPackage) {
      setStatus("Outbox local vazia.");
      return;
    }

    setStatus(
      `Ultimo pacote ${lastPackage.id.slice(0, 8)}: ${lastPackage.location.status}, API ${lastPackage.deliveryPlan.api.status}, P2P ${lastPackage.deliveryPlan.p2p.status}.`
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
