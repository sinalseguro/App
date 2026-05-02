import { PermissionGate } from "@/components/PermissionGate";
import { SafeScreen } from "@/components/SafeScreen";

export default function SettingsScreen() {
  return (
    <SafeScreen
      title="Configuracoes"
      subtitle="Permissoes sao incrementais, explicadas e revogaveis."
    >
      <PermissionGate
        title="Localizacao pontual"
        text="Usada somente quando voce autorizar o envio em um alerta."
        status="pendente"
      />
      <PermissionGate
        title="Notificacoes discretas"
        text="Usadas para confirmar estados e avisar anjos sem expor dados sensiveis."
        status="pendente"
      />
      <PermissionGate
        title="Midia homologada"
        text="Bloqueada para producao publica ate RIPD/DPIA e revisao juridica."
        status="bloqueado"
      />
    </SafeScreen>
  );
}
