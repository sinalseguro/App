import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { EmergencyPackageCard } from "@/components/EmergencyPackageCard";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { listEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { EmergencyPackage } from "@/features/emergency/types";

export default function LocalFilesScreen() {
  const [packages, setPackages] = useState<EmergencyPackage[]>([]);
  const [status, setStatus] = useState("Carregando pacotes locais...");

  async function refreshPackages() {
    const records = await listEmergencyPackages();
    setPackages(records);
    setStatus(
      records.length
        ? "Pacotes locais carregados. Eles serao enviados somente quando backend/P2P estiverem prontos e autorizados."
        : "Nenhum pacote local gravado neste dispositivo."
    );
  }

  useEffect(() => {
    void refreshPackages();
  }, []);

  return (
    <SafeScreen
      title="Arquivos locais"
      subtitle="Pacotes gravados neste dispositivo para envio futuro via API ou P2P autorizado."
    >
      <StatusBanner tone="secure" title={`Pacotes gravados: ${packages.length}`} text={status} />
      <StatusBanner
        tone="warning"
        title="Protecao dos dados"
        text="Coordenadas completas ficam preservadas no cofre local e nao sao exibidas sem autenticacao forte. Esta tela mostra status, horario, hash e plano de envio."
      />
      <ButtonIcon
        icon={<RefreshCw size={20} color={theme.colors.primary} />}
        label="Atualizar lista"
        onPress={refreshPackages}
      />
      {packages.map((packageRecord) => (
        <EmergencyPackageCard key={packageRecord.id} packageRecord={packageRecord} />
      ))}
    </SafeScreen>
  );
}
