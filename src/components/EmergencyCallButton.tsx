import { useState } from "react";
import { Linking, StyleProp, ViewStyle } from "react-native";
import { PhoneCall } from "lucide-react-native";
import { BrandedDialog } from "@/components/BrandedDialog";
import { ButtonIcon } from "@/components/ButtonIcon";
import { theme } from "@/design/theme";
import { resolveEmergencyCallButtonPresentation } from "@/components/emergencyCallButtonPresentationPolicy";

type EmergencyCallButtonProps = {
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmergencyCallButton({ compact = false, style }: EmergencyCallButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const presentation = resolveEmergencyCallButtonPresentation(compact);

  function confirmCall() {
    setConfirmOpen(true);
  }

  return (
    <>
      <ButtonIcon
        icon={<PhoneCall size={presentation.buttonIconSize} color={theme.colors.primary} />}
        label={presentation.buttonLabel}
        onPress={confirmCall}
        style={style}
      />
      <BrandedDialog
        actions={[
          { label: presentation.cancelLabel, tone: "muted" },
          {
            label: presentation.confirmLabel,
            onPress: () => {
              void Linking.openURL("tel:190");
            }
          }
        ]}
        icon={<PhoneCall size={presentation.dialogIconSize} color={theme.colors.primary} />}
        message={presentation.dialogMessage}
        onClose={() => setConfirmOpen(false)}
        title={presentation.dialogTitle}
        visible={confirmOpen}
      />
    </>
  );
}
