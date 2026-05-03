import { Alert, Linking, StyleProp, ViewStyle } from "react-native";
import { PhoneCall } from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { theme } from "@/design/theme";

type EmergencyCallButtonProps = {
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmergencyCallButton({ compact = false, style }: EmergencyCallButtonProps) {
  function confirmCall() {
    Alert.alert(
      "Ligar para 190",
      "O 190 e o canal oficial em risco imediato. O SinalSeguro nao substitui o atendimento publico de emergencia.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ligar",
          style: "default",
          onPress: () => {
            void Linking.openURL("tel:190");
          }
        }
      ]
    );
  }

  return (
    <ButtonIcon
      icon={<PhoneCall size={compact ? 18 : 20} color={theme.colors.primary} />}
      label="Ligar 190"
      onPress={confirmCall}
      style={style}
    />
  );
}
