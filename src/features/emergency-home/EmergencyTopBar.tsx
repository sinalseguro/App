import { AppTopBar } from "@/components/AppTopBar";

type EmergencyTopBarProps = {
  active: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function EmergencyTopBar({ active, menuOpen, onToggleMenu }: EmergencyTopBarProps) {
  return (
    <AppTopBar
      contextLabel={active ? "Chamado ativo" : "Modo discreto"}
      menuIcon="settings"
      menuOpen={menuOpen}
      onMenuPress={onToggleMenu}
      showMenu
    />
  );
}
