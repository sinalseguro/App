import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { EmergencyPackageCard } from "@/components/EmergencyPackageCard";
import { EvidencePlayerCard } from "@/components/EvidencePlayerCard";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { finishEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { EmergencyPackage } from "@/features/emergency/types";

export default function LocalFilesScreen() {
  const [packages, setPackages] = useState<EmergencyPackage[]>([]);
  const [status, setStatus] = useState("Carregando pacotes locais...");

  async function refreshPackages() {
    const records = await listEmergencyPackages();
    setPackages(records);
    setStatus(
      records.length
        ? "Cofre local carregado. Envio, compartilhamento e player real exigem autorizacao, backend e criptografia ativos."
        : "Nenhum pacote local gravado neste dispositivo."
    );
  }

  useEffect(() => {
    void refreshPackages();
  }, []);

  async function finishPackage(packageId: string) {
    await finishEmergencyPackage(packageId, "manual_finish");
    await refreshPackages();
  }

  return (
    <SafeScreen
      title="Cofre local"
      subtitle="Pacotes preservados neste dispositivo para revisao e envio futuro autorizado."
    >
      <StatusBanner tone="secure" title={`Pacotes gravados: ${packages.length}`} text={status} />
      <StatusBanner
        tone="warning"
        title="Protecao dos dados"
        text="Coordenadas completas e midia real exigem autenticacao forte, contrato eletronico e acesso auditado. Esta tela mostra apenas previa segura."
      />
      <EvidencePlayerCard packageRecord={packages[0]} />
      <ButtonIcon
        icon={<RefreshCw size={20} color={theme.colors.primary} />}
        label="Atualizar lista"
        onPress={refreshPackages}
      />
      {packages.map((packageRecord) => (
        <EmergencyPackageCard key={packageRecord.id} packageRecord={packageRecord} onFinish={finishPackage} />
      ))}
    </SafeScreen>
  );
}
