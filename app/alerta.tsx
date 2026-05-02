import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { PanicButton } from "@/components/PanicButton";

export default function AlertScreen() {
  return (
    <SafeScreen
      title="Alerta de teste"
      subtitle="Use esta area para validar gesto, cancelamento e estado sem enviar alerta real."
    >
      <StatusBanner
        tone="warning"
        title="Ambiente de validacao"
        text="Este checkpoint nao transmite localizacao, midia ou alerta para terceiros."
      />
      <PanicButton
        label="Segurar para teste"
        holdMs={2200}
        onTrigger={() => {}}
      />
    </SafeScreen>
  );
}
