import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LockKeyhole } from "lucide-react-native";
import { BrandedDialog } from "@/components/BrandedDialog";
import { theme } from "@/design/theme";
import { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";
import { hasSecurityCode, unlockProtectedAccess, verifySecurityCodeStatus } from "@/security/protectedAccess";

type ProtectedAccessGateProps = {
  visible: boolean;
  preferences?: EmergencyPreferences | null;
  title?: string;
  message?: string;
  onUnlocked: () => void;
  onCancel: () => void;
};

export function ProtectedAccessGate({
  visible,
  preferences,
  title = "Codigo de seguranca",
  message = "Informe o codigo para continuar.",
  onUnlocked,
  onCancel
}: ProtectedAccessGateProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function submitCode() {
    if (!preferences || !hasSecurityCode(preferences)) {
      onUnlocked();
      return;
    }

    const verification = await verifySecurityCodeStatus(preferences, code);
    if (!verification.ok) {
      setError(verification.message);
      return;
    }

    setCode("");
    setError("");
    await unlockProtectedAccess();
    onUnlocked();
  }

  if (!preferences || !hasSecurityCode(preferences)) {
    return null;
  }

  return (
    <BrandedDialog
      actions={[
        { label: "Cancelar", tone: "muted", onPress: onCancel },
        { label: "Liberar", onPress: submitCode, autoClose: false }
      ]}
      icon={<LockKeyhole size={20} color={theme.colors.primary} />}
      message={message}
      onClose={onCancel}
      title={title}
      visible={visible}
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Codigo</Text>
        <TextInput
          accessibilityLabel="Codigo de seguranca"
          autoCapitalize="none"
          keyboardType="number-pad"
          onChangeText={(value) => {
            setCode(value);
            setError("");
          }}
          placeholder="Codigo"
          secureTextEntry
          style={styles.input}
          value={code}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </BrandedDialog>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  fieldGroup: {
    gap: theme.spacing.xs
  },
  input: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "800",
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "900"
  }
});
