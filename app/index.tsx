import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Archive, Shield, Users, Settings, Radio } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { ButtonIcon } from "@/components/ButtonIcon";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { countPendingEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { recordEmergencyPackage } from "@/features/emergency/emergencyRecorder";
import { trustedContactsMock } from "@/features/contacts/contactMocks";

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState(
    "Pronto para gravar pacote local de teste com horario, consentimento, localizacao pontual e plano de entrega."
  );

  async function refreshOutboxCount() {
    setOutboxCount(await countPendingEmergencyPackages());
  }

  useEffect(() => {
    void refreshOutboxCount();
  }, []);

  async function handlePanicTrigger() {
    setRecordingStatus("Gravando pacote local e solicitando localizacao pontual...");

    const acceptedContactIds = trustedContactsMock
      .filter((contact) => contact.status === "aceito")
      .map((contact) => contact.id);
    const result = await recordEmergencyPackage({
      kind: "test",
      trustedContactIds: acceptedContactIds
    });
    await refreshOutboxCount();

    const locationText =
      result.packageRecord.location.status === "captured"
        ? "localizacao registrada"
        : `localizacao ${result.packageRecord.location.status}`;

    setRecordingStatus(
      `Pacote ${result.packageRecord.id.slice(0, 8)} gravado em cofre local; ${locationText}; API e P2P aguardando adaptadores.`
    );
  }

  return (
    <SafeScreen
      title="SinalSeguro"
      subtitle="Rede de apoio discreta, consentida e em validacao controlada."
      footer="Em risco imediato, use os canais oficiais como 190 e 180."
      showBrand
    >
      <StatusBanner
        tone="secure"
        title="Modo discreto ativo"
        text="Esta tela evita termos sensiveis e nao envia dados sem consentimento."
      />

      <StatusBanner
        tone="warning"
        title={`Outbox local: ${outboxCount} pacote(s)`}
        text={recordingStatus}
      />

      <PanicButton
        label="Segurar para simular alerta"
        holdMs={1800}
        onTrigger={handlePanicTrigger}
      />

      <Link href="/alerta" asChild>
        <ButtonIcon icon={<Radio size={20} color={theme.colors.primary} />} label="Ver preparo de alerta" />
      </Link>
      <Link href="/arquivos" asChild>
        <ButtonIcon icon={<Archive size={20} color={theme.colors.primary} />} label="Arquivos locais" />
      </Link>
      <Link href="/onboarding" asChild>
        <ButtonIcon icon={<Shield size={20} color={theme.colors.primary} />} label="Revisar onboarding" />
      </Link>
      <Link href="/contatos" asChild>
        <ButtonIcon icon={<Users size={20} color={theme.colors.primary} />} label="Rede de anjos" />
      </Link>
      <Link href="/configuracoes" asChild>
        <ButtonIcon icon={<Settings size={20} color={theme.colors.primary} />} label="Configuracoes" />
      </Link>
    </SafeScreen>
  );
}
