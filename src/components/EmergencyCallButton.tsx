import { useState } from "react";
import { Linking, StyleProp, ViewStyle } from "react-native";
import { PhoneCall } from "lucide-react-native";
import { BrandedDialog } from "@/components/BrandedDialog";
import { ButtonIcon } from "@/components/ButtonIcon";
import { theme } from "@/design/theme";

type EmergencyCallButtonProps = {
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmergencyCallButton({ compact = false, style }: EmergencyCallButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function confirmCall() {
    setConfirmOpen(true);
  }

  return (
    <>
      <ButtonIcon
        icon={<PhoneCall size={compact ? 18 : 20} color={theme.colors.primary} />}
        label="Ligar 190"
        onPress={confirmCall}
        style={style}
      />
      <BrandedDialog
        actions={[
          { label: "Cancelar", tone: "muted" },
          {
            label: "Ligar",
            onPress: () => {
              void Linking.openURL("tel:190");
            }
          }
        ]}
        icon={<PhoneCall size={18} color={theme.colors.primary} />}
        message="O 190 e o canal oficial em risco imediato. O SinalSeguro nao substitui o atendimento publico de emergencia."
        onClose={() => setConfirmOpen(false)}
        title="Ligar para 190?"
        visible={confirmOpen}
      />
    </>
  );
}
