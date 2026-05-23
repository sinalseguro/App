import { AppTopBar } from "@/components/AppTopBar";
import { resolveEmergencyTopBarPresentation } from "./emergencyTopBarPresentationPolicy";

type EmergencyTopBarProps = {
  active: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function EmergencyTopBar({ active, menuOpen, onToggleMenu }: EmergencyTopBarProps) {
  const presentation = resolveEmergencyTopBarPresentation(active);

  return (
    <AppTopBar
      contextLabel={presentation.contextLabel}
      menuIcon={presentation.menuIcon}
      menuOpen={menuOpen}
      onMenuPress={onToggleMenu}
      showMenu={presentation.showMenu}
    />
  );
}
